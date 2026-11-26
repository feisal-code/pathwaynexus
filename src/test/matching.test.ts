import { describe, expect, it } from "vitest";
import { TALENT_POOL } from "@/lib/pathway/demo-data";
import { skillsMatch } from "@/lib/pathway/matching";

describe("Partner search demo", () => {
  it("contains six anonymised candidate profiles", () => {
    expect(TALENT_POOL).toHaveLength(6);
    expect(new Set(TALENT_POOL.map((talent) => talent.code)).size).toBe(6);
  });
  it("matches React to the developer and not the finance candidate", () => {
    const matches = TALENT_POOL.filter((talent) => talent.skills.some((skill) => skillsMatch(skill, "React")));
    expect(matches.map((talent) => talent.id)).toEqual(["t-4"]);
    expect(skillsMatch("Budgeting", "React")).toBe(false);
  });
});