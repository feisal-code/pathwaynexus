/** Core domain types for Pathway Nexus. Kept framework-free so they can move to a database later. */

export const WORK_TYPES = ["Full-time", "Part-time", "Remote", "Hybrid", "Contract", "Volunteer"] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const PROFESSIONAL_FIELDS = [
  "Finance & Accounting",
  "Healthcare",
  "Engineering",
  "Information Technology",
  "Education",
  "Humanitarian & NGO",
  "Logistics & Supply Chain",
  "Agriculture",
  "Business & Administration",
  "Legal",
] as const;
export type ProfessionalField = (typeof PROFESSIONAL_FIELDS)[number];

export interface TalentProfile {
  fullName: string;
  countryOfResidence: string;
  professionalField: ProfessionalField | "";
  yearsOfExperience: number;
  education: string;
  skills: string[];
  languages: string[];
  previousRoles: string;
  careerGoal: string;
  preferredWorkType: WorkType | "";
}

export type GapPriority = "high" | "medium" | "low";
export const PATHWAY_STAGES = ["Strengthen", "Connect", "Prepare", "Apply", "Progress"] as const;
export type PathwayStage = (typeof PATHWAY_STAGES)[number];

export interface SkillsAnalysis {
  summary: string;
  coreSkills: string[];
  transferableSkills: { skill: string; evidence: string }[];
  potentialRoles: { title: string; fit: number; reason: string }[];
  readinessScore: number;
  readinessRationale: string;
  strengths: string[];
  skillGaps: { gap: string; why: string; priority: GapPriority }[];
  mentorTypes: string[];
  nextSteps: string[];
  pathway: { stage: PathwayStage; actions: string[] }[];
}

export interface StoredAnalysis {
  analysis: SkillsAnalysis;
  generatedAt: string;
  source: "ai" | "sample";
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  workType: WorkType;
  field: ProfessionalField;
  summary: string;
  requiredSkills: string[];
  /** Context gaps common for newcomers (e.g. local regulation) shown when relevant. */
  contextGaps: string[];
  minYears: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  industry: ProfessionalField;
  yearsExperience: number;
  location: string;
  expertise: string[];
  bio: string;
}

export interface AnonymizedTalent {
  id: string;
  code: string;
  headline: string;
  field: ProfessionalField;
  yearsOfExperience: number;
  location: string;
  workType: WorkType;
  skills: string[];
  languages: string[];
  readinessScore: number;
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  score: number;
  strengths: string[];
  gaps: string[];
  action: string;
}

export interface MentorMatch {
  mentor: Mentor;
  score: number;
  reason: string;
  matchedAreas: string[];
}

export type AiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };
