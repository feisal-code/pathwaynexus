import { z } from "zod";

import { PATHWAY_STAGES, PROFESSIONAL_FIELDS, WORK_TYPES } from "./types";

/** Input validation for the profile sent to the AI analysis. */
export const profileInputSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  countryOfResidence: z.string().trim().min(1).max(80),
  professionalField: z.enum(PROFESSIONAL_FIELDS),
  yearsOfExperience: z.number().min(0).max(60),
  education: z.string().trim().max(400),
  skills: z.array(z.string().trim().min(1).max(60)).min(1).max(30),
  languages: z.array(z.string().trim().min(1).max(40)).max(12),
  previousRoles: z.string().trim().max(2000),
  careerGoal: z.string().trim().max(600),
  preferredWorkType: z.enum(WORK_TYPES),
});

/**
 * Structured-output schema for the Skills Passport.
 * Strict-mode friendly: every field required, no min/max constraints, object root.
 */
export const analysisOutputSchema = z.object({
  summary: z.string().describe("2-3 sentence professional profile in third person, warm and factual"),
  coreSkills: z.array(z.string()).describe("6-10 core professional skills, short labels"),
  transferableSkills: z
    .array(z.object({ skill: z.string(), evidence: z.string() }))
    .describe("4-6 transferable skills, each with one-sentence evidence drawn from the profile"),
  potentialRoles: z
    .array(z.object({ title: z.string(), fit: z.number(), reason: z.string() }))
    .describe("3-5 realistic target roles; fit is 0-100"),
  readinessScore: z.number().describe("Career readiness 0-100 for the stated goal"),
  readinessRationale: z.string().describe("One sentence explaining the readiness score"),
  strengths: z.array(z.string()).describe("3-5 strengths, short phrases"),
  skillGaps: z
    .array(
      z.object({
        gap: z.string(),
        why: z.string(),
        priority: z.enum(["high", "medium", "low"]),
      }),
    )
    .describe("2-4 practical gaps for the local job market, e.g. local regulation, certifications, tools"),
  mentorTypes: z.array(z.string()).describe("2-3 mentor profiles that would help, e.g. 'NGO finance manager'"),
  nextSteps: z.array(z.string()).describe("3-5 concrete next steps, imperative voice"),
  pathway: z
    .array(
      z.object({
        stage: z.enum(PATHWAY_STAGES),
        actions: z.array(z.string()),
      }),
    )
    .describe("Exactly 5 entries in order Strengthen, Connect, Prepare, Apply, Progress; 2-3 short actions each"),
});

export const explainMatchInputSchema = z.object({
  profileSummary: z.string().max(1500),
  skills: z.array(z.string().max(80)).max(40),
  gaps: z.array(z.string().max(200)).max(10),
  opportunity: z.object({
    title: z.string().max(120),
    organization: z.string().max(120),
    summary: z.string().max(800),
    requiredSkills: z.array(z.string().max(80)).max(20),
  }),
  score: z.number(),
});

export const matchExplanationSchema = z.object({
  explanation: z.string().describe("2-3 sentences on why this role fits, referencing specific experience"),
  watchOut: z.string().describe("One sentence on the most important gap to address before applying"),
  action: z.string().describe("One concrete next action, imperative voice"),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
export type MatchExplanation = z.infer<typeof matchExplanationSchema>;
