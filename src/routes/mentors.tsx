import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, MapPin, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { JourneySteps } from "@/components/pathway/JourneySteps";
import { RequireAnalysis } from "@/components/pathway/RequireAnalysis";
import { AiBadge, DemoBadge, MatchScore, Page, PageHeader, SkillChip } from "@/components/pathway/common";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MENTORS } from "@/lib/pathway/demo-data";
import { matchMentors } from "@/lib/pathway/matching";
import { usePathway } from "@/lib/pathway/store";
import type { MentorMatch, StoredAnalysis, TalentProfile } from "@/lib/pathway/types";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Mentor Matches — Pathway Nexus" },
      { name: "description", content: "Mentors recommended for your specific skill gaps, with a clear reason for every match." },
      { property: "og:title", content: "Mentor Matches — Pathway Nexus" },
      { property: "og:description", content: "Connect with professionals who can help close your skill gaps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MentorsPage,
});

function MentorsPage() {
  return (
    <Page>
      <JourneySteps current="/mentors" />
      <RequireAnalysis>{(d) => <MentorList {...d} />}</RequireAnalysis>
    </Page>
  );
}

function initials(name: string) {
  return name.replace(/^Dr\.\s*/, "").split(" ").map((p) => p[0]).slice(0, 2).join("");
}

function MentorList({ profile, analysis }: { profile: TalentProfile; analysis: StoredAnalysis }) {
  const matches = useMemo(() => matchMentors(MENTORS, profile, analysis.analysis), [profile, analysis]);
  const { mentorRequests } = usePathway();
  const [selected, setSelected] = useState<MentorMatch | null>(null);
  const requested = Object.keys(mentorRequests).length;
  const gaps = analysis.analysis.skillGaps.map((g) => g.gap);

  return (
    <>
      <PageHeader
        eyebrow="Step 4 · Mentor match"
        title="People who've walked this path."
        description={
          gaps.length
            ? `Matched to your identified gaps: ${gaps.slice(0, 3).join(", ")}.`
            : "Matched to your field and skills."
        }
        actions={
          requested > 0 ? (
            <Button asChild variant="outline"><Link to="/pathway">{requested} request{requested > 1 ? "s" : ""} sent · View pathway <ArrowRight /></Link></Button>
          ) : undefined
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((m) => (
          <MentorCard key={m.mentor.id} match={m} onRequest={() => setSelected(m)} />
        ))}
      </div>

      <RequestDialog match={selected} onClose={() => setSelected(null)} profile={profile} />
    </>
  );
}

function MentorCard({ match, onRequest }: { match: MentorMatch; onRequest: () => void }) {
  const { mentor: m, score, reason, matchedAreas } = match;
  const { mentorRequests, cancelMentorRequest } = usePathway();
  const sent = mentorRequests[m.id];
  return (
    <article className="flex flex-col rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-ink font-display text-lg text-ink-foreground" aria-hidden="true">
            {initials(m.name)}
          </span>
          <div>
            <h3 className="text-xl font-medium leading-tight">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.role}</p>
          </div>
        </div>
        <MatchScore value={score} size={60} label="mentor match" />
      </div>
      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div><dt className="sr-only">Industry</dt><dd>{m.industry}</dd></div>
        <div className="inline-flex items-center gap-1"><dt className="sr-only">Experience</dt><Clock className="size-3" aria-hidden="true" /><dd>{m.yearsExperience} yrs</dd></div>
        <div className="inline-flex items-center gap-1"><dt className="sr-only">Location</dt><MapPin className="size-3" aria-hidden="true" /><dd>{m.location}</dd></div>
      </dl>
      <p className="mt-3 text-sm leading-relaxed">{m.bio}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {m.expertise.map((e) => (
          <SkillChip key={e} tone={matchedAreas.includes(e) ? "strength" : "neutral"}>{e}</SkillChip>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-primary-soft p-4 text-sm leading-relaxed">
        <p className="eyebrow mb-1 text-primary">Why this mentor</p>
        “{reason}”
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
        <DemoBadge />
        {sent ? (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-success-soft px-3 py-1.5 text-sm font-medium text-success" role="status">
              <Check className="size-4" aria-hidden="true" /> Request sent
            </span>
            <Button variant="ghost" size="sm" onClick={() => { cancelMentorRequest(m.id); toast("Request withdrawn"); }}>Withdraw</Button>
          </div>
        ) : (
          <Button size="sm" onClick={onRequest}><Send /> Request Connection</Button>
        )}
      </div>
    </article>
  );
}

function RequestDialog({ match, onClose, profile }: { match: MentorMatch | null; onClose: () => void; profile: TalentProfile }) {
  const { requestMentor } = usePathway();
  const first = profile.fullName.split(" ")[0] ?? "";
  const [message, setMessage] = useState("");
  const m = match?.mentor;
  const defaultMsg = m
    ? `Hello ${m.name.split(" ")[0]}, I'm ${first}, a ${profile.professionalField.toLowerCase()} professional with ${profile.yearsOfExperience} years of experience. I'd value your advice on ${match?.matchedAreas[0]?.toLowerCase() ?? "entering the local job market"}.`
    : "";

  return (
    <Dialog open={Boolean(match)} onOpenChange={(o) => { if (!o) { onClose(); setMessage(""); } }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium">Request a connection with {m?.name}</DialogTitle>
          <DialogDescription>
            Your first name, field and experience are shared with the mentor. Contact details are only exchanged if they accept.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mentor-message">Introduction message</Label>
            <AiBadge label="Suggested" />
          </div>
          <Textarea id="mentor-message" rows={5} value={message || defaultMsg} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!m) return;
              requestMentor(m.id);
              toast.success(`Connection request sent to ${m.name}`, { description: "Added to your pathway. Demo: no message is actually delivered." });
              setMessage("");
              onClose();
            }}
          >
            <Send /> Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
