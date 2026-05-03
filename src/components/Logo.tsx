import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="From the Heart Tutoring home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-7.5-4.6-9.5-9.1C1.1 8.5 3.3 5 6.7 5c1.9 0 3.6 1 4.3 2.5h2C13.7 6 15.4 5 17.3 5c3.4 0 5.6 3.5 4.2 6.9C19.5 16.4 12 21 12 21z"/>
        </svg>
        <span className="absolute inset-0 rounded-full ring-1 ring-primary/20" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-semibold text-foreground tracking-tight">From the Heart</span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tutoring</span>
      </span>
    </Link>
  );
}