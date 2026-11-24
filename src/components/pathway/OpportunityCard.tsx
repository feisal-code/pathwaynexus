import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, Loader2, MapPin, Sparkles, Briefcase } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { explainMatch } from "@/lib/pathway/ai.functions";
import { candidateSkills } from "@/lib/pathway/matching";
import { usePathway } from "@/lib/pathway/store";
import type { OpportunityMatch, StoredAnalysis, TalentProfile } from "@/lib/pathway/types";

import { AiBadge, DemoBadge, MatchScore, SkillChip } from "./common";

export function OpportunityCard({
  match,
  profile,
  analysis,
}: {
  match: OpportunityMatch;
  profile: TalentProfile;
  analysis: StoredAnalysis;
}) {
  const { opportunity: o, score, strengths, gaps, action } = match;
  const { explanations, setExplanation, applications, toggleApplication } = usePathway();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const explanation = explanations[o.id];
  const applied = Boolean(applications[o.id]);

  const explain = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await explainMatch({
        data: {
          profileSummary: analysis.analysis.summary,
          skills: candidateSkills(profile, analysis.analysis).slice(0, 40),
          gaps: analysis.analysis.skillGaps.map((g) => g.gap).slice(0, 10),
          opportunity: { title: o.title, organization: o.organization, summary: o.summary, requiredSkills: o.requiredSkills },
          score,
        },
      });
      if (res.ok) setExplanation(o.id, res.data);
      else setError(res.message);
    } catch {
      setError("We couldn't reach the AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border bg-card p-6 shadow-card transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <DemoBadge />
          <h3 className="pt-1 text-2xl font-medium leading-tight">{o.title}</h3>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Building2 className="size-3.5" aria-hidden="true" />{o.organization}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" aria-hidden="true" />{o.location}</span>
            <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" aria-hidden="true" />{o.workType}</span>
          </p>
        </div>
        <MatchScore value={score} size={72} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{o.summary}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-2 text-muted-foreground">Matching strengths</p>
          <div className="flex flex-wrap gap-1.5">
            {strengths.length ? strengths.map((s) => <SkillChip key={s} tone="strength">{s}</SkillChip>) : <span className="text-sm text-muted-foreground">None yet</span>}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-2 text-muted-foreground">Skill gaps</p>
          <div className="flex flex-wrap gap-1.5">
            {gaps.length ? gaps.map((g) => <SkillChip key={g} tone="gap">{g}</SkillChip>) : <span className="text-sm text-muted-foreground">No major gaps</span>}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-secondary px-4 py-3">
        <p className="eyebrow text-muted-foreground">Recommended action</p>
        <p className="mt-1 font-semibold">{action}</p>
      </div>

      {explanation && (
        <div className="mt-4 animate-rise space-y-2 rounded-xl border border-accent/40 bg-accent-soft/60 p-4 text-sm leading-relaxed">
          <AiBadge label="AI explanation" />
          <p>{explanation.explanation}</p>
          <p><span className="font-semibold">Watch out: </span>{explanation.watchOut}</p>
          <p><span className="font-semibold">Next: </span>{explanation.action}</p>
        </div>
      )}
      {error && <p className="mt-4 text-sm text-destructive" role="alert">{error}</p>}

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {!explanation && (
          <Button variant="outline" size="sm" onClick={explain} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {loading ? "Explaining…" : "Explain this match"}
          </Button>
        )}
        {gaps.length > 0 && (
          <Button asChild variant="ghost" size="sm">
            <Link to="/mentors">Find a mentor <ArrowRight /></Link>
          </Button>
        )}
        <Button
          size="sm"
          variant={applied ? "secondary" : "default"}
          className="ml-auto"
          aria-pressed={applied}
          onClick={() => {
            toggleApplication(o.id);
            toast.success(applied ? "Removed from your applications" : "Added to your pathway", {
              description: applied ? undefined : `${o.title} · ${o.organization}`,
            });
          }}
        >
          {applied ? <><Check /> Applied</> : "Mark as applied"}
        </Button>
      </div>
    </article>
  );
}
