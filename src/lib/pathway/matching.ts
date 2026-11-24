/**
 * Transparent, rule-based matching. The AI analysis enriches the candidate's skills;
 * these functions compute scores deterministically so results are explainable and testable.
 */
import type {
  Mentor,
  MentorMatch,
  Opportunity,
  OpportunityMatch,
  SkillsAnalysis,
  TalentProfile,
} from "./types";

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+#/& ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set(["and", "the", "of", "for", "in", "to", "a", "with", "local", "skills", "&"]);

const tokens = (s: string) => normalize(s).split(" ").filter((t) => t.length > 2 && !STOP.has(t));

/** Two skill labels match if one contains the other, or they share a meaningful word. */
export function skillsMatch(a: string, b: string): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb || na.includes(nb) || nb.includes(na)) return true;
  const tb = new Set(tokens(b));
  return tokens(a).some((t) => tb.has(t));
}

/** All skills known for the candidate: profile input plus AI-extracted skills. */
export function candidateSkills(profile: TalentProfile, analysis?: SkillsAnalysis | null): string[] {
  const all = [
    ...profile.skills,
    ...(analysis?.coreSkills ?? []),
    ...(analysis?.transferableSkills.map((t) => t.skill) ?? []),
  ];
  const seen = new Set<string>();
  return all.filter((s) => {
    const k = normalize(s);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/**
 * Score = 60 × required-skill coverage + 25 for same field + up to 10 for experience
 * + 5 for preferred work type. Clamped to 20–98 (never claims a perfect match).
 */
export function scoreOpportunity(
  opp: Opportunity,
  profile: TalentProfile,
  analysis?: SkillsAnalysis | null,
): OpportunityMatch {
  const skills = candidateSkills(profile, analysis);
  const strengths = opp.requiredSkills.filter((req) => skills.some((s) => skillsMatch(s, req)));
  const missing = opp.requiredSkills.filter((req) => !strengths.includes(req));
  const coverage = opp.requiredSkills.length ? strengths.length / opp.requiredSkills.length : 0;

  const fieldBonus = profile.professionalField === opp.field ? 25 : 0;
  const expBonus =
    profile.yearsOfExperience >= opp.minYears ? 10 : Math.max(0, 10 - (opp.minYears - profile.yearsOfExperience) * 4);
  const workBonus =
    profile.preferredWorkType === opp.workType ||
    (opp.workType === "Remote" && profile.preferredWorkType === "Hybrid")
      ? 5
      : 0;

  const score = Math.round(clamp(coverage * 60 + fieldBonus + expBonus + workBonus, 20, 98));
  const gaps = [...opp.contextGaps, ...missing].slice(0, 3);

  let action: string;
  if (score >= 85) action = gaps[0] ? `Connect with a mentor on ${gaps[0].toLowerCase()}` : "Apply now";
  else if (score >= 65) action = missing[0] ? `Strengthen ${missing[0]} before applying` : "Tailor your CV and apply";
  else action = "Explore as a longer-term goal";

  return { opportunity: opp, score, strengths, gaps, action };
}

export function matchOpportunities(
  opps: Opportunity[],
  profile: TalentProfile,
  analysis?: SkillsAnalysis | null,
): OpportunityMatch[] {
  return opps.map((o) => scoreOpportunity(o, profile, analysis)).sort((a, b) => b.score - a.score);
}

/**
 * Mentor score = 45 × share of candidate gaps the mentor covers (capped at 2 gaps)
 * + 25 same industry + 15 skill overlap + 10 same country. Clamped 30–97.
 */
export function scoreMentor(
  mentor: Mentor,
  profile: TalentProfile,
  analysis?: SkillsAnalysis | null,
): MentorMatch {
  const gaps = analysis?.skillGaps.map((g) => g.gap) ?? [];
  const mentorTypes = analysis?.mentorTypes ?? [];
  const coveredGaps = gaps.filter((g) => mentor.expertise.some((e) => skillsMatch(e, g)));
  const skills = candidateSkills(profile, analysis);
  const sharedSkills = mentor.expertise.filter((e) => skills.some((s) => skillsMatch(s, e)));
  const typeMatch = mentorTypes.some((t) => skillsMatch(t, mentor.role) || mentor.expertise.some((e) => skillsMatch(e, t)));

  const gapScore = gaps.length ? Math.min(coveredGaps.length, 2) / Math.min(gaps.length, 2) : 0;
  const sameIndustry = mentor.industry === profile.professionalField;
  const country = normalize(profile.countryOfResidence);
  const sameCountry = country.length > 0 && normalize(mentor.location).includes(country);

  const raw =
    gapScore * 45 +
    (sameIndustry ? 25 : 0) +
    Math.min(sharedSkills.length, 3) * 5 +
    (sameCountry || mentor.location === "Remote" ? 10 : 0) +
    (typeMatch ? 5 : 0);
  const score = Math.round(clamp(raw, 30, 97));

  let reason: string;
  if (coveredGaps[0]) {
    reason = `Recommended because this mentor's experience aligns with your identified gap in ${coveredGaps[0].toLowerCase()}.`;
  } else if (sameIndustry) {
    reason = `Recommended because this mentor works in ${mentor.industry.toLowerCase()} and can share how the local sector hires.`;
  } else if (sharedSkills[0]) {
    reason = `Recommended because you share expertise in ${sharedSkills[0].toLowerCase()}.`;
  } else {
    reason = "A broader connection who can help you understand the local job market.";
  }

  return { mentor, score, reason, matchedAreas: [...coveredGaps, ...sharedSkills].slice(0, 4) };
}

export function matchMentors(mentors: Mentor[], profile: TalentProfile, analysis?: SkillsAnalysis | null) {
  return mentors.map((m) => scoreMentor(m, profile, analysis)).sort((a, b) => b.score - a.score);
}
