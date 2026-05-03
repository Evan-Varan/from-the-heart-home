import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users } from "lucide-react";
import { RotatingImage } from "@/components/RotatingImage";
import tutor1 from "@/assets/tutor-1.jpg";
import tutor2 from "@/assets/tutor-2.jpg";
import tutor3 from "@/assets/tutor-3.jpg";
import logoMark from "@/assets/logo-mark.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — From the Heart Tutoring" },
      { name: "description", content: "A small, family-run tutoring practice committed to personal attention, flexibility, and student confidence." },
      { property: "og:title", content: "About — From the Heart Tutoring" },
      { property: "og:description", content: "A small, family-run tutoring practice committed to personal attention." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Section className="pt-12 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
              Tutoring that feels like family.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              From the Heart Tutoring began with a simple belief: every student deserves a tutor who
              knows their name, their goals, and what makes them light up. We&rsquo;re a small,
              family-run practice — not a chain — and that&rsquo;s exactly what makes us different.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We pair each student with a tutor who fits their personality and learning style, then
              stay closely in touch with parents along the way. No call centers. No rotating
              tutors. Just real people who genuinely care about your child&rsquo;s growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/contact">Get in touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/services">See subjects</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-blush/40 blur-2xl" aria-hidden />
            <RotatingImage
              images={[tutor1, tutor2, tutor3]}
              alt="A tutor smiling during a virtual session"
              className="relative aspect-square w-full rounded-3xl shadow-xl"
            />
            <img src={logoMark} alt="" aria-hidden className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 -rotate-6 drop-shadow-md md:h-24 md:w-24" />
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Heart, title: "Personal, not corporate", body: "You&rsquo;ll know your tutor by name. We answer your texts, remember your kid&rsquo;s big test, and show up like family." },
            { icon: Users, title: "One student, one tutor", body: "Consistency builds trust. Your student keeps the same tutor week after week — no shuffling." },
            { icon: Sparkles, title: "Confidence first", body: "Grades follow when students feel capable. We teach the material and the mindset." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-7 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: c.body }} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}