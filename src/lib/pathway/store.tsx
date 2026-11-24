import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { analyzeProfile } from "./ai.functions";
import { DEMO_PROFILE, SAMPLE_ANALYSIS } from "./demo-data";
import type { MatchExplanation } from "./schemas";
import type { StoredAnalysis, TalentProfile } from "./types";

/**
 * Client-side app state persisted to localStorage (prototype: data stays on this device).
 * The shape mirrors future database tables so it can be swapped for a backend.
 */
interface PersistedState {
  profile: TalentProfile | null;
  analysis: StoredAnalysis | null;
  completedActions: Record<string, boolean>;
  mentorRequests: Record<string, string>; // mentorId -> ISO date
  applications: Record<string, string>; // opportunityId -> ISO date
  partnerInterests: Record<string, string>; // talentId -> ISO date
}

const EMPTY: PersistedState = {
  profile: null,
  analysis: null,
  completedActions: {},
  mentorRequests: {},
  applications: {},
  partnerInterests: {},
};

const STORAGE_KEY = "pathway-nexus:v1";

type AnalysisStatus = { state: "idle" } | { state: "loading" } | { state: "error"; message: string; status: number };

interface PathwayStore extends PersistedState {
  hydrated: boolean;
  analysisStatus: AnalysisStatus;
  explanations: Record<string, MatchExplanation>;
  saveProfileAndAnalyze: (profile: TalentProfile) => void;
  retryAnalysis: () => void;
  applySampleAnalysis: () => void;
  loadDemo: () => void;
  toggleAction: (key: string) => void;
  requestMentor: (id: string) => void;
  cancelMentorRequest: (id: string) => void;
  toggleApplication: (id: string) => void;
  togglePartnerInterest: (id: string) => void;
  setExplanation: (id: string, e: MatchExplanation) => void;
  resetAll: () => void;
}

const Ctx = createContext<PathwayStore | null>(null);

export function PathwayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>({ state: "idle" });
  const [explanations, setExplanations] = useState<Record<string, MatchExplanation>>({});
  const requestId = useRef(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as Partial<PersistedState>) });
    } catch {
      /* corrupted storage: start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or disabled */
    }
  }, [state, hydrated]);

  const runAnalysis = useCallback(async (profile: TalentProfile) => {
    const id = ++requestId.current;
    setAnalysisStatus({ state: "loading" });
    try {
      const res = await analyzeProfile({ data: profile });
      if (id !== requestId.current) return;
      if (res.ok) {
        setState((s) => ({
          ...s,
          analysis: { analysis: res.data, generatedAt: new Date().toISOString(), source: "ai" },
          completedActions: {},
        }));
        setExplanations({});
        setAnalysisStatus({ state: "idle" });
      } else {
        setAnalysisStatus({ state: "error", message: res.message, status: res.status });
      }
    } catch (error) {
      if (id !== requestId.current) return;
      console.error(error);
      setAnalysisStatus({
        state: "error",
        status: 0,
        message: "We couldn't reach the analysis service. Check your connection and try again.",
      });
    }
  }, []);

  const value = useMemo<PathwayStore>(
    () => ({
      ...state,
      hydrated,
      analysisStatus,
      explanations,
      saveProfileAndAnalyze: (profile) => {
        setState((s) => ({ ...s, profile, analysis: null }));
        void runAnalysis(profile);
      },
      retryAnalysis: () => {
        if (state.profile) void runAnalysis(state.profile);
      },
      applySampleAnalysis: () => {
        requestId.current++;
        setAnalysisStatus({ state: "idle" });
        setState((s) => ({ ...s, analysis: { ...SAMPLE_ANALYSIS, generatedAt: new Date().toISOString() } }));
      },
      loadDemo: () => {
        requestId.current++;
        setAnalysisStatus({ state: "idle" });
        setExplanations({});
        setState({
          ...EMPTY,
          profile: DEMO_PROFILE,
          analysis: { ...SAMPLE_ANALYSIS, generatedAt: new Date().toISOString() },
        });
      },
      toggleAction: (key) =>
        setState((s) => ({ ...s, completedActions: { ...s.completedActions, [key]: !s.completedActions[key] } })),
      requestMentor: (id) =>
        setState((s) => ({ ...s, mentorRequests: { ...s.mentorRequests, [id]: new Date().toISOString() } })),
      cancelMentorRequest: (id) =>
        setState((s) => {
          const next = { ...s.mentorRequests };
          delete next[id];
          return { ...s, mentorRequests: next };
        }),
      toggleApplication: (id) =>
        setState((s) => {
          const next = { ...s.applications };
          if (next[id]) delete next[id];
          else next[id] = new Date().toISOString();
          return { ...s, applications: next };
        }),
      togglePartnerInterest: (id) =>
        setState((s) => {
          const next = { ...s.partnerInterests };
          if (next[id]) delete next[id];
          else next[id] = new Date().toISOString();
          return { ...s, partnerInterests: next };
        }),
      setExplanation: (id, e) => setExplanations((x) => ({ ...x, [id]: e })),
      resetAll: () => {
        requestId.current++;
        setAnalysisStatus({ state: "idle" });
        setExplanations({});
        setState(EMPTY);
      },
    }),
    [state, hydrated, analysisStatus, explanations, runAnalysis],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePathway() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePathway must be used inside PathwayProvider");
  return ctx;
}
