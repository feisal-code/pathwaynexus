import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Eye, Lock, Route as RouteIcon, ScanSearch, Scale, Sparkles, Target, UserRound, Users } from "lucide-react";

import { Page, PageHeader } from "@/components/pathway/common";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "About & How It Works — Pathway Nexus" },
      { name: "description", content: "How Pathway Nexus uses AI responsibly to turn skills into a practical career pathway." },
      { property: "og:title", content: "How Pathway Nexus works" },
      { property: "og:description", content: "Profile, skills analysis, opportunity match, skill gap, mentor match and personalised pathway." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { icon: UserRound, title: "Profile", body: "You describe your experience, skills, languages and goals in your own words. Only professional information is requested.", ai: false },
  { icon: ScanSearch, title: "Skills analysis", body: "AI reads your profile and extracts core and transferable skills, potential roles and a career readiness score — each with the evidence it used.", ai: true },
  { icon: Target, title: "Opportunity match", body: "Opportunities are scored with a transparent formula: skill coverage, field, experience and work type. AI can explain any match in plain language.", ai: true },
  { icon: Compass, title: "Skill gap", body: "AI identifies practical, solvable gaps — like local regulations, certifications or tools — rather than judging your background.", ai: true },
  { icon: Users, title: "Mentor match", body: "Mentors are matched to your specific gaps and field, with a clear reason for every recommendation.", ai: true },
  { icon: RouteIcon, title: "Personalised pathway", body: "Everything comes together as five steps — Strengthen, Connect, Prepare, Apply, Progress — with actions you can track.", ai: true },
];

const PRINCIPLES = [
  { icon: Scale, title: "Assessment, not verification", body: "AI outputs are recommendations to guide you. Pathway Nexus does not verify qualifications or credentials." },
  { icon: Lock, title: "Minimal data", body: "We never ask for legal status, ID numbers, addresses or personal history. In this prototype, data stays in your browser." },
  { icon: Eye, title: "Explainable matching", body: "Match scores come from a simple, visible formula, so people and partners can understand why a result appears." },
  { icon: Sparkles, title: "Honest demo", body: "All opportunities, mentors and talent profiles are fictional. We don't present invented statistics." },
];

function HowItWorks() {
  return (
    <Page>
      <PageHeader
        eyebrow="About Pathway Nexus"
        title="From proven skills to meaningful opportunity."
        description="Many skilled displaced professionals have years of valuable experience that is hard to translate into a new job market. Pathway Nexus makes that experience visible — and turns it into concrete next steps."
      />

      <section className="mt-12" aria-labelledby="journey-title">
        <h2 id="journey-title" className="text-3xl font-medium">The journey</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body, ai }, i) => (
            <li key={title} className="rounded-2xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 text-xl font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              {ai && <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-foreground"><Sparkles className="size-3 text-accent" aria-hidden="true" /> AI-assisted</p>}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-3xl surface-ink p-8 md:p-12" aria-labelledby="principles-title">
        <h2 id="principles-title" className="text-3xl font-medium">Our principles</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <Icon className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2" aria-labelledby="who-title">
        <div className="rounded-2xl border bg-card p-8">
          <h2 id="who-title" className="text-2xl font-medium">For skilled professionals</h2>
          <p className="mt-2 text-muted-foreground">Accountants, engineers, nurses, teachers, developers and more — build a Skills Passport and a clear plan in minutes.</p>
          <Button asChild className="mt-6"><Link to="/profile">Build my pathway <ArrowRight /></Link></Button>
        </div>
        <div className="rounded-2xl border bg-card p-8">
          <h2 className="text-2xl font-medium">For employers, NGOs and partners</h2>
          <p className="mt-2 text-muted-foreground">Discover anonymised, skills-first talent and connect with candidates who match your needs.</p>
          <Button asChild variant="outline" className="mt-6"><Link to="/partners">Explore for partners <ArrowRight /></Link></Button>
        </div>
      </section>
    </Page>
  );
}
