import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { CalendarHeart, Progress } from "@/components/icons";
import { buildSeo } from "@/lib/seo";
import { useState } from "react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    ...buildSeo({
      title: "Student Portal | From the Heart Tutoring",
      description:
        "Student portal for From the Heart Tutoring families to schedule sessions and manage tutoring details.",
      path: "/portal",
      noindex: true,
    }),
  }),
  component: PortalPage,
});

function PortalPage() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush/40 via-cream to-background" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:py-24 md:px-6">
        <div className="flex flex-col justify-center">
          <Logo variant="mark" />
          <h1 className="mt-8 text-4xl font-semibold leading-tight md:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            The Student Portal is where existing families schedule sessions, view tutor notes,
            and manage their account. New here? <Link to="/contact" className="text-primary underline-offset-4 hover:underline">Get started in minutes →</Link>
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
              <CalendarHeart className="h-5 w-5 text-primary" />
              <span className="text-sm">Schedule weekly sessions</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
              <Progress className="h-5 w-5 text-primary" />
              <span className="text-sm">View tutor notes & progress</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7 shadow-xl md:p-9">
          <div className="text-sm font-medium uppercase tracking-widest text-primary">Sign in</div>
          <h2 className="mt-2 text-2xl font-semibold">Student Portal</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatusMessage(
                "The portal is launching soon. For now, please contact us to schedule.",
              );
            }}
            aria-describedby={statusMessage ? "portal-status" : undefined}
            className="mt-6 space-y-4"
          >
            <div>
              <Label htmlFor="pemail">Email</Label>
              <Input
                id="pemail"
                name="email"
                type="email"
                className="mt-1.5"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <Label htmlFor="ppass">Password</Label>
              <Input
                id="ppass"
                name="password"
                type="password"
                className="mt-1.5"
                placeholder="••••••••"
              />
            </div>
            {statusMessage && (
              <p
                id="portal-status"
                role="status"
                className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary"
              >
                {statusMessage}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full rounded-full">Sign in</Button>
          </form>

          <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Portal launching soon</p>
            <p className="mt-1">In the meantime, just <Link to="/contact" className="text-primary underline-offset-4 hover:underline">message us</Link> to schedule — we&rsquo;ll handle the rest personally.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
