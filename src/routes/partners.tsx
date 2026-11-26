import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Check, Clock, Eye, Heart, MapPin, Search, SearchX, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DemoBadge, EmptyState, MatchScore, Notice, Page, PageHeader, SkillChip } from "@/components/pathway/common";
import { PartnerAsk } from "@/components/home/PartnerAsk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TALENT_POOL } from "@/lib/pathway/demo-data";
import { skillsMatch } from "@/lib/pathway/matching";
import { usePathway } from "@/lib/pathway/store";
import { PROFESSIONAL_FIELDS, WORK_TYPES } from "@/lib/pathway/types";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "For Employers & Partners — Pathway Nexus" },
      { name: "description", content: "Search anonymised, skills-first talent profiles and express interest in potential candidates." },
      { property: "og:title", content: "For Employers & Partners — Pathway Nexus" },
      { property: "og:description", content: "Find skilled professionals by skill and field — privacy first." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnersPage,
});

const selectClass = "h-11 rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function PartnersPage() {
  const { partnerInterests, togglePartnerInterest, hydrated } = usePathway();
  const [query, setQuery] = useState("");
  const [field, setField] = useState("all");
  const [workType, setWorkType] = useState("all");
  const [language, setLanguage] = useState("all");
  const [location, setLocation] = useState("all");
  const [onlyShortlist, setOnlyShortlist] = useState(false);
  const languages = useMemo(() => [...new Set(TALENT_POOL.flatMap((t) => t.languages))].sort(), []);
  const locations = useMemo(() => [...new Set(TALENT_POOL.map((t) => t.location))].sort(), []);

  const terms = query.split(",").map((t) => t.trim()).filter(Boolean);

  const results = useMemo(
    () =>
      TALENT_POOL.map((t) => {
        const hits = terms.length ? t.skills.filter((s) => terms.some((q) => skillsMatch(s, q))) : [];
        return { t, hits };
      })
        .filter(({ t, hits }) =>
          (field === "all" || t.field === field) &&
          (workType === "all" || t.workType === workType) &&
          (language === "all" || t.languages.includes(language)) &&
          (location === "all" || t.location === location) &&
          (!terms.length || hits.length > 0 || terms.some((q) => skillsMatch(t.headline, q))) &&
          (!onlyShortlist || partnerInterests[t.id]),
        )
        .sort((a, b) => b.hits.length - a.hits.length || b.t.readinessScore - a.t.readinessScore),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, field, workType, language, location, onlyShortlist, partnerInterests],
  );

  const shortlisted = hydrated ? Object.keys(partnerInterests).length : 0;

  return (
    <Page>
      <PageHeader
        eyebrow="Employers · NGOs · Partners"
        title="Find proven skills, without the bias."
        description="Browse anonymised, skills-first profiles. Names and personal details stay hidden until a candidate accepts your interest."
        actions={
          <Button variant={onlyShortlist ? "default" : "outline"} onClick={() => setOnlyShortlist((v) => !v)} aria-pressed={onlyShortlist}>
            <Heart /> Shortlist ({shortlisted})
          </Button>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Eye, title: "Anonymised by default", body: "Profiles show skills, experience and languages — never names or personal history." },
          { icon: ShieldCheck, title: "Consent-based contact", body: "Candidates choose whether to share their details after you express interest." },
          { icon: Search, title: "Skills-first search", body: "Search by what people can do, including transferable skills from other contexts." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border bg-card p-5">
            <Icon className="size-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-primary" aria-hidden="true" />Partners see skills and fit, never legal status or personal history.</p>
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border bg-secondary/60 p-4">
        <label className="flex min-w-64 flex-1 flex-col gap-1 text-xs font-semibold">
          Search by skill
          <span className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. budgeting, React, procurement" className="h-11 bg-card pl-9" />
          </span>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          Professional field
          <select aria-label="Professional field" className={selectClass} value={field} onChange={(e) => setField(e.target.value)}>
            <option value="all">All fields</option>
            {PROFESSIONAL_FIELDS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          Work type
          <select aria-label="Work type" className={selectClass} value={workType} onChange={(e) => setWorkType(e.target.value)}>
            <option value="all">All work types</option>
            {WORK_TYPES.map((w) => <option key={w}>{w}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          Language
          <select aria-label="Language" className={selectClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="all">All languages</option>
            {languages.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold">
          Location
          <select aria-label="Location" className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="all">All locations</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{results.length} candidate{results.length === 1 ? "" : "s"}</p>

      {results.length === 0 ? (
        <EmptyState icon={<SearchX />} title="No candidates found" description="Try a broader skill, or clear the field and work type filters.">
          <Button variant="outline" onClick={() => { setQuery(""); setField("all"); setWorkType("all"); setLanguage("all"); setLocation("all"); setOnlyShortlist(false); }}>Clear search</Button>
        </EmptyState>
      ) : (
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map(({ t, hits }) => {
            const interested = Boolean(partnerInterests[t.id]);
            return (
              <article key={t.id} className="flex flex-col rounded-2xl border bg-card p-6 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{t.code}</p>
                    <h2 className="mt-1 text-xl font-medium leading-snug">{t.headline}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t.field}</p>
                    <p className="mt-1 text-xs font-medium">{t.field.split(" ")[0]} professional · {t.yearsOfExperience} yrs · {t.languages.join("/")} · {t.location.split(",")[0]} · {t.readinessScore}% match</p>
                  </div>
                  <MatchScore value={t.readinessScore} size={56} label="readiness" />
                </div>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden="true" />{t.yearsOfExperience} yrs</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" aria-hidden="true" />{t.location}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="size-3" aria-hidden="true" />{t.workType}</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.skills.map((s) => <SkillChip key={s} tone={hits.includes(s) ? "strength" : "neutral"}>{s}</SkillChip>)}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Languages: {t.languages.join(", ")}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <DemoBadge />
                  <Button
                    size="sm"
                    variant={interested ? "secondary" : "default"}
                    aria-pressed={interested}
                    onClick={() => {
                      togglePartnerInterest(t.id);
                      toast[interested ? "message" : "success"](interested ? `Interest withdrawn for ${t.code}` : "Interest recorded — personal details stay private until the candidate consents.", {
                        description: interested ? undefined : `${t.code} · ${t.headline} (Demo)`,
                      });
                    }}
                  >
                    {interested ? <><Check /> Interest sent</> : <><Heart /> Express interest</>}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <PartnerAsk />

      <div className="mt-10">
        <Notice>
          All talent profiles on this page are fictional demo data for the prototype. Readiness scores are AI
          assessments, not verified credentials.
        </Notice>
      </div>
    </Page>
  );
}
