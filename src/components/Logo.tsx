import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="From the Heart Tutoring home">
      <span className="relative flex h-10 w-10 items-center justify-center">
        <svg viewBox="0 0 48 48" className="h-9 w-9 text-primary" aria-hidden="true">
          {/* Hand-drawn, slightly imperfect heart with a soft inner accent */}
          <path
            d="M24 40 C 9 30, 5 20, 11 13 C 16 7, 22 9, 24 14 C 26 9, 32 7, 37 13 C 43 20, 39 30, 24 40 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 19 C 21 22, 24 24, 28 23"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[16px] font-semibold italic text-foreground tracking-tight">From the Heart</span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Tutoring</span>
      </span>
    </Link>
  );
}