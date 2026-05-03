import { ReactNode } from "react";

export function Section({
  id,
  className = "",
  children,
  bleed = false,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  bleed?: boolean;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className={bleed ? "" : "mx-auto max-w-6xl px-4 md:px-6"}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
      {children}
    </span>
  );
}