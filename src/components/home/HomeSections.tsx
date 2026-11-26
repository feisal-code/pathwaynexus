import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpenCheck, Building2, Eye, GraduationCap, HandHeart, Handshake, Landmark, PlayCircle, UserRound, Users, UsersRound } from "lucide-react";

import { MatchScore } from "@/components/pathway/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toEmbedUrl } from "@/lib/pathway/video";

const wrap = "mx-auto max-w-7xl px-4 sm:px-6";

function Heading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-medium">{title}</h2>
      {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
    </div>
  );
}

// Paste a Loom or YouTube link here to show the walkthrough video.
export const DEMO_VIDEO_URL = "";

export function DemoVideo() {
  const embed = toEmbedUrl(DEMO_VIDEO_URL);
  return (
    <section className={cn(wrap, "pt-14")} aria-label="Watch demo">
      {embed ? (
        <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
          <div className="aspect-video">
            <iframe src={embed} title="Watch the 60-second walkthrough" className="size-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          </div>
          <p className="px-6 py-4 font-display text-xl">Watch the 60-second walkthrough</p>
        </div>
      ) : (
        <div className="paper-grid flex min-h-48 w-full flex-col items-center justify-center rounded-3xl border border-dashed bg-card px-6 py-8 text-center sm:aspect-[21/9]">
          <PlayCircle className="size-12 text-primary" aria-hidden="true" />
          <p className="eyebrow mt-3 text-primary">Watch demo</p>
          <p className="mt-2 font-display text-2xl">Watch the 60-second walkthrough</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Profile → Skills Passport → Opportunities → Mentors → My Pathway → Progress</p>
          <Button asChild className="mt-5"><a href="#journey" onClick={(event) => { event.preventDefault(); document.getElementById("journey")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>Try the demo journey</a></Button>
        </div>
      )}
    </section>
  );
}

export function TheProblem() {
  return (
    <section className={cn(wrap, "pt-20")}>
      <div className="grid gap-6 rounded-3xl border bg-card p-9 md:grid-cols-[0.6fr_1.4fr]">
        <p className="eyebrow text-primary">The problem</p>
        <p className="font-display text-2xl leading-snug sm:text-3xl">
          Skilled displaced people arrive with proven experience — engineers, nurses, finance professionals, teachers — yet
          often wait years for work that matches their skills. The barriers are rarely ability. They are{" "}
          <span className="italic text-primary">recognition, local experience and networks.</span> Pathway Nexus targets
          exactly those three.
        </p>
      </div>
    </section>
  );
}

const SDGS = [
  { n: 8, title: "Decent Work & Economic Growth", border: "border-t-sdg-8", text: "text-sdg-8", body: "We help skilled displaced people move from underemployment into meaningful work by matching proven experience to real local opportunities." },
  { n: 10, title: "Reduced Inequalities", border: "border-t-sdg-10", text: "text-sdg-10", body: "We remove the credential-recognition and network barriers that keep displaced talent out of the local labour market." },
  { n: 17, title: "Partnerships for the Goals", border: "border-t-sdg-17", text: "text-sdg-17", body: "We connect employers, NGOs, universities, local councils and refugee-led organisations into one coordinated pathway." },
];

export function SdgAlignment() {
  return (
    <section className={cn(wrap, "py-20")}>
      <Heading eyebrow="Impact" title="Aligned with the SDGs" intro="Pathway Nexus is built directly against three Sustainable Development Goals." />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {SDGS.map((s) => (
          <article key={s.n} className={cn("rounded-2xl border border-t-4 bg-card p-7 shadow-card", s.border)}>
            <p className={cn("font-mono text-sm font-semibold", s.text)}>SDG {s.n}</p>
            <h3 className="mt-2 text-2xl font-medium">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const STAKEHOLDERS = [
  { icon: UserRound, label: "Refugees" },
  { icon: Users, label: "Mentors" },
  { icon: Building2, label: "Employers" },
  { icon: HandHeart, label: "NGOs" },
  { icon: GraduationCap, label: "Universities" },
  { icon: UsersRound, label: "Refugee-led orgs" },
];

export function MentorNetwork() {
  return (
    <section className={cn(wrap, "py-20")}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Heading
            eyebrow="Professional networks"
            title="Your professional network, unlocked"
            intro="Local experience opens doors. Networks keep them open. Pathway Nexus connects skilled displaced people with mentors, peers and employers who can vouch for their work."
          />
          <p className="eyebrow mt-10 text-muted-foreground">How matching works</p>
          <ol className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            {["Shared field & skills", "Language & location fit", "Mutual intent to connect"].map((s, i, a) => (
              <li key={s} className="flex items-center gap-2">
                <span className="rounded-lg border bg-card px-3 py-2 text-sm font-semibold"><span className="mr-1.5 font-mono text-xs text-muted-foreground">{i + 1}</span>{s}</span>
                {i < a.length - 1 && <ArrowRight className="hidden size-4 text-accent sm:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl passport-pattern p-7 shadow-lift" aria-label="Example mentor match">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-ink-muted">Mentor match · Example</p>
              <p className="mt-3 font-display text-3xl">Amina K.</p>
              <p className="mt-1 text-sm">Senior Finance Manager, Horizon Relief Network</p>
              <p className="mt-1 text-sm text-ink-muted">12 years in humanitarian finance · Mentors in Nairobi</p>
            </div>
            <div className="rounded-full bg-ink-foreground p-1"><MatchScore value={92} size={68} label="mentor match" /></div>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-muted">92% mentor match</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {["Career navigation", "CV & interviews", "Local regulatory context"].map((t) => (
              <span key={t} className="rounded-md border border-ink-border px-2 py-0.5 text-xs">{t}</span>
            ))}
          </div>
          <Button asChild variant="accent" className="mt-6"><Link to="/mentors">Request mentorship</Link></Button>
          <p className="mt-4 text-[0.7rem] text-ink-muted">Illustrative demo mentor.</p>
        </div>
      </div>
      <div className="mt-14 rounded-2xl border bg-secondary/50 p-6">
        <p className="eyebrow text-primary">One network, many stakeholders (SDG 17)</p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STAKEHOLDERS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 rounded-xl bg-card px-3 py-3 text-sm font-medium">
              <Icon className="size-4 text-primary" aria-hidden="true" />{label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const LOCAL = [
  { icon: Landmark, title: "Internships & placements", body: "Short-term paid or unpaid roles that build local references." },
  { icon: Eye, title: "Job shadowing", body: "Spend a week alongside a professional in your field." },
  { icon: Handshake, title: "Volunteering with purpose", body: "Skill-based volunteering that counts as local experience." },
  { icon: Award, title: "Credential recognition support", body: "Guidance on validating foreign qualifications locally." },
];

export function LocalExperience() {
  return (
    <section className="border-y bg-secondary/50">
      <div className={cn(wrap, "py-20")}>
        <Heading
          eyebrow="Local experience, real pathways"
          title="Local experience is the missing bridge."
          intro="Employers often ask for local references before they look at proven skills. These opportunity types help you build them."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOCAL.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span>
              <h3 className="mt-5 text-xl font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpenCheck className="size-4 text-primary" aria-hidden="true" />
          Every opportunity is tagged by skill match, location and language so recommendations stay realistic.
        </p>
      </div>
    </section>
  );
}

const STATS = [
  { value: "118.2M", body: "People forcibly displaced worldwide at mid-2026", source: "UNHCR Mid-Year Trends 2026", href: "https://www.unhcr.org/about-unhcr/overview/figures-glance" },
  { value: "45%", body: "Refugees living in countries with unrestricted practical access to formal employment in 2023", source: "UNHCR — 2023 Global Survey on Livelihoods and Economic Inclusion", href: "https://www.unhcr.org/what-we-do/build-better-futures/livelihoods-and-economic-inclusion" },
  { value: "22 percentage points", body: "Gap between legal labour-market access and practical access to formal employment", source: "UNHCR — 2023 Global Survey on Livelihoods and Economic Inclusion", href: "https://www.unhcr.org/what-we-do/build-better-futures/livelihoods-and-economic-inclusion" },
];

const ROADMAP = [
  { when: "Now", what: "Prototype with fictional profiles and opportunities" },
  { when: "Next", what: "Pilot with one NGO + employer partner in Nairobi" },
  { when: "Then", what: "Add credential-recognition guidance and mentor verification" },
  { when: "Later", what: "Expand to a second city and open the partner API" },
];

// Hackathon team — edit names, roles and bios here.
const TEAM = [
  { name: "Feisal Yusuf", role: "Product & Research", bio: "Product direction and research planning for the prototype." },
  { name: "Amal Hassan", role: "Partnerships", bio: "Partner outreach planning for employers, NGOs and refugee-led organisations." },
  { name: "Daniel Otieno", role: "Engineering", bio: "Prototype build and AI-assisted skills analysis." },
  { name: "Leila Mansour", role: "Mentorship & Community", bio: "Mentor programme design and candidate support planning." },
];

export function ImpactRoadmapTeam() {
  return (
    <>
      <section className={cn(wrap, "pt-20")}>
        <Heading eyebrow="Why it matters" title="The problem, in numbers" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STATS.map((s) => (
            <article key={s.value} className="rounded-2xl border bg-card p-7">
              <p className="font-display text-5xl text-primary">{s.value === "22 percentage points" ? <>22 <span className="block text-2xl">percentage points</span></> : s.value}</p>
              <p className="mt-3 text-muted-foreground">{s.body}</p>
              <p className="mt-4 text-xs text-muted-foreground">Source: <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">{s.source}</a></p>
            </article>
          ))}
        </div>
      </section>

      <section className={cn(wrap, "pt-20")}>
        <Heading eyebrow="What's next" title="Our roadmap" />
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {ROADMAP.map((r, i) => (
            <li key={r.when} className={cn("rounded-2xl border p-6", i === 0 ? "border-primary bg-primary-soft" : "bg-card")}>
              <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
              <p className="mt-2 text-xl font-medium">{r.when}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={cn(wrap, "pt-20")}>
        <Heading eyebrow="People" title="The team" />
        <p className="mt-3 text-sm text-muted-foreground">Hackathon team</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <article key={m.name} className="rounded-2xl border border-dashed bg-card p-6">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground"><UserRound className="size-5" aria-hidden="true" /></span>
              <p className="mt-4 font-semibold">{m.name}</p>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
