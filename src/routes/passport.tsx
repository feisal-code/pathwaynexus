import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, CheckCircle2, Compass, Pencil, RefreshCw, Sparkles, Star } from "lucide-react";
import type { ReactNode } from "react";

import { JourneySteps } from "@/components/pathway/JourneySteps";
import { RequireAnalysis } from "@/components/pathway/RequireAnalysis";
import { AiBadge, MatchScore, Notice, Page, SkillChip } from "@/components/pathway/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathway } from "@/lib/pathway/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "AI Skills Passport — Pathway Nexus" },
      { name: "description", content: "Your core and transferable skills, potential roles, readiness score, gaps and next steps." },
      { property: "og:title", content: "AI Skills Passport — Pathway Nexus" },
      { property: "og:description", content: "A structured view of your skills and the roles they can lead to." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PassportPage,
});

function passportId(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 9000;
  return `PN-${(h + 1000).toString()}`;
}

function PassportPage() {
  const { retryAnalysis } = usePathway();
  return (
    <Page>
      <JourneySteps current="/passport" />
      <RequireAnalysis>
        {({ profile, analysis: stored }) => {
          const a = stored.analysis;
          return (
            <div className="space-y-8">
              {stored.source === "sample" && (
                <Notice tone="warning">
                  You're viewing a <strong>sample analysis</strong> for the demo profile.{" "}
                  <button type="button" onClick={retryAnalysis} className="font-semibold text-primary underline-offset-4 hover:underline">
                    Generate a live AI analysis
                  </button>{" "}
                  for your profile.
                </Notice>
              )}

              {/* Passport cover */}
              <section aria-labelledby="passport-title" className="animate-rise overflow-hidden rounded-3xl passport-pattern shadow-lift">
                <div className="grid gap-8 p-7 md:grid-cols-[1fr_auto] md:p-10">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="eyebrow text-ink-muted">Skills Passport · {passportId(profile.fullName)}</p>
                      <AiBadge />
                    </div>
                    <div>
                      <h1 id="passport-title" className="text-4xl font-medium sm:text-5xl">{profile.fullName}</h1>
                      <p className="mt-2 text-ink-muted">
                        {profile.professionalField} · {profile.yearsOfExperience} years · {profile.countryOfResidence}
                      </p>
                    </div>
                    <p className="max-w-2xl text-lg leading-relaxed">{a.summary}</p>
                    <dl className="grid grid-cols-2 gap-4 border-t border-ink-border pt-5 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="eyebrow text-ink-muted">Languages</dt>
                        <dd className="mt-1">{profile.languages.join(", ") || "—"}</dd>
                      </div>
                      <div>
                        <dt className="eyebrow text-ink-muted">Preferred work</dt>
                        <dd className="mt-1">{profile.preferredWorkType}</dd>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <dt className="eyebrow text-ink-muted">Generated</dt>
                        <dd className="mt-1">{new Date(stored.generatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-ink-foreground/5 p-6 text-center md:w-60">
                    <div className="rounded-full bg-ink-foreground p-1.5">
                      <MatchScore value={a.readinessScore} size={120} label="career readiness" />
                    </div>
                    <p className="eyebrow text-ink-muted">Career readiness</p>
                    <p className="text-xs leading-relaxed text-ink-muted">{a.readinessRationale}</p>
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm"><Link to="/profile"><Pencil /> Edit profile</Link></Button>
                <Button variant="outline" size="sm" onClick={retryAnalysis}><RefreshCw /> Regenerate analysis</Button>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <Panel title="Core skills" icon={<Star />}>
                  <div className="flex flex-wrap gap-1.5">
                    {a.coreSkills.map((s) => <SkillChip key={s}>{s}</SkillChip>)}
                  </div>
                </Panel>

                <Panel title="Transferable skills" icon={<Sparkles />} className="lg:col-span-2" ai>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {a.transferableSkills.map((t) => (
                      <li key={t.skill} className="rounded-xl border bg-background p-4">
                        <p className="font-semibold">{t.skill}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.evidence}</p>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="Potential career roles" icon={<Briefcase />} className="lg:col-span-2" ai>
                  <ul className="space-y-4">
                    {a.potentialRoles.map((r) => (
                      <li key={r.title}>
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="font-semibold">{r.title}</p>
                          <span className="font-mono text-sm text-primary">{r.fit}% fit</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${r.fit}%` }} />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{r.reason}</p>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="Strengths" icon={<CheckCircle2 />}>
                  <ul className="space-y-2.5">
                    {a.strengths.map((s) => (
                      <li key={s} className="flex gap-2.5 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="Skill gaps" icon={<Compass />} ai>
                  <ul className="space-y-4">
                    {a.skillGaps.map((g) => (
                      <li key={g.gap}>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{g.gap}</p>
                          <Badge variant={g.priority === "high" ? "warning" : "secondary"} className="capitalize">{g.priority}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{g.why}</p>
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="Recommended next steps" icon={<ArrowRight />} className="lg:col-span-2" ai>
                  <ol className="space-y-3">
                    {a.nextSteps.map((s, i) => (
                      <li key={s} className="flex gap-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs text-accent-foreground">{i + 1}</span>
                        <span className="pt-0.5">{s}</span>
                      </li>
                    ))}
                  </ol>
                  {a.mentorTypes.length > 0 && (
                    <p className="mt-5 border-t pt-4 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Mentors who could help:</span> {a.mentorTypes.join(" · ")}
                    </p>
                  )}
                </Panel>
              </div>

              <Notice>
                This Skills Passport is an AI-generated assessment based on the information you provided. It is a
                recommendation to guide your next steps and is <strong>not an official verification</strong> of
                qualifications or credentials.
              </Notice>

              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-2xl">See where these skills fit.</p>
                  <p className="text-sm text-muted-foreground">Opportunities ranked by how well they match your passport.</p>
                </div>
                <Button asChild size="lg"><Link to="/opportunities">View opportunity matches <ArrowRight /></Link></Button>
              </div>
            </div>
          );
        }}
      </RequireAnalysis>
    </Page>
  );
}

function Panel({ title, icon, children, className, ai }: { title: string; icon: ReactNode; children: ReactNode; className?: string; ai?: boolean }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-6 shadow-card", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-xl font-medium">
          <span className="text-primary [&_svg]:size-4" aria-hidden="true">{icon}</span>
          {title}
        </h2>
        {ai && <AiBadge label="AI" />}
      </div>
      {children}
    </section>
  );
}
