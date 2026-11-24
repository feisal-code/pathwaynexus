import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { usePathway } from "@/lib/pathway/store";
import { cn } from "@/lib/utils";

const STEPS = [
  { to: "/profile", label: "Profile" },
  { to: "/passport", label: "Skills analysis" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/mentors", label: "Mentors" },
  { to: "/pathway", label: "Pathway" },
] as const;

/** Compact progress bar across the core journey: Profile → Passport → Matches → Mentors → Pathway. */
export function JourneySteps({ current }: { current: (typeof STEPS)[number]["to"] }) {
  const { profile, analysis, mentorRequests, hydrated } = usePathway();
  const done: Record<string, boolean> = {
    "/profile": Boolean(profile),
    "/passport": Boolean(analysis),
    "/opportunities": Boolean(analysis),
    "/mentors": Object.keys(mentorRequests).length > 0,
    "/pathway": false,
  };
  return (
    <nav aria-label="Journey progress" className="mb-8 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1 text-sm">
        {STEPS.map((s, i) => {
          const isCurrent = s.to === current;
          const isDone = hydrated && done[s.to];
          return (
            <li key={s.to} className="flex items-center gap-1">
              <Link
                to={s.to}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors",
                  isCurrent ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full font-mono text-[0.65rem]",
                    isDone ? "bg-success text-primary-foreground" : isCurrent ? "bg-accent text-accent-foreground" : "border",
                  )}
                >
                  {isDone ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                </span>
                {s.label}
              </Link>
              {i < STEPS.length - 1 && <span className="h-px w-5 bg-border" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
