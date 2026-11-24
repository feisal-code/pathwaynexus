import { Link } from "@tanstack/react-router";

import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 surface-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-sm text-sm text-ink-muted">From proven skills to meaningful opportunity.</p>
          <p className="max-w-md rounded-lg border border-ink-border px-4 py-3 text-xs leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink-foreground">Prototype notice.</span> All people, organisations and
            opportunities shown are fictional demo data. AI outputs are assessments and recommendations — they do not
            verify qualifications or credentials.
          </p>
        </div>
        <nav aria-label="Journey" className="space-y-2 text-sm">
          <p className="eyebrow text-ink-muted">Your journey</p>
          <ul className="space-y-2">
            <li><Link to="/profile" className="hover:text-accent">Talent profile</Link></li>
            <li><Link to="/passport" className="hover:text-accent">Skills Passport</Link></li>
            <li><Link to="/opportunities" className="hover:text-accent">Opportunity matches</Link></li>
            <li><Link to="/mentors" className="hover:text-accent">Mentor matches</Link></li>
            <li><Link to="/pathway" className="hover:text-accent">My pathway</Link></li>
          </ul>
        </nav>
        <nav aria-label="Organisation" className="space-y-2 text-sm">
          <p className="eyebrow text-ink-muted">Pathway Nexus</p>
          <ul className="space-y-2">
            <li><Link to="/partners" className="hover:text-accent">For employers & partners</Link></li>
            <li><Link to="/how-it-works" className="hover:text-accent">About & how it works</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ink-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-ink-muted sm:px-6">
          © {new Date().getFullYear()} Pathway Nexus · Hackathon MVP · Your data stays on this device.
        </p>
      </div>
    </footer>
  );
}
