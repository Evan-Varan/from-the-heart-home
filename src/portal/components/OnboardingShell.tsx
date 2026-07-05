import type { ReactNode } from "react";
import logoMark from "@/assets/logo-mark-small.webp";
import { OnboardingProgress } from "./OnboardingProgress";

interface OnboardingShellProps {
  children: ReactNode;
  step: number;
}

export function OnboardingShell({ children, step }: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="h-12 shrink-0 border-b border-border bg-background flex items-center px-6">
        <a href="/" className="flex items-center gap-2.5" aria-label="From the Heart Tutoring">
          <img src={logoMark} alt="" className="h-7 w-7 shrink-0 object-contain" />
          <span className="text-sm font-semibold text-foreground">Student Portal</span>
        </a>
      </header>
      <main className="flex-1 flex flex-col items-center pt-10 px-4 pb-16">
        <div className="w-full max-w-lg space-y-6">
          <OnboardingProgress step={step} />
          {children}
        </div>
      </main>
    </div>
  );
}
