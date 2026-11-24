import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Lock, RotateCcw } from "lucide-react";
import { useMemo } from "react";

import { JourneySteps } from "@/components/pathway/JourneySteps";
import { RequireAnalysis } from "@/components/pathway/RequireAnalysis";
import { AiBadge, Page, PageHeader } from "@/components/pathway/common";
import { Button } from "@/components/ui/button";
import { MENTORS, OPPORTUNITIES } from "@/lib/pathway/demo-data";
import { buildPathway } from "@/lib/pathway/progress";
import { usePathway } from "@/lib/pathway/store";
import type { StoredAnalysis } from "@/lib/pathway/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pathway")({
  head: () => ({
    meta: [
      { title: "My Pathway — Pathway Nexus" },
      { name: "description", content: "Your personalised five-step career pathway: Strengthen, Connect, Prepare, Apply, Progress." },
      { property: "og:title", content: "My Pathway — Pathway Nexus" },
      { property: "og:description", content: "Track practical next steps from skills to opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PathwayPage,
});

function PathwayPage() {
  return (
    <Page>
      <JourneySteps current="/pathway" />
      <RequireAnalysis>{({ analysis }) => <Dashboard analysis={analysis} />}</RequireAnalysis>
    </Page>
  );
}

const STAGE_LINK = {
  Strengthen: { to: "/passport", label: "Review your gaps" },
  Connect: { to: "/mentors", label: "Find mentors" },
  Prepare: { to: "/profile", label: "Update your profile" },
  Apply: { to: "/opportunities", label: "See matches" },
  Progress: null,
} as const;

function Dashboard({ analysis }: { analysis: StoredAnalysis }) {
  const { completedActions, mentorRequests, applications, toggleAction, resetAll } = usePathway();
  const { steps, percent, done, total } = useMemo(
    () =>
      buildPathway(analysis.analysis, completedActions, {
        mentorRequests: Object.keys(mentorRequests).length,
        applications: Object.keys(applications).length,
      }),
    [analysis, completedActions, mentorRequests, applications],
  );
  const currentIdx = steps.findIndex((s) => s.done < s.total);
  const requested = MENTORS.filter((m) => mentorRequests[m.id]);
  const applied = OPPORTUNITIES.filter((o) => applications[o.id]);

  return (
    <>
      <PageHeader
        eyebrow="Step 5 · Personalised pathway"
        title="Your next steps, in order."
        description="Built from your Skills Passport. Tick off actions as you go — connecting with a mentor and recording applications update automatically."
        actions={<AiBadge label="AI-recommended plan" />}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          {/* Overall progress */}
          <div className="rounded-2xl surface-ink p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-ink-muted">Overall progress</p>
                <p className="mt-1 font-display text-5xl">{percent}%</p>
              </div>
              <p className="text-sm text-ink-muted">{done} of {total} actions complete</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-border" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Pathway progress">
              <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${percent}%` }} />
            </div>
          </div>

          {/* Steps */}
          <ol className="relative mt-8 space-y-5">
            <span className="absolute bottom-6 left-[1.35rem] top-6 w-px bg-border" aria-hidden="true" />
            {steps.map((s, i) => {
              const complete = s.done === s.total;
              const current = i === currentIdx;
              const link = STAGE_LINK[s.stage];
              return (
                <li key={s.stage} className="relative flex gap-5">
                  <span
                    className={cn(
                      "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm",
                      complete ? "border-success bg-success text-primary-foreground" : current ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {complete ? <Check className="size-5" /> : i + 1}
                  </span>
                  <section className={cn("flex-1 rounded-2xl border bg-card p-5 shadow-card", current && "ring-2 ring-accent/50")} aria-labelledby={`stage-${s.stage}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <p className="eyebrow text-muted-foreground">Step {i + 1}{current ? " · You are here" : ""}</p>
                        <h2 id={`stage-${s.stage}`} className="mt-1 text-2xl font-medium">{s.stage} <span className="text-base font-normal text-muted-foreground">— {s.title}</span></h2>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{s.done}/{s.total}</span>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {s.actions.map((a) => (
                        <li key={a.key}>
                          <label className={cn("flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-secondary", a.auto && "cursor-default hover:bg-transparent")}>
                            <input
                              type="checkbox"
                              className="mt-0.5 size-4 accent-[var(--color-primary)]"
                              checked={a.done}
                              disabled={a.auto}
                              onChange={() => toggleAction(a.key)}
                            />
                            <span className={cn("text-sm", a.done && "text-muted-foreground line-through")}>
                              {a.label}
                              {a.auto && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground no-underline">
                                  <Lock className="size-3" aria-hidden="true" /> tracked automatically
                                </span>
                              )}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    {link && (
                      <Button asChild variant="link" size="sm" className="mt-2 px-2">
                        <Link to={link.to}>{link.label} <ArrowRight /></Link>
                      </Button>
                    )}
                  </section>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Tracker title="Mentor requests" empty="No requests yet." cta={{ to: "/mentors", label: "Find a mentor" }}>
            {requested.map((m) => (
              <li key={m.id} className="flex justify-between gap-2 text-sm">
                <span><span className="font-medium">{m.name}</span><br /><span className="text-muted-foreground">{m.role}</span></span>
                <span className="h-fit rounded-full bg-warning-soft px-2 py-0.5 text-xs text-warning">Pending</span>
              </li>
            ))}
          </Tracker>
          <Tracker title="Applications" empty="No applications recorded." cta={{ to: "/opportunities", label: "See matches" }}>
            {applied.map((o) => (
              <li key={o.id} className="flex justify-between gap-2 text-sm">
                <span><span className="font-medium">{o.title}</span><br /><span className="text-muted-foreground">{o.organization}</span></span>
                <span className="h-fit rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">Submitted</span>
              </li>
            ))}
          </Tracker>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              if (window.confirm("Clear your profile, analysis and progress from this device?")) resetAll();
            }}
          >
            <RotateCcw /> Start over
          </Button>
        </aside>
      </div>
    </>
  );
}

function Tracker({ title, empty, cta, children }: { title: string; empty: string; cta: { to: "/mentors" | "/opportunities"; label: string }; children: React.ReactNode[] }) {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="flex items-center justify-between text-lg font-medium">
        {title}
        <span className="font-mono text-xs text-muted-foreground">{children.length}</span>
      </h2>
      {children.length ? (
        <ul className="mt-3 space-y-3">{children}</ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {empty}{" "}
          <Link to={cta.to} className="font-medium text-primary hover:underline">{cta.label}</Link>
        </p>
      )}
    </section>
  );
}
