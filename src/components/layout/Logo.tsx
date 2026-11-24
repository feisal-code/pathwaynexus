export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" className={inverted ? "fill-ink-foreground" : "fill-primary"} />
        <path
          d="M8 22 L14 14 L18 18 L24 10"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={inverted ? "stroke-ink" : "stroke-primary-foreground"}
        />
        <circle cx="24" cy="10" r="2.6" className="fill-accent" />
        <circle cx="8" cy="22" r="2" className={inverted ? "fill-ink" : "fill-primary-foreground"} />
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${inverted ? "text-ink-foreground" : "text-foreground"}`}>
        Pathway<span className={inverted ? "text-accent" : "text-primary"}> Nexus</span>
      </span>
    </span>
  );
}
