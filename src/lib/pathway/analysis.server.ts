import { AiGatewayError, generateStructured } from "@/lib/ai/gateway.server";

import { analysisOutputSchema, matchExplanationSchema, type ProfileInput } from "./schemas";
import type { AiResult, SkillsAnalysis } from "./types";
import type { MatchExplanation } from "./schemas";
import type { z } from "zod";
import type { explainMatchInputSchema } from "./schemas";

const PASSPORT_INSTRUCTIONS = `You are a careful career-pathway advisor for Pathway Nexus, a platform that helps skilled displaced people and refugees translate existing experience into employment pathways in their country of residence.

Rules:
- Base every statement on the profile provided. Do not invent employers, degrees or certifications.
- This is an assessment and recommendation, never an official verification of qualifications. Do not claim to verify credentials.
- Be respectful and strengths-based. Never reference trauma, legal status or nationality as a weakness.
- Skill gaps should be practical and solvable (local regulations, local tools/software, certifications recognised locally, language for the workplace, local networks).
- Keep labels short (1-4 words) and sentences concise.
- Do not cite statistics.`;

function profileToPrompt(p: ProfileInput) {
  return [
    `Professional field: ${p.professionalField}`,
    `Country of residence: ${p.countryOfResidence}`,
    `Years of experience: ${p.yearsOfExperience}`,
    `Education: ${p.education || "Not provided"}`,
    `Skills: ${p.skills.join(", ")}`,
    `Languages: ${p.languages.join(", ") || "Not provided"}`,
    `Previous roles: ${p.previousRoles || "Not provided"}`,
    `Career goal: ${p.careerGoal || "Not provided"}`,
    `Preferred work type: ${p.preferredWorkType}`,
  ].join("\n");
}

function toFailure(error: unknown): { ok: false; status: number; message: string } {
  if (error instanceof AiGatewayError) return { ok: false, status: error.status, message: error.message };
  console.error(error);
  return { ok: false, status: 500, message: "Something went wrong while generating the analysis." };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export async function runSkillsAnalysis(profile: ProfileInput, signal?: AbortSignal): Promise<AiResult<SkillsAnalysis>> {
  try {
    const out = await generateStructured({
      schema: analysisOutputSchema,
      instructions: PASSPORT_INSTRUCTIONS,
      prompt: `Create a Skills Passport for this professional (first name only for reference: ${profile.fullName.split(" ")[0]}).\n\n${profileToPrompt(profile)}`,
      effort: "medium",
      ...(signal ? { signal } : {}),
    });
    return {
      ok: true,
      data: {
        ...out,
        readinessScore: clamp(out.readinessScore),
        potentialRoles: out.potentialRoles.map((r) => ({ ...r, fit: clamp(r.fit) })),
      },
    };
  } catch (error) {
    return toFailure(error);
  }
}

export async function runMatchExplanation(
  input: z.infer<typeof explainMatchInputSchema>,
  signal?: AbortSignal,
): Promise<AiResult<MatchExplanation>> {
  try {
    const out = await generateStructured({
      schema: matchExplanationSchema,
      instructions: `${PASSPORT_INSTRUCTIONS}\n\nYou explain why a specific opportunity matches a candidate. Speak directly to the candidate ("you"). The match score was computed by the platform; do not restate it as a number.`,
      prompt: [
        `Candidate summary: ${input.profileSummary}`,
        `Candidate skills: ${input.skills.join(", ")}`,
        `Known gaps: ${input.gaps.join("; ") || "None identified"}`,
        ``,
        `Opportunity: ${input.opportunity.title} at ${input.opportunity.organization}`,
        `Description: ${input.opportunity.summary}`,
        `Required skills: ${input.opportunity.requiredSkills.join(", ")}`,
      ].join("\n"),
      effort: "low",
      ...(signal ? { signal } : {}),
    });
    return { ok: true, data: out };
  } catch (error) {
    return toFailure(error);
  }
}
