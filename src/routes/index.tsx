import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Fingerprint, Handshake, Lock, Route as RouteIcon, ScanSearch, ShieldCheck, Sparkles, Target, UserRound, Users } from "lucide-react";

import { MatchScore, SkillChip } from "@/components/pathway/common";
import { DemoTour } from "@/components/home/DemoTour";
import { DemoVideo, ImpactRoadmapTeam, LocalExperience, MentorNetwork, SdgAlignment, TheProblem } from "@/components/home/HomeSections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pathway Nexus — Your skills have value. Your pathway should be visible." },
      {
        name: "description",
        content:
          "Pathway Nexus helps skilled displaced people turn existing experience into clearer career pathways through skills analysis, opportunity matching and mentorship.",
      },
      { property: "og:title", content: "Pathway Nexus — From proven skills to meaningful opportunity" },
      {
        property: "og:description",
        content: "AI-assisted skills analysis, opportunity matching, mentorship and personalised career pathways.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BENEFITS = [
  {
    icon: Fingerprint,
    title: "Understand Your Skills",
    body: "Turn experience into a structured skills profile.",
  },
  {
    icon: Target,
    title: "Find the Right Opportunities",
    body: "Match skills and experience with relevant opportunities.",
  },
  {
    icon: RouteIcon,
    title: "Build Your Pathway",
    body: "Identify gaps, connect with mentors and take practical next steps.",
  },
];

const JOURNEY = [
  { icon: UserRound, label: "Profile" },
  { icon: ScanSearch, label: "Skills analysis" },
  { icon: Target, label: "Opportunity match" },
  { icon: Compass, label: "Skill gap" },
  { icon: Users, label: "Mentor match" },
  { icon: RouteIcon, label: "Personalised pathway" },
];

function Index() {
  return (
    <main id="main">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="paper-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise space-y-7">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-primary">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              From proven skills to meaningful opportunity
            </p>
            <h1 className="text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl">
              Your skills have value.{" "}
              <span className="italic text-primary">Your pathway should be visible.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Pathway Nexus helps skilled displaced people turn existing experience into clearer career pathways through
              skills analysis, opportunity matching, mentorship and actionable next steps.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/profile">
                  Build My Pathway <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/partners">Explore for Partners</Link>
              </Button>
              <DemoTour />
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4" aria-hidden="true" />
              No sign-up needed. Your profile stays on your device.
            </p>
          </div>

          {/* Passport preview */}
          <div className="relative animate-rise [animation-delay:120ms]" aria-label="Example Skills Passport">
            <div className="absolute -right-6 -top-6 hidden h-full w-full rounded-3xl border border-dashed border-primary/30 lg:block" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-3xl passport-pattern p-7 shadow-lift">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow text-ink-muted">Skills Passport · Example</p>
                  <p className="mt-3 font-display text-3xl">Finance professional</p>
                  <p className="mt-1 text-sm text-ink-muted">7 years · Arabic, English · Nairobi</p>
                </div>
                <div className="rounded-full bg-ink-foreground p-1">
                  <MatchScore value={81} size={68} label="career readiness" />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p className="eyebrow text-ink-muted">Transferable skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Donor reporting", "Compliance mindset", "Cross-sector adaptability"].map((s) => (
                    <span key={s} className="rounded-md border border-ink-border px-2 py-0.5 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-card p-4 text-card-foreground">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Finance Assistant</p>
                    <p className="text-xs text-muted-foreground">Horizon Relief Network · Nairobi</p>
                  </div>
                  <span className="rounded-full bg-success-soft px-2.5 py-1 font-mono text-xs font-medium text-success">91% match</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <SkillChip tone="strength">Financial reporting</SkillChip>
                  <SkillChip tone="strength">Excel</SkillChip>
                  <SkillChip tone="gap">Local regulatory familiarity</SkillChip>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-primary">
                  <Sparkles className="size-3.5" aria-hidden="true" /> Next: connect with a finance mentor
                </p>
              </div>
              <p className="mt-5 text-[0.7rem] text-ink-muted">Illustrative demo — AI assessment, not credential verification.</p>
            </div>
          </div>
        </div>
      </section>

      <DemoVideo />
      <TheProblem />

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, body }, i) => (
            <article key={title} className="group rounded-2xl border bg-card p-7 shadow-card transition-shadow hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h2 className="mt-6 text-2xl font-medium">{title}</h2>
              <p className="mt-2 text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="border-y bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">Not another job board</p>
            <h2 className="mt-3 text-4xl font-medium">One connected journey, from experience to next step.</h2>
            <p className="mt-3 text-muted-foreground">
              Every stage builds on the last, so recommendations stay grounded in what you have already done.
            </p>
          </div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {JOURNEY.map(({ icon: Icon, label }, i) => (
              <li key={label} className="relative rounded-xl border bg-card p-5">
                <span className="font-mono text-xs text-muted-foreground">Step {i + 1}</span>
                <Icon className="mt-3 size-5 text-primary" aria-hidden="true" />
                <p className="mt-2 font-semibold">{label}</p>
                {i < JOURNEY.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-background text-accent lg:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button asChild variant="link" className="px-0">
              <Link to="/how-it-works">
                See how it works <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MentorNetwork />
      <LocalExperience />
      <SdgAlignment />

      {/* Partners + trust */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pt-20 sm:px-6 lg:grid-cols-2">
        <div className="rounded-3xl surface-ink p-9">
          <Handshake className="size-7 text-accent" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-medium">For employers, NGOs and partners</h2>
          <p className="mt-3 max-w-md text-ink-muted">
            Search anonymised talent by skill, field, language and location, then express interest — without exposing
            personal details. Partners see skills and fit, never legal status or personal history.
          </p>
          <Button asChild variant="accent" size="lg" className="mt-7">
            <Link to="/partners">Explore for Partners</Link>
          </Button>
        </div>
        <div className="rounded-3xl border bg-card p-9">
          <ShieldCheck className="size-7 text-primary" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-medium">Built on trust</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />We ask only for professional information — never legal status, ID numbers or personal history.</li>
            <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />AI results are clearly labelled as assessments and recommendations, not credential verification.</li>
            <li className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />This prototype uses fictional demo opportunities, mentors and profiles.</li>
          </ul>
        </div>
      </section>

      <ImpactRoadmapTeam />
    </main>
  );
}
