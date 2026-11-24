import { createServerFn } from "@tanstack/react-start";

import { explainMatchInputSchema, profileInputSchema } from "./schemas";

/** Generates the AI Skills Passport for a submitted profile. */
export const analyzeProfile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => profileInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { runSkillsAnalysis } = await import("./analysis.server");
    return runSkillsAnalysis(data);
  });

/** Explains, in plain language, why an opportunity matches the candidate. */
export const explainMatch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => explainMatchInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { runMatchExplanation } = await import("./analysis.server");
    return runMatchExplanation(data);
  });
