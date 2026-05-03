import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="From the Heart Tutoring home">
      <span className="relative flex h-11 w-11 items-center justify-center">
        <svg viewBox="0 0 64 64" className="h-10 w-10 text-primary" aria-hidden="true">
          {/* Soft blush halo */}
          <circle cx="32" cy="32" r="30" className="fill-blush/60" />
          {/* Hand-drawn outer heart — slightly imperfect, asymmetric */}
          <path
            d="M32 52
               C 14 41, 9 28, 15 20
               C 20 13, 28 14, 32 21
               C 36 13, 44 14, 49 20
               C 55 29, 49 41, 32 52 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner stitched heart for that handmade, mom-and-pop feel */}
          <path
            d="M32 45
               C 20 37, 17 28, 21 23
               C 25 18, 30 20, 32 24
               C 34 20, 39 18, 43 23
               C 47 28, 44 37, 32 45 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="1.5 2.8"
            opacity="0.7"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-medium italic text-foreground tracking-tight">
          From the Heart
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Tutoring Co.
        </span>
      </span>
    </Link>
  );
}