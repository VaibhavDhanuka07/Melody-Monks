import Image from "next/image";
import Link from "next/link";
import { instagramItems } from "@/data/gallery";

const courses = [
  {
    title: "Piano",
    level: "Beginner to Advanced",
    lessons: "48 Lessons",
    duration: "12 Weeks",
  },
  {
    title: "Guitar",
    level: "Beginner to Intermediate",
    lessons: "36 Lessons",
    duration: "10 Weeks",
  },
  {
    title: "Vocal",
    level: "All Levels",
    lessons: "32 Lessons",
    duration: "8 Weeks",
  },
  {
    title: "Drums",
    level: "Beginner to Advanced",
    lessons: "40 Lessons",
    duration: "12 Weeks",
  },
  {
    title: "Violin",
    level: "Beginner to Intermediate",
    lessons: "30 Lessons",
    duration: "9 Weeks",
  },
];

const steps = [
  {
    title: "Watch lessons",
    description:
      "Stream HD lessons with bite-sized exercises and instructor feedback.",
  },
  {
    title: "Practice with tools",
    description:
      "Use smart metronomes, chord trainers, and AI note detection to level up.",
  },
  {
    title: "Join live classes",
    description:
      "Schedule live sessions with global coaches and track your progress.",
  },
];

const tools = [
  { title: "Piano Keyboard Trainer", href: "/practice/piano" },
  { title: "Guitar Chord Trainer", href: "/practice/chord-trainer" },
  { title: "Scale Trainer", href: "/practice/scale-trainer" },
  { title: "Ear Training", href: "/practice/ear-training" },
  { title: "Metronome", href: "/practice/metronome" },
];

const instagramHighlights = instagramItems;

const testimonials = [
  {
    name: "Ananya R.",
    role: "Piano Student",
    rating: "5.0",
    quote:
      "The live classes feel personal and the practice tools keep me consistent. I can see progress every week.",
  },
  {
    name: "Luis M.",
    role: "Guitar Student",
    rating: "4.8",
    quote:
      "Chord trainer plus instructor feedback is a game changer. The platform feels premium and easy to use.",
  },
  {
    name: "Mei L.",
    role: "Vocal Student",
    rating: "5.0",
    quote:
      "The AI note detection helps me stay on pitch. The lessons are structured and motivating.",
  },
];

const plans = [
  {
    name: "Beginner Plan",
    price: "INR 2000/month",
    description: "Start strong with guided practice and weekly live support.",
    features: [
      "Weekly live class",
      "Practice tools access",
      "Lesson recordings",
      "Progress tracking",
    ],
    popular: false,
  },
  {
    name: "Most Popular",
    price: "INR 3500/month",
    description: "Deep coaching plus AI feedback to accelerate mastery.",
    features: [
      "Twice-weekly live classes",
      "AI note + chord feedback",
      "Personalized practice plan",
      "Priority instructor chat",
    ],
    popular: true,
  },
  {
    name: "Elite Artist",
    price: "INR 5200/month",
    description: "Performance-ready mentorship with 1:1 guidance.",
    features: [
      "1:1 monthly coaching",
      "Performance review",
      "Advanced repertoire",
      "Portfolio support",
    ],
    popular: false,
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
          <div className="space-y-8 animate-fade-up">
            <div className="badge">
              <span className="h-2 w-2 rounded-full bg-brand-amber"></span>
              Global cohort enrolment now open
            </div>
            <div className="space-y-5">
              <h1 className="text-balance text-4xl font-semibold leading-tight text-ink md:text-6xl">
                <span className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-amber bg-clip-text text-transparent">
                  Learn Piano &amp; Guitar
                </span>
                <span className="block text-ink">From Anywhere in the World</span>
              </h1>
              <p className="text-lg text-ink-muted">
                Live classes, interactive practice tools, and personalized music
                coaching.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book-trial"
                className="btn-primary"
              >
                Start Free Trial
              </Link>
              <Link
                href="/courses"
                className="btn-secondary"
              >
                Explore Courses
              </Link>
            </div>
            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              <div className="card px-4 py-3">
                <p className="text-xs font-semibold text-ink-muted">
                  Student rating
                </p>
                <p className="mt-2 text-xl font-semibold text-ink">4.9 / 5</p>
              </div>
              <div className="card px-4 py-3">
                <p className="text-xs font-semibold text-ink-muted">
                  Active learners
                </p>
                <p className="mt-2 text-xl font-semibold text-ink">500+</p>
              </div>
            </div>
          </div>

          <div
            className="relative animate-fade-in"
            style={{ animationDelay: "120ms" }}
          >
            <div className="absolute -top-10 right-6 h-32 w-32 rounded-full bg-brand-amber/30 blur-2xl"></div>
            <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-brand-indigo/20 blur-3xl"></div>
            <div className="card-strong p-6 shadow-lift">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">Live class schedule</p>
                  <span className="rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-semibold text-ink">
                    This week
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: "Piano Essentials",
                      time: "Wed, 7:00 PM IST",
                      coach: "Coach Elena",
                    },
                    {
                      title: "Guitar Rhythm Lab",
                      time: "Fri, 6:30 PM IST",
                      coach: "Coach Amir",
                    },
                    {
                      title: "Vocal Warmups",
                      time: "Sat, 5:00 PM IST",
                      coach: "Coach Lian",
                    },
                  ].map((session) => (
                    <div
                      key={session.title}
                      className="flex items-center justify-between rounded-2xl border border-stroke bg-white px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {session.title}
                        </p>
                        <p className="text-xs text-ink-muted">{session.time}</p>
                      </div>
                      <span className="text-xs font-semibold text-ink-muted">
                        {session.coach}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-amber p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/80">
                    Personalized plan
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    Practice 4x weekly to hit Level 2
                  </p>
                  <p className="mt-3 text-xs text-white/80">
                    AI feedback updates every session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card-strong relative overflow-hidden p-8">
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-brand-indigo/20 blur-2xl"></div>
            <div className="absolute bottom-6 left-6 h-24 w-24 rounded-full bg-brand-amber/20 blur-2xl"></div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-brand-indigo">
                Meet the Mentor
              </p>
              <h2 className="text-3xl font-semibold text-ink">
                Debojeet Lahiri (Musician Vasu)
              </h2>
              <p className="text-sm text-ink-muted">
                Music educator, performer, composer.
              </p>
              <div className="card px-4 py-3 text-sm text-ink-muted">
                Known for blending classical technique with modern performance,
                Debojeet guides learners through structured mastery paths with
                creative coaching.
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src="/gallery/mentor-1.svg"
                    alt="Debojeet Lahiri mentor portrait"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src="/gallery/performance-1.svg"
                    alt="Debojeet Lahiri performance"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-indigo/20 via-brand-purple/20 to-brand-amber/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xs font-semibold text-ink shadow-soft">
                    Play
                  </div>
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-ink">
                    Video highlight
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card p-8 space-y-5">
            <p className="text-sm font-semibold text-brand-purple">
              Global Instructor
            </p>
            <h3 className="text-2xl font-semibold text-ink">
              Personalized coaching for every student
            </h3>
            <p className="text-ink-muted">
              Learn from a performer and educator who has coached students
              worldwide through live sessions, performance feedback, and
              practice analytics.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/musicianvasu?igsh=MW15bWd0dDJoZWJkeQ=="
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                View Instagram
              </a>
              <Link href="/gallery" className="btn-primary">
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-indigo">
              Instruments / Courses
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Choose your instrument and skill track
            </h2>
          </div>
          <Link
            href="/courses"
            className="hidden rounded-full border border-stroke bg-white px-4 py-2 text-xs font-semibold text-ink md:inline-flex"
          >
            View All Courses
          </Link>
        </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.title}
                className="card p-6 transition hover:-translate-y-1 hover:shadow-lift"
              >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-ink">{course.title}</p>
                <span className="rounded-full bg-brand-indigo/10 px-3 py-1 text-xs font-semibold text-brand-indigo">
                  {course.level}
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-ink-muted">
                <span>{course.lessons}</span>
                <span>{course.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card grid gap-10 p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-brand-purple">
              How Learning Works
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              A guided system that keeps you progressing
            </h2>
            <p className="mt-4 text-ink-muted">
              Every student gets a personalized pathway, combining expert-led
              lessons with smart practice tools.
            </p>
            <Link
              href="/book-trial"
              className="btn-primary mt-6"
            >
              Book a trial class
            </Link>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="card flex items-start gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-indigo/10 text-sm font-semibold text-brand-indigo">
                  0{index + 1}
                </div>
                <div>
                  <p className="text-base font-semibold text-ink">{step.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-amber">
              Practice Tools Preview
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Smart tools that make practice addictive
            </h2>
          </div>
          <Link
            href="/practice"
            className="btn-secondary px-4 py-2 text-xs"
          >
            Visit practice dashboard
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="card p-5 text-sm font-semibold text-ink transition hover:-translate-y-1 hover:shadow-lift"
            >
              {tool.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-purple">
              Instagram Gallery
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Follow @musicianvasu for daily inspiration
            </h2>
            <p className="mt-2 text-ink-muted">
              Reels, performances, and teaching moments from Debojeet Lahiri.
            </p>
          </div>
          <a
            href="https://www.instagram.com/musicianvasu?igsh=MW15bWd0dDJoZWJkeQ=="
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Open Instagram
          </a>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instagramHighlights.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="card p-5 text-sm text-ink transition hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="text-xs text-ink-muted">Instagram</p>
              <p className="mt-3 font-semibold">{item.title}</p>
              <div className="mt-4 h-20 rounded-2xl bg-gradient-to-br from-brand-indigo/20 via-brand-purple/20 to-brand-amber/20"></div>
              <p className="mt-3 text-xs text-brand-indigo">Open link</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-brand-indigo">
                Student Testimonials
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">
                Loved by learners across 18 countries
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((item) => (
                <div key={item.name} className="card p-5">
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>{item.role}</span>
                    <span>{item.rating} stars</span>
                  </div>
                  <p className="mt-3 text-sm text-ink">"{item.quote}"</p>
                  <p className="mt-4 text-xs font-semibold text-ink">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="card relative flex flex-col justify-center p-8">
            <div className="absolute right-6 top-6 rounded-full bg-brand-amber/20 px-3 py-1 text-xs font-semibold text-ink">
              Video testimonial
            </div>
            <div className="flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-indigo/20 via-brand-purple/20 to-brand-amber/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink shadow-soft">
                Play
              </div>
            </div>
            <p className="mt-6 text-sm text-ink-muted">
              "Melody Monks gave me structure and confidence. I finally feel ready to
              perform."
            </p>
            <p className="mt-3 text-xs font-semibold text-ink">
              Sofia T., Violin
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="rounded-3xl bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-amber p-[1px] shadow-lift">
          <div className="rounded-3xl bg-white/90 px-8 py-10 text-center backdrop-blur">
            <p className="text-sm font-semibold text-brand-indigo">
              Free Trial Offer
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              Start Your Music Journey Today
            </h2>
            <p className="mt-3 text-ink-muted">
              Free 30-minute trial class with a coach matched to your goals.
            </p>
            <Link
              href="/book-trial"
              className="btn-primary mt-6"
            >
              Book Free Trial
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-purple">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Choose a plan that fits your rhythm
            </h2>
          </div>
          <span className="text-xs text-ink-muted">
            International payments via Stripe, India via Razorpay
          </span>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card p-6 transition hover:-translate-y-1 hover:shadow-lift ${
                plan.popular
                  ? "border-brand-indigo bg-white/90"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-ink">{plan.name}</p>
                {plan.popular && (
                  <span className="rounded-full bg-brand-indigo/10 px-3 py-1 text-xs font-semibold text-brand-indigo">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mt-4 text-2xl font-semibold text-ink">
                {plan.price}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-ink-muted">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <Link
                href="/book-trial"
                className={`mt-6 w-full ${
                  plan.popular ? "btn-primary" : "btn-secondary"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card flex flex-col items-center gap-6 px-8 py-12 text-center">
          <h2 className="text-3xl font-semibold text-ink">
            Ready to Start Learning Music?
          </h2>
          <p className="text-ink-muted">
            Join live classes, master your instrument, and get AI feedback on
            every practice session.
          </p>
          <Link
            href="/book-trial"
            className="btn-accent"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}



