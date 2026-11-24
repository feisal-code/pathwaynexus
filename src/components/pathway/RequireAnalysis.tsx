import { Link } from "@tanstack/react-router";
import { AlertCircle, FileUser, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathway } from "@/lib/pathway/store";
import type { StoredAnalysis, TalentProfile } from "@/lib/pathway/types";

import { EmptyState } from "./common";

const LOADING_STEPS = [
  "Reading your experience and roles",
  "Identifying core and transferable skills",
  "Mapping potential career roles",
  "Spotting practical skill gaps",
  "Drafting your personalised pathway",
];

export function AnalysisLoading() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1)), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div role="status" aria-live="polite" className="mx-auto my-10 max-w-xl overflow-hidden rounded-2xl passport-pattern p-8 shadow-lift">
      <div className="flex items-center gap-3">
        <Sparkles className="size-5 text-accent" aria-hidden="true" />
        <p className="eyebrow text-ink-muted">AI skills analysis in progress</p>
      </div>
      <h2 className="mt-4 text-3xl font-medium">Building your Skills Passport…</h2>
      <p className="mt-2 text-sm text-ink-muted">This usually takes 20–40 seconds.</p>
      <div className="relative mt-6 h-1 overflow-hidden rounded-full bg-ink-border">
        <div className="absolute inset-y-0 w-1/3 rounded-full bg-accent animate-scan" />
      </div>
      <ol className="mt-6 space-y-3">
        {LOADING_STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 text-sm transition-opacity ${i <= step ? "opacity-100" : "opacity-40"}`}>
            {i < step ? (
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            ) : i === step ? (
              <Loader2 className="size-3.5 animate-spin text-accent" aria-hidden="true" />
            ) : (
              <span className="size-2 rounded-full border border-ink-muted" aria-hidden="true" />
            )}
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 py-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

/** Gate for pages that need a profile and a generated analysis; renders loading, error and empty states. */
export function RequireAnalysis({
  children,
}: {
  children: (data: { profile: TalentProfile; analysis: StoredAnalysis }) => ReactNode;
}) {
  const { hydrated, profile, analysis, analysisStatus, retryAnalysis, applySampleAnalysis, loadDemo } = usePathway();

  if (!hydrated) return <PageSkeleton />;
  if (analysisStatus.state === "loading") return <AnalysisLoading />;

  if (!profile) {
    return (
      <EmptyState
        icon={<FileUser />}
        title="Start with your talent profile"
        description="Tell us about your experience and skills. We'll turn it into a Skills Passport, matches and a pathway."
      >
        <Button asChild size="lg">
          <Link to="/profile">Create my profile</Link>
        </Button>
        <Button variant="outline" size="lg" onClick={loadDemo}>
          Explore with a demo profile
        </Button>
      </EmptyState>
    );
  }

  if (!analysis) {
    if (analysisStatus.state === "error") {
      return (
        <EmptyState icon={<AlertCircle />} title="We couldn't generate your analysis" description={analysisStatus.message}>
          {analysisStatus.status !== 402 && analysisStatus.status !== 403 && (
            <Button size="lg" onClick={retryAnalysis}>
              Try again
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={applySampleAnalysis}>
            Continue with a sample analysis
          </Button>
        </EmptyState>
      );
    }
    return (
      <EmptyState
        icon={<Sparkles />}
        title="Your profile is ready for analysis"
        description="Generate your AI Skills Passport to unlock opportunity and mentor matches."
      >
        <Button size="lg" onClick={retryAnalysis}>
          Generate Skills Passport
        </Button>
      </EmptyState>
    );
  }

  return <>{children({ profile, analysis })}</>;
}
