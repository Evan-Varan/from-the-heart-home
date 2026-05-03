import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CalendarHeart, EnvelopeSimple as Mail, Lock, Phone } from "@/components/icons";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Book a Session — From the Heart Tutoring" },
      { name: "description", content: "Book your first virtual tutoring session or contact us with questions. We typically reply the same day." },
      { property: "og:title", content: "Book a Session — From the Heart Tutoring" },
      { property: "og:description", content: "Book your first virtual tutoring session." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thanks! We'll be in touch within one business day.");
    }, 700);
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-12 md:pt-20">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Eyebrow>Let&rsquo;s talk</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              Book your first session.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Tell us a little about your student and we&rsquo;ll match you with the right tutor.
              Most families hear back the same day.
            </p>
            <div className="mt-8 space-y-4">
              <a href="mailto:hello@fromthehearttutoring.com" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5"/></span>
                <div>
                  <p className="text-sm font-medium">Email us</p>
                  <p className="text-sm text-muted-foreground">hello@fromthehearttutoring.com</p>
                </div>
              </a>
              <a href="tel:5551234567" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Phone className="h-5 w-5"/></span>
                <div>
                  <p className="text-sm font-medium">Call or text</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
              </a>
              <Link to="/portal" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Lock className="h-5 w-5"/></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Existing student? Sign in</p>
                  <p className="text-sm text-muted-foreground">Use the Student Portal to schedule.</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarHeart className="h-5 w-5"/></span>
                <h2 className="text-xl font-semibold">Tell us about your student</h2>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="parent">Parent name</Label>
                  <Input id="parent" required className="mt-1.5" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required className="mt-1.5" placeholder="you@email.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" className="mt-1.5" placeholder="Optional" />
                </div>
                <div>
                  <Label htmlFor="grade">Student grade</Label>
                  <Input id="grade" className="mt-1.5" placeholder="e.g. 10th grade" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="subject">Subject(s) needed</Label>
                  <Input id="subject" className="mt-1.5" placeholder="e.g. Algebra II, SAT prep" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="msg">Anything else we should know?</Label>
                  <Textarea id="msg" className="mt-1.5 min-h-28" placeholder="Goals, schedule, learning style…" />
                </div>
              </div>
              <Button type="submit" size="lg" disabled={loading} className="mt-6 w-full rounded-full">
                {loading ? "Sending…" : "Book a Session"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                No commitment — we&rsquo;ll reach out to find a time that works.
              </p>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
