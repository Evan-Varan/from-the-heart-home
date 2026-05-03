import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & FAQ — From the Heart Tutoring" },
      { name: "description", content: "Simple, honest pricing at $70 per one-on-one virtual tutoring session. Answers to common questions from parents." },
      { property: "og:title", content: "Pricing & FAQ — From the Heart Tutoring" },
      { property: "og:description", content: "Simple, honest pricing at $70 per session." },
    ],
  }),
  component: PricingPage,
});

const includes = [
  "60-minute one-on-one virtual session",
  "Matched with a tutor who fits your student",
  "Tutor stays in touch between sessions",
  "Parent updates so you&rsquo;re never in the dark",
  "Flexible scheduling — evenings & weekends",
  "No long-term contracts. Cancel anytime.",
];

const faqs = [
  { q: "How does virtual tutoring actually work?", a: "Sessions happen over a private video link with a shared digital whiteboard. Your student just needs a laptop or tablet and a quiet spot. Most parents find it easier than driving to a learning center." },
  { q: "Who is tutoring for?", a: "We work with K–12 students (with a focus on high schoolers) and college students who want extra support, confidence, or test prep." },
  { q: "Do I have to use a portal to book?", a: "Not at all. You can text, email, or call us directly to schedule. A student portal is coming soon for families who prefer self-serve scheduling." },
  { q: "What if my student needs a different subject mid-month?", a: "That&rsquo;s totally fine. We&rsquo;ll switch focus or pair you with another tutor at no extra cost." },
  { q: "Can my student have the same tutor every week?", a: "Yes — that&rsquo;s the whole idea. Consistency is at the heart of what we do." },
  { q: "Are there discounts for multiple sessions?", a: "We keep pricing simple at $70 per session. Reach out if you&rsquo;d like a custom plan for siblings or weekly bundles." },
];

function PricingPage() {
  return (
    <>
      <Section className="pt-12 md:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Simple pricing</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            One honest price. No surprises.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            We believe great tutoring should be straightforward. Pay per session, cancel anytime, and only continue when it&rsquo;s working.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 shadow-xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blush/50 blur-3xl" aria-hidden />
            <div className="relative">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Per Session</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-6xl font-semibold tracking-tight">$70</span>
                <span className="text-muted-foreground">/ 60 min</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Same price for every grade and subject.</p>
              <ul className="mt-7 space-y-3">
                {includes.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: i }} />
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-7 w-full rounded-full">
                <Link to="/contact">Book a Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold md:text-4xl">Questions parents ask us most</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-card px-5 mb-3 data-[state=open]:shadow-sm">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
    </>
  );
}