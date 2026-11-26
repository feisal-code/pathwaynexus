import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function PartnerAsk() {
  return (
    <div className="mt-6 rounded-xl border bg-card p-6 text-card-foreground">
      <h3 className="text-2xl font-medium">What we need from partners</h3>
      <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-muted-foreground">
        <li>Employers: offer short micro-projects, shadowing or internships</li>
        <li>NGOs and refugee-led organisations: refer skilled candidates and co-design support</li>
        <li>Mentors and universities: share expertise and help validate qualifications</li>
      </ul>
      <Button asChild className="mt-5"><Link to="/partners">Become a pilot partner</Link></Button>
    </div>
  );
}