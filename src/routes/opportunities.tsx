import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { JourneySteps } from "@/components/pathway/JourneySteps";
import { OpportunityCard } from "@/components/pathway/OpportunityCard";
import { RequireAnalysis } from "@/components/pathway/RequireAnalysis";
import { EmptyState, Page, PageHeader } from "@/components/pathway/common";
import { Button } from "@/components/ui/button";
import { OPPORTUNITIES } from "@/lib/pathway/demo-data";
import { matchOpportunities } from "@/lib/pathway/matching";
import { PROFESSIONAL_FIELDS, WORK_TYPES, type StoredAnalysis, type TalentProfile } from "@/lib/pathway/types";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunity Matches — Pathway Nexus" },
      { name: "description", content: "Opportunities ranked by how well they match your skills, with strengths, gaps and next actions." },
      { property: "og:title", content: "Opportunity Matches — Pathway Nexus" },
      { property: "og:description", content: "See which roles fit your experience and what to do next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OpportunitiesPage,
});

const LOCATIONS = Array.from(new Set(OPPORTUNITIES.map((o) => o.location))).sort();
const selectClass = "h-10 rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function OpportunitiesPage() {
  return (
    <Page>
      <JourneySteps current="/opportunities" />
      <RequireAnalysis>{(d) => <Matches {...d} />}</RequireAnalysis>
    </Page>
  );
}

function Matches({ profile, analysis }: { profile: TalentProfile; analysis: StoredAnalysis }) {
  const [field, setField] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [workType, setWorkType] = useState<string>("all");

  const all = useMemo(() => matchOpportunities(OPPORTUNITIES, profile, analysis.analysis), [profile, analysis]);
  const filtered = all.filter(
    (m) =>
      (field === "all" || m.opportunity.field === field) &&
      (location === "all" || m.opportunity.location === location) &&
      (workType === "all" || m.opportunity.workType === workType),
  );
  const strong = all.filter((m) => m.score >= 80).length;

  return (
    <>
      <PageHeader
        eyebrow="Step 3 · Opportunity match"
        title="Roles where your experience already counts."
        description={`${strong} strong ${strong === 1 ? "match" : "matches"} out of ${all.length} demo opportunities, ranked by skill coverage, field, experience and work type.`}
      />

      <div className="sticky top-16 z-20 -mx-4 mt-6 border-b bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold">
            Professional field
            <select className={selectClass} value={field} onChange={(e) => setField(e.target.value)}>
              <option value="all">All fields</option>
              {PROFESSIONAL_FIELDS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            Location
            <select className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="all">All locations</option>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold">
            Work type
            <select className={selectClass} value={workType} onChange={(e) => setWorkType(e.target.value)}>
              <option value="all">All work types</option>
              {WORK_TYPES.map((w) => <option key={w}>{w}</option>)}
            </select>
          </label>
          {profile.professionalField && field !== profile.professionalField && (
            <Button variant="ghost" size="sm" onClick={() => setField(profile.professionalField)}>Only my field</Button>
          )}
          <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">{filtered.length} shown</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<SearchX />} title="No opportunities match these filters" description="Try a different location or work type, or clear the filters.">
          <Button variant="outline" onClick={() => { setField("all"); setLocation("all"); setWorkType("all"); }}>Clear filters</Button>
        </EmptyState>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filtered.map((m) => <OpportunityCard key={m.opportunity.id} match={m} profile={profile} analysis={analysis} />)}
        </div>
      )}
    </>
  );
}
