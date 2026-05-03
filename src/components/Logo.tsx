import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="From the Heart Tutoring home"
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        <svg
          viewBox="0 0 64 64"
          className="h-10 w-10 text-primary"
          aria-hidden="true"
        >
          {/* Soft, rounded heart — filled, friendly, no rough edges */}
          <path
            d="M32 54
               C 14 43, 8 30, 14 21
               C 19 14, 28 14, 32 22
               C 36 14, 45 14, 50 21
               C 56 30, 50 43, 32 54 Z"
            fill="currentColor"
          />
          {/* Open book nestled inside the heart */}
          <g transform="translate(32 34)">
            {/* book spine shadow */}
            <path
              d="M0 -6 L0 7"
              stroke="hsl(var(--card))"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* left page */}
            <path
              d="M-10 -6
                 C -7 -7, -3 -7, 0 -6
                 L 0 7
                 C -3 6, -7 6, -10 7
                 Z"
              fill="hsl(var(--card))"
            />
            {/* right page */}
            <path
              d="M10 -6
                 C 7 -7, 3 -7, 0 -6
                 L 0 7
                 C 3 6, 7 6, 10 7
                 Z"
              fill="hsl(var(--card))"
            />
            {/* page lines */}
            <path
              d="M-7.5 -3 L -2 -3 M -7.5 -0.5 L -2.5 -0.5 M -7.5 2 L -3 2"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.4"
            />
            <path
              d="M2 -3 L 7.5 -3 M 2.5 -0.5 L 7.5 -0.5 M 3 2 L 7.5 2"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span
          className="font-script text-[22px] font-semibold text-foreground -mb-0.5"
          style={{ lineHeight: 0.95 }}
        >
          From the Heart
        </span>
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Tutoring Co.
        </span>
      </span>
    </Link>
  );
}
