import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  Flask as FlaskConical,
  GraduationCap,
  PencilRuler,
  Languages,
} from "@/components/icons";
import logoMark from "@/assets/logo-mark.png";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Subjects — From the Heart Tutoring" },
      { name: "description", content: "Virtual one-on-one tutoring for K–12 and college students: math, science, English, test prep, study skills and more." },
      { property: "og:title", content: "Services & Subjects — From the Heart Tutoring" },
      { property: "og:description", content: "Virtual one-on-one tutoring for K–12 and college students." },
    ],
  }),
  component: ServicesPage,
});

const subjects = [
  { icon: Calculator, title: "Math", desc: "Pre-algebra through calculus, plus AP-level support." },
  { icon: FlaskConical, title: "Science", desc: "Biology, chemistry, physics and earth sciences." },
  { icon: BookOpen, title: "English & Writing", desc: "Reading comprehension, essays, and grammar." },
  { icon: ClipboardCheck, title: "Test Prep", desc: "SAT, ACT, PSAT and subject-specific exams." },
  { icon: Brain, title: "Study Skills", desc: "Time management, note-taking and exam strategy." },
  { icon: PencilRuler, title: "Homework Help", desc: "Weekly check-ins to keep students on track." },
  { icon: Languages, title: "Foreign Language", desc: "Spanish and French at beginner to AP levels." },
  { icon: GraduationCap, title: "College Support", desc: "Intro courses, essays, and study coaching." },
];

function ServicesPage() {
  return (
    <>
      <Section className="pt-12 md:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>What we teach</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            Subjects we love, students we know.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Every session is one-on-one and tailored to your student. Don&rsquo;t see your subject?
            Just ask — we likely have a tutor for it.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((s) => (
            <div key={s.title} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <div className="grid items-center gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <img src={logoMark} alt="" aria-hidden width={790} height={790} className="pointer-events-none mb-4 h-8 w-8 opacity-90" />
            <h2 className="text-3xl font-semibold md:text-4xl">Built for high school. Loved by every grade.</h2>
            <p className="mt-4 text-muted-foreground">
              We specialize in supporting high schoolers through the toughest stretch of their academic
              journey, while also caring for elementary, middle school, and college students.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-full md:justify-self-end">
            <Link to="/contact">Book a Session</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
