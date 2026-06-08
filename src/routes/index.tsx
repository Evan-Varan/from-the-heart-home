import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/Section";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Progress,
  Users,
  ShieldCheck,
  CalendarHeart,
  MessageCircleHeart,
  GraduationCap,
  Star,
  ArrowRight,
  Check,
  MapPin,
} from "@/components/icons";
import { RotatingImage } from "@/components/RotatingImage";
import hero1 from "@/assets/hero-boy-headphones.optimized.jpg";
import hero2 from "@/assets/hero-girl-red-hair-laptop.optimized.jpg";
import hero3 from "@/assets/hero-teenage-boy-laptop.optimized.jpg";
import parent1 from "@/assets/parent-young-girl-mother.optimized.jpg";
import parent2 from "@/assets/parent-young-boy-laptop-plant.optimized.jpg";
import parent3 from "@/assets/parent-teenage-girl-orange-shirt.optimized.jpg";
import logoMark from "@/assets/logo-mark.png";
import { buildSeo, jsonLdScript, tutoringServiceJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...buildSeo({
      title: "Online Tutoring for K-12 & College Students | From the Heart Tutoring",
      description:
        "Caring one-on-one virtual tutoring for K-12 and college students across the U.S. Get support in math, science, English, study skills, and SAT/ACT prep.",
    }),
    scripts: [jsonLdScript(tutoringServiceJsonLd())],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush/50 via-cream to-background" aria-hidden />
        <div className="absolute right-[-10%] top-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-20 md:px-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> Virtual tutoring · Nationwide
            </span>
            <h1 className="mt-5 text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Personalized tutoring,
              <span className="block text-primary">taught from the heart.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              One-on-one virtual sessions for K–12 and college students. We help your student build
              real skills — and the confidence to use them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 shadow-md shadow-primary/20">
                <Link to="/contact">Book a Session <ArrowRight className="ml-1 h-4 w-4"/></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary"/> $70 / 60-min session</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary"/> Same tutor every week</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary"/> No long-term contracts</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
              <RotatingImage
                images={[hero1, hero2, hero3]}
                alt="Student working during a virtual tutoring session"
                className="aspect-[4/5] w-full md:aspect-[5/6]"
              />
            </div>
            {/* Floating cards */}
            <div className="absolute -left-4 bottom-6 hidden rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    { initials: "KC", label: "Kelly C.", className: "bg-blush text-primary" },
                    { initials: "MA", label: "Maerie A.", className: "bg-accent text-accent-foreground" },
                    { initials: "RG", label: "Ruth G.", className: "bg-primary/15 text-primary" },
                  ].map((avatar) => (
                    <div
                      key={avatar.initials}
                      aria-label={avatar.label}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-card ${avatar.className}`}
                    >
                      <span className="font-sans text-[10px] font-semibold leading-none">{avatar.initials}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">250+ Families</p>
                  <p className="text-xs text-muted-foreground">trust us nationwide</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-3 top-6 hidden rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur md:block">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold">4.9</span>
              </div>
              <p className="text-xs text-muted-foreground">from 200+ parent reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <Section>
        <div className="grid items-end gap-6 md:grid-cols-2">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              A small tutoring practice, built around your student.
            </h2>
          </div>
          <p className="text-muted-foreground md:text-lg">
            From the Heart Tutoring is family-run and intentionally small. Every student is paired with one
            consistent tutor, and every parent has a real person to call. No call centers. No scripts.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: Heart, title: "Personal attention", body: "One tutor. One student. A real relationship that grows session after session." },
            { icon: ShieldCheck, title: "Trusted by parents", body: "Background-checked tutors, transparent communication, and parent updates included." },
            { icon: Progress, title: "Confidence + grades", body: "We don&rsquo;t just teach the material — we help students believe they can do it." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-7 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: c.body }} />
            </div>
          ))}
        </div>
      </Section>

      {/* WHY PARENTS CHOOSE */}
      <Section className="bg-secondary/40">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 rounded-[2rem] bg-blush/40 blur-2xl" aria-hidden />
            <RotatingImage
              images={[parent1, parent2, parent3]}
              alt="Students and families working at laptops"
              className="relative aspect-square w-full rounded-3xl shadow-xl"
            />
          </div>
          <div className="order-1 md:order-2">
            <img src={logoMark} alt="" aria-hidden width={790} height={790} className="pointer-events-none mb-4 h-8 w-8 opacity-90" />
            <Eyebrow>Why parents choose us</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              The opposite of a tutoring chain.
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                { t: "We learn your student", d: "Personalities, goals, and what works — we listen first." },
                { t: "Same tutor, every week", d: "Consistency builds momentum and confidence." },
                { t: "Flexible scheduling", d: "Evenings, weekends, last-minute test prep — we adapt." },
                { t: "Honest, simple pricing", d: "$70 a session. Cancel anytime. No surprise fees." },
              ].map((i) => (
                <li key={i.t} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="font-semibold">{i.t}</p>
                    <p className="text-sm text-muted-foreground">{i.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* SUBJECTS */}
      <Section>
        <div className="text-center">
          <Eyebrow>Subjects we cover</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">From elementary to AP — we&rsquo;ve got it.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Specialized in high school. Loved by every grade. K–12 and college students welcome.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Math", d: "Pre-algebra → Calculus" },
            { t: "Science", d: "Bio · Chem · Physics" },
            { t: "English", d: "Reading & writing" },
            { t: "Test Prep", d: "SAT · ACT · APs" },
            { t: "Study Skills", d: "Habits that stick" },
            { t: "Homework Help", d: "Weekly check-ins" },
            { t: "Languages", d: "Spanish · French" },
            { t: "College Support", d: "Intro courses" },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-base font-semibold">{s.t}</p>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services">See all subjects <ArrowRight className="ml-1 h-4 w-4"/></Link>
          </Button>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="bg-secondary/40">
        <div className="relative text-center">
          <img src={logoMark} alt="" aria-hidden width={790} height={790} className="pointer-events-none mx-auto mb-4 h-8 w-8 opacity-90" />
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Three simple steps.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: MessageCircleHeart, n: "01", t: "Tell us about your student", d: "Share grade, subjects, and goals — by form, text, or call." },
            { icon: Users, n: "02", t: "Meet your matched tutor", d: "We pair you with the right tutor for your student&rsquo;s style." },
            { icon: CalendarHeart, n: "03", t: "Schedule your sessions", d: "Pick weekly times that fit. Cancel or shift anytime." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-border bg-card p-7 shadow-sm">
              <span className="absolute right-6 top-6 font-display text-3xl font-semibold text-primary/15">{s.n}</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.d }} />
            </div>
          ))}
        </div>
      </Section>

      {/* PRICING */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Simple pricing</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">One price. No surprises.</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              We keep things refreshingly simple. Pay per session, see results, and only continue
              when it&rsquo;s the right fit.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "60-minute one-on-one virtual session",
                "Same tutor every week",
                "Parent updates included",
                "Cancel anytime",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary"/>{i}</li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-7 rounded-full">
              <Link to="/pricing">See pricing & FAQ</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 shadow-xl">
              <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blush/60 blur-3xl" aria-hidden />
              <div className="relative">
                <div className="flex items-center gap-2 text-primary">
                  <img src={logoMark} alt="" aria-hidden width={790} height={790} className="h-6 w-6" />
                  <span className="text-xs font-medium uppercase tracking-widest">Per Session</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-7xl font-semibold tracking-tight">$70</span>
                  <span className="text-muted-foreground">/ 60 min</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Same price for every grade and subject.</p>
                <div className="mt-7 grid gap-2.5">
                  <Button asChild size="lg" className="w-full rounded-full">
                    <Link to="/contact">Book a Session</Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost" className="w-full rounded-full">
                    <Link to="/portal">Existing students: Sign in</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-secondary/40">
        <div className="relative text-center">
          <img src={logoMark} alt="" aria-hidden width={790} height={790} className="pointer-events-none mx-auto mb-4 h-8 w-8 opacity-90" />
          <Eyebrow>Parent stories</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Loved by families nationwide.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Kelly C.",
              role: "Parent · 7th grade math",
              body: "My Daughter started 7th grade Excel math this year. Within the first couple of weeks, she had such a bad panic attack over a test I had to pick her up from school. So I went online and read so many reviews and reached out to friends for recommendations. Something about From the Heart seemed like it could be a good match so I reached out. Best decision ever. Beth guided me through everything. Listened to my story and we did our first session with Evan and we were hooked. He was so amazing with my daughter. Knew all of the math. Helped her to figure out what her math teacher wanted at times and was patient and so KIND! Madison took to him so well. Her confidence in math has skyrocketed. She got straight A's and has a 97 in math. And the cherry on top she took the 8th-grade star test since she is in Excel 7th-grade math and came home saying it was easy! Can't wait to work with Evan next year and any other years he is willing to assist us. Bravo Evan.",
              featured: true,
            },
            {
              name: "Maerie A.",
              role: "Parent · Homework support",
              body: "Thank you!!! We finished homework this weekend with ZERO fights or breakdowns!!! You (Beth) are great at breaking it down for my son to understand it.",
            },
            {
              name: "K. Fulkes.",
              role: "Parent · Summer math",
              body: "My son likes Sam. He wasn't excited that I signed him up for Math in the Summer. However, they bonded over an Xbox video game so that opened his mind a bit. He said Sam explains things better than his 6th grade teacher ever did.",
            },
            {
              name: "A. Garcia.",
              role: "Parent · Dysgraphia support",
              body: "I just wanted to let you know that we loved our new tutor Jason! He is very knowledgeable about dysgraphia and had some great ideas and tips moving forward. He really connected with Jason.",
            },
            {
              name: "Diana L.",
              role: "Parent · Test confidence",
              body: "Hi! Just wanted to send you a quick message to let you know that Evan got it out of the park with Leo last night. Leo says Evan is a genius and he felt so much more confident with the material. Thank you so much for making that happen! Cheers!",
            },
            {
              name: "Holly Danko.",
              role: "Parent · Ongoing tutoring",
              body: "Dianne has been an absolutely wonderful tutor and Marissa has been doing so well with all of Dianne's efforts. We plan to continue tutoring once she returns to school in the fall. This has been a very positive experience and we are grateful for your services!",
            },
            {
              name: "Melanie Skipper-Relyea.",
              role: "Parent · SAT math",
              body: "BETH!!!!!!! Gabe's SAT Math score is a 510!!! Up from 370!!!! Total score 1100!!!!!!",
            },
            {
              name: "Michelle W.",
              role: "Parent · 7th and 9th grade",
              body: "Both my kids (7th grade and 9th grade) were tutored in Math last summer by Evan. I really appreciated Beth's flexibility on working with our summer schedule. Both my kids enjoyed their sessions with Evan and said they felt well-prepared when they started the school year.",
            },
            {
              name: "Ruth G.",
              role: "Parent · Geometry prep",
              body: "Julia has really enjoyed tutoring with Dianne. She's a fantastic tutor. Dianne is attentive and patient and Julia values her time with her. We look forward to starting again next school year for geometry. I have recommended Dianne and From the Heart tutoring to my friends.",
            },
            {
              name: "Anonymous.",
              role: "Parent · 3rd grade math",
              body: "Beth is a great teacher helping my son with his 3rd-grade math. Very patient and explains well. My son prefers her helping him to me! On-time and with no issues.",
            },
            {
              name: "Ana.",
              role: "Student · College Certification exam",
              body: "Beth! This is Ana! I passed my certification exam! Thanks so much for your help and guidance. You're wonderful! Have an amazing weekend!",
            },
            {
              name: "Ndeye T.",
              role: "Parent · Student confidence",
              body: "I have never seen him excited about a class with anyone else before, so you [Evan] know how to get to him and thanks for that!",
            },
          ].map((t) => (
            <figure
              key={t.name}
              className={`flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm ${t.featured ? "md:col-span-3" : ""}`}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.body}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 font-sans">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary to-warm px-6 py-14 text-primary-foreground shadow-xl md:px-14 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
                Let&rsquo;s give your student the support they deserve.
              </h2>
              <p className="mt-4 max-w-xl text-primary-foreground/85 md:text-lg">
                It starts with one conversation. We&rsquo;ll match your student with the right tutor — usually the same week.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-7">
                <Link to="/contact">Book a Session</Link>
              </Button>
              <Link to="/about" className="text-sm font-medium text-primary-foreground/85 underline-offset-4 hover:underline">
                Learn more about us →
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
