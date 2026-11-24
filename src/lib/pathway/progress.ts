import { PATHWAY_STAGES, type PathwayStage, type SkillsAnalysis } from "./types";

export interface PathwayStep {
  stage: PathwayStage;
  title: string;
  actions: { key: string; label: string; done: boolean; auto?: boolean }[];
  done: number;
  total: number;
}

const STAGE_TITLES: Record<PathwayStage, string> = {
  Strengthen: "Close the most important gaps",
  Connect: "Build your local network",
  Prepare: "Get application-ready",
  Apply: "Go for matched roles",
  Progress: "Track and keep moving",
};

/**
 * Builds the 5-stage pathway from the AI plan. "Connect" and "Apply" each get an automatic
 * milestone that completes when the user requests a mentor or records an application.
 */
export function buildPathway(
  analysis: SkillsAnalysis,
  completed: Record<string, boolean>,
  counts: { mentorRequests: number; applications: number },
): { steps: PathwayStep[]; percent: number; done: number; total: number } {
  const steps = PATHWAY_STAGES.map((stage) => {
    const fromAi = analysis.pathway.find((p) => p.stage === stage)?.actions ?? [];
    const actions = fromAi.slice(0, 3).map((label, i) => {
      const key = `${stage}:${i}`;
      return { key, label, done: Boolean(completed[key]) };
    });
    if (stage === "Connect")
      actions.unshift({ key: "auto:mentor", label: "Request a mentor connection", done: counts.mentorRequests > 0, auto: true });
    if (stage === "Apply")
      actions.unshift({ key: "auto:apply", label: "Record your first application", done: counts.applications > 0, auto: true });
    const done = actions.filter((a) => a.done).length;
    return { stage, title: STAGE_TITLES[stage], actions, done, total: actions.length };
  });
  const done = steps.reduce((n, s) => n + s.done, 0);
  const total = steps.reduce((n, s) => n + s.total, 0);
  return { steps, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
