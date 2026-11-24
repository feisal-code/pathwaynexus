import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Logo } from "./Logo";

const JOURNEY = [
  { to: "/profile", label: "Profile" },
  { to: "/passport", label: "Skills Passport" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/mentors", label: "Mentors" },
  { to: "/pathway", label: "My Pathway" },
] as const;

const SECONDARY = [
  { to: "/partners", label: "For partners" },
  { to: "/how-it-works", label: "How it works" },
] as const;

const linkBase = "rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary";
const linkActive = "text-foreground bg-secondary";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="Pathway Nexus home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
          {JOURNEY.map((l) => (
            <Link key={l.to} to={l.to} className={linkBase} activeProps={{ className: linkActive }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {SECONDARY.map((l) => (
            <Link key={l.to} to={l.to} className={linkBase} activeProps={{ className: linkActive }}>
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link to="/profile">Build my pathway</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="text-left">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1 px-2">
              <p className="eyebrow px-3 pb-1 text-muted-foreground">Your journey</p>
              {JOURNEY.map((l, i) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`${linkBase} flex items-center gap-3 text-base`}
                  activeProps={{ className: linkActive }}
                >
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  {l.label}
                </Link>
              ))}
              <div className="my-3 border-t" />
              {SECONDARY.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`${linkBase} text-base`}
                  activeProps={{ className: linkActive }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
