import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, PlayCircle, Route as RouteIcon, ScanSearch, Target, UserRound, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const STEPS = [
  { icon: UserRound, title: "Profile", to: "/profile", body: "Share your professional experience, skills, languages and goals — no legal status or ID needed." },
  { icon: ScanSearch, title: "Skills analysis", to: "/passport", body: "AI turns your experience into a Skills Passport with transferable skills and gaps." },
  { icon: Target, title: "Opportunity match", to: "/opportunities", body: "See realistic opportunities ranked by skill match, location and language." },
  { icon: Users, title: "Mentor match", to: "/mentors", body: "Connect with mentors in your field who know the local market." },
  { icon: RouteIcon, title: "Personalised pathway", to: "/pathway", body: "Follow clear next steps — from closing skill gaps to applying." },
] as const;

export function DemoTour() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const step = STEPS[i] ?? STEPS[0];
  const Icon = step.icon;
  const last = i === STEPS.length - 1;
  return (
    <>
      <Button size="lg" variant="ghost" onClick={() => { setI(0); setOpen(true); }}>
        <PlayCircle /> See it in 60 seconds
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <p className="font-mono text-xs text-muted-foreground">Step {i + 1} of {STEPS.length}</p>
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-6" aria-hidden="true" /></span>
          <DialogTitle className="font-display text-3xl font-medium">{step.title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">{step.body}</DialogDescription>
          <div className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((s, n) => <span key={s.title} className={`h-1.5 flex-1 rounded-full ${n <= i ? "bg-primary" : "bg-muted"}`} />)}
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => setI(i - 1)}><ArrowLeft /> Back</Button>
            <Button asChild variant="link" size="sm"><Link to={step.to} onClick={() => setOpen(false)}>Open this step</Link></Button>
            {last ? (
              <Button asChild size="sm"><Link to="/profile" onClick={() => setOpen(false)}>Start <ArrowRight /></Link></Button>
            ) : (
              <Button size="sm" onClick={() => setI(i + 1)}>Next <ArrowRight /></Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
