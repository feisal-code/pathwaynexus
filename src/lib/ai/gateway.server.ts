import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, NoObjectGeneratedError, Output, streamText, type FlexibleSchema } from "ai";

import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const GATEWAY_BASE_URL = "https://ai.gateway.lovable.dev/v1";
const DEFAULT_MODEL = "openai/gpt-6-astra";

export class AiGatewayError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function friendlyMessage(status: number, raw: string) {
  if (status === 429) return "The AI service is busy right now. Please wait a moment and try again.";
  if (status === 402)
    return raw || "AI credits for this workspace are used up. Add credits to continue generating analyses.";
  if (status === 403) return raw || "AI access is currently not available for this workspace.";
  if (status === 401) return "The AI service is not configured correctly.";
  if (status >= 500) return "The AI service had a temporary problem. Please try again shortly.";
  return raw || "The AI request could not be completed.";
}

function safeErrorText(error: APICallError) {
  try {
    const body = JSON.parse(error.responseBody ?? "{}") as { message?: string; error?: { message?: string } };
    return body.message ?? body.error?.message ?? "";
  } catch {
    return "";
  }
}

/**
 * Streams a structured-output call through Lovable AI Gateway (Responses API) and
 * returns the final validated object. Server-only: reads LOVABLE_API_KEY.
 */
export async function generateStructured<T>(options: {
  schema: FlexibleSchema<T>;
  instructions: string;
  prompt: string;
  effort?: "low" | "medium";
  signal?: AbortSignal;
}): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiGatewayError(401, "The AI service is not configured.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY_BASE_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  let streamError: unknown;
  const result = streamText({
    model: provider.responses(DEFAULT_MODEL),
    instructions: options.instructions,
    messages: [{ role: "user", content: options.prompt }],
    output: Output.object({ schema: options.schema }),
    ...(options.signal ? { abortSignal: options.signal } : {}),
    onError: ({ error }) => {
      streamError = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: options.effort ?? "medium",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  try {
    // Drain the stream server-side; only the final object is needed.
    await result.consumeStream();
    return (await result.output) as T;
  } catch (error) {
    const cause = streamError ?? error;
    if (APICallError.isInstance(cause)) {
      const status = cause.statusCode ?? 500;
      throw new AiGatewayError(status, friendlyMessage(status, safeErrorText(cause)));
    }
    if (NoObjectGeneratedError.isInstance(error)) {
      throw new AiGatewayError(502, "The AI response could not be read. Please try again.");
    }
    if (cause instanceof Error && cause.name === "AbortError") {
      throw new AiGatewayError(499, "Request cancelled.");
    }
    console.error("AI gateway call failed", cause);
    throw new AiGatewayError(500, "The AI service had a temporary problem. Please try again shortly.");
  }
}
