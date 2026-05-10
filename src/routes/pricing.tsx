import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Check, MessageCircleHeart, GraduationCap, CalendarHeart, Heart } from "@/components/icons";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logoMark from "@/assets/logo-mark.png";

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

const faqCategories = [
  {
    title: "General Questions",
    icon: MessageCircleHeart,
    blurb: "The basics about who we tutor and how we hire.",
    items: [
      {
        q: "What age groups do you tutor?",
        a: (
          <p>
            We provide tutoring services for students of all ages, from elementary school through college. Our tutors are experienced in working with different age groups and can adapt their teaching methods to suit the needs and learning styles of each student.
          </p>
        ),
      },
      {
        q: "What subjects do you offer tutoring in?",
        a: (
          <>
            <p>We offer tutoring in a wide range of subjects including:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Mathematics, all levels from elementary to college</li>
              <li>Sciences, including Biology, Chemistry, and Physics</li>
              <li>English and Language Arts</li>
              <li>Spanish</li>
              <li>Standardized Test Preparation, including SAT, ACT, AP exams, and more</li>
              <li>Study Skills and Academic Coaching</li>
              <li>And many electives</li>
            </ul>
            <p className="mt-3">If you need tutoring in a subject not listed here, please contact us to discuss your specific needs.</p>
          </>
        ),
      },
      {
        q: "How are your tutors selected and qualified?",
        a: (
          <>
            <p>All of our tutors go through a rigorous selection process that includes:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Verification of academic credentials and subject expertise</li>
              <li>Background checks for safety and security</li>
              <li>Assessment of teaching abilities and communication skills</li>
              <li>Evaluation of patience, empathy, and ability to connect with students</li>
            </ul>
            <p className="mt-3">Many of our tutors have advanced degrees in their fields and years of teaching or tutoring experience. We prioritize not just academic knowledge but also the ability to effectively communicate concepts and build rapport with students.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Tutoring Process",
    icon: GraduationCap,
    blurb: "What learning with us actually looks like.",
    items: [
      {
        q: "How do you match students with tutors?",
        a: (
          <>
            <p>We carefully match students with tutors based on several factors:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Subject expertise and grade level requirements</li>
              <li>Learning style and personality compatibility</li>
              <li>Specific academic goals and challenges</li>
              <li>Schedule availability</li>
            </ul>
            <p className="mt-3">Our goal is to create a productive and positive tutoring relationship. If for any reason you feel the match is not working well, we are happy to find an alternative tutor who might be a better fit.</p>
          </>
        ),
      },
      {
        q: "What happens during a typical tutoring session?",
        a: (
          <>
            <p>A typical tutoring session lasts 60 minutes and is structured to maximize learning while keeping the student engaged. Sessions generally include:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Review of previous material and homework</li>
              <li>Addressing specific questions or problem areas</li>
              <li>Introduction and explanation of new concepts</li>
              <li>Guided practice with immediate feedback</li>
              <li>Independent practice to build confidence</li>
              <li>Summary of progress and assignment of practice work</li>
            </ul>
            <p className="mt-3">Our tutors adapt each session to the student&apos;s needs, focusing on areas that require the most attention while building on strengths.</p>
          </>
        ),
      },
      {
        q: "How do you track and report student progress?",
        a: (
          <>
            <p>We believe in transparent communication about student progress. Our progress tracking includes:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Session notes after each tutoring session</li>
              <li>Goal-setting and achievement tracking</li>
            </ul>
            <p className="mt-3">Parents and students have access to our online portal where they can view session summaries and communicate with tutors.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Scheduling and Logistics",
    icon: CalendarHeart,
    blurb: "Frequency, cancellations, and how we plan around your week.",
    items: [
      {
        q: "How often should my child meet with a tutor?",
        a: (
          <>
            <p>The frequency of tutoring sessions depends on the student&apos;s needs, goals, and schedule. Here are our general recommendations:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li><strong>For ongoing academic support:</strong> 1-2 sessions per week</li>
              <li><strong>For test preparation:</strong> 1-2 sessions per week, increasing as the test date approaches</li>
              <li><strong>For addressing specific challenges:</strong> 2-3 sessions per week until improvement is seen</li>
              <li><strong>For maintenance and enrichment:</strong> 1 session per week or every other week</li>
            </ul>
            <p className="mt-3">We&apos;ll work with you to determine the optimal frequency based on your child&apos;s specific situation and adjust as needed.</p>
          </>
        ),
      },
      {
        q: "What is your cancellation policy?",
        a: (
          <>
            <p>We understand that schedules can change. Our cancellation policy is as follows:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Cancellations made with at least 24 hours&apos; notice: No charge</li>
              <li>Cancellations with less than 24 hours&apos; notice: 50% of the session fee</li>
              <li>No-shows without notification: Full session fee</li>
            </ul>
            <p className="mt-3">In cases of illness or emergency, we&apos;re happy to waive the cancellation fee.</p>
          </>
        ),
      },
    ],
  },
  {
    title: "Pricing and Payments",
    icon: Heart,
    blurb: "Rates, billing, and the little perks along the way.",
    items: [
      {
        q: "How much does a session cost?",
        a: <p>Our standard rate is $70 per hour, regardless of the subject. This would come to 4 sessions for $280 or 8 sessions for $560.</p>,
      },
      {
        q: "What payment methods do you accept?",
        a: (
          <>
            <p>We accept a variety of payment methods for your convenience:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Credit/debit cards, including Visa, Mastercard, American Express, and Discover</li>
              <li>PayPal</li>
              <li>Venmo</li>
              <li>Bank transfers/ACH</li>
              <li>Checks for package purchases only</li>
            </ul>
            <p className="mt-3">We offer both one-time payments and convenient auto-billing options. All payment information is securely stored and processed in compliance with industry standards.</p>
          </>
        ),
      },
      {
        q: "Are there any current specials?",
        a: (
          <>
            <p>Yes, we have two exciting offers:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>We offer 50% off for your first session.</li>
              <li>You can get $25 off a session if you refer someone.</li>
            </ul>
            <p className="mt-3">Don&apos;t miss out on these great deals!</p>
          </>
        ),
      },
      {
        q: "How do I pay for my session?",
        a: (
          <p>
            To learn how to pay for a session, check out our{" "}
            <a href="https://www.tutorbird.com/download/67000/?tmstv=1701374377" target="_blank" rel="noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
              detailed guide
            </a>
            .
          </p>
        ),
      },
      {
        q: "How long is a typical session?",
        a: <p>Each session lasts one hour.</p>,
      },
      {
        q: "Why am I being billed for 4 sessions at a time?",
        a: <p>To ensure your session time remains reserved, we require payment for a month&apos;s worth of weekly sessions in advance. This policy helps us manage high demand and provide consistent scheduling for all our students.</p>,
      },
      {
        q: "What if I don't use the full hour of time I reserved?",
        a: <p>While we understand that sometimes all your questions can be answered before the hour is over, we also offer extra practice for the remainder of your session upon request.</p>,
      },
    ],
  },
];

function PricingPage() {
  const [activeCategory, setActiveCategory] = useState(
    faqCategories[0].title.toLowerCase().replaceAll(" ", "-"),
  );
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
              <div className="flex items-center gap-2 text-primary">
                <img src={logoMark} alt="" aria-hidden width={790} height={790} className="h-6 w-6" />
                <span className="text-sm font-medium uppercase tracking-widest">Per Session</span>
              </div>
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

      <Section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 via-cream to-blush/30">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-blush/60 blur-3xl"
        />
        <img
          src={logoMark}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-6 top-10 h-24 w-24 rotate-12 opacity-10 md:h-40 md:w-40"
        />

        <div className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Questions parents <span className="italic text-primary">actually</span> ask us
            </h2>
            <p className="mt-4 text-muted-foreground">
              Skim a category, or read the whole thing — there&rsquo;s no fluff, just honest answers.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
            {/* Category nav */}
            <nav className="lg:sticky lg:top-24 lg:self-start" aria-label="FAQ categories">
              <ul className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">
                {faqCategories.map((category) => {
                  const key = category.title.toLowerCase().replaceAll(" ", "-");
                  const isActive = activeCategory === key;
                  const Icon = category.icon;
                  return (
                    <li key={key} className="flex-none lg:flex-auto">
                      <a
                        href={`#${key}`}
                        onClick={() => setActiveCategory(key)}
                        className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "border-primary/30 bg-card shadow-md shadow-primary/10"
                            : "border-transparent bg-card/50 hover:border-primary/20 hover:bg-card"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-colors ${
                            isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex flex-col">
                          <span className="whitespace-nowrap lg:whitespace-normal">{category.title}</span>
                          <span className="hidden text-xs font-normal text-muted-foreground lg:inline">
                            {category.items.length} {category.items.length === 1 ? "question" : "questions"}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Accordion content */}
            <div className="space-y-12">
              {faqCategories.map((category, catIdx) => {
                const categoryKey = category.title.toLowerCase().replaceAll(" ", "-");
                const Icon = category.icon;
                return (
                  <div
                    key={category.title}
                    id={categoryKey}
                    className="scroll-mt-24"
                    onMouseEnter={() => setActiveCategory(categoryKey)}
                  >
                    <div className="mb-6 flex items-start gap-4">
                      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                          {String(catIdx + 1).padStart(2, "0")} — Section
                        </div>
                        <h3 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
                          {category.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{category.blurb}</p>
                      </div>
                    </div>

                    <Accordion
                      type="single"
                      collapsible
                      defaultValue={catIdx === 0 ? `${categoryKey}-0` : undefined}
                      className="space-y-3"
                    >
                      {category.items.map((f, i) => (
                        <AccordionItem
                          key={f.q}
                          value={`${categoryKey}-${i}`}
                          className="group overflow-hidden rounded-2xl border border-border/70 bg-card/80 px-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md data-[state=open]:border-primary/40 data-[state=open]:bg-card data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5"
                        >
                          <AccordionTrigger className="gap-4 py-5 text-left text-base font-semibold hover:no-underline [&>svg]:text-primary">
                            <span className="flex items-start gap-4">
                              <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                                {i + 1}
                              </span>
                              <span>{f.q}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pl-11 pr-2 font-sans text-sm leading-relaxed text-muted-foreground">
                            {f.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}

              <div className="rounded-3xl border border-primary/20 bg-card/80 p-8 text-center shadow-sm backdrop-blur-sm">
                <Heart className="mx-auto h-8 w-8 text-primary" />
                <h3 className="mt-3 font-display text-2xl font-semibold">Still have a question?</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  We answer every message ourselves — no bots, no scripts, just real people who care.
                </p>
                <Button asChild size="lg" className="mt-5 rounded-full">
                  <Link to="/contact">Reach out</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
