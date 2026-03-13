import Image from "next/image";
import Link from "next/link";
import { coursePaths, pricingPlans, site } from "@/data/site";
import { completeMusicProgram, curriculumCourses } from "@/data/universal-curriculum";
import { curriculumSummary } from "@/data/curriculum";

export default function CoursesPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Courses</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              {site.programName}
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              A structured 12-week Indian music curriculum with{" "}
              {curriculumSummary.lessons} lessons, performance feedback, and
              certification.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/book-trial" className="btn-primary">
                Book Free Trial
              </Link>
              <Link href="/curriculum" className="btn-secondary">
                View Curriculum
              </Link>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-ink-muted">
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Weekly guided practice and assignments
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Performance submissions with instructor feedback
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Certifications for each mastery level
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Course Catalog</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Specialized Indian music programs
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Choose from classical vocal, Bollywood, instruments, and production
              pathways.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coursePaths.map((course) => (
            <div key={course.title} className="card-strong flex flex-col gap-4 p-6">
              <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/75" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-brand-gold/30 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
                    {course.format}
                  </span>
                  {course.duration ? (
                    <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
                      {course.duration}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="min-h-[3.5rem] text-xl font-semibold leading-tight text-ink">
                  {course.title}
                </h3>
                <p className="text-sm text-ink-muted">{course.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {course.modules} modules
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {course.lessons} lessons
                </span>
                {course.level ? (
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {course.level}
                  </span>
                ) : null}
              </div>
              <ul className="space-y-2 text-sm text-ink-muted">
                {course.topics.map((topic) => (
                  <li key={topic}>- {topic}</li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <Link
                  href={course.slug ? `/courses/${course.slug}` : "/curriculum"}
                  className="btn-secondary w-full sm:w-auto"
                >
                  View Curriculum
                </Link>
                <Link href="/book-trial" className="btn-primary w-full sm:w-auto">
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Curriculum Paths</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              12-week learning tracks by instrument
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Every curriculum includes 4 lessons per week, practice exercises,
              and assignments.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {curriculumCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="card-strong flex flex-col gap-4 p-6 transition hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={course.image}
                  alt={course.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-brand-gold/30 bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
                  12-week path
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                  {course.level}
                </p>
                <h3 className="mt-2 min-h-[3.5rem] text-xl font-semibold leading-tight text-ink">
                  {course.name}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {course.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  12 weeks
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  48 lessons
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Assignments
                </span>
              </div>
              <span className="btn-secondary mt-auto w-fit px-4 py-2 text-xs">
                View Curriculum
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Plans</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Choose the right plan for your journey
            </h2>
          </div>
          <span className="text-xs text-ink-muted">
            Payments via Stripe or Razorpay
          </span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`card-strong flex flex-col gap-4 p-6 ${
                plan.highlighted ? "border-brand-gold/60" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-ink">{plan.name}</p>
                {plan.highlighted ? (
                  <span className="rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                    Most Popular
                  </span>
                ) : null}
              </div>
              <div>
                <p className="text-2xl font-semibold text-ink">{plan.price}</p>
                <p className="text-xs text-ink-muted">{plan.cadence}</p>
              </div>
              <p className="text-sm text-ink-muted">{plan.description}</p>
              <ul className="space-y-2 text-sm text-ink-muted">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <Link href="/book-trial" className="btn-primary mt-auto">
                Enroll Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Complete Program</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              {completeMusicProgram.title}
            </h2>
            <p className="mt-4 text-sm text-ink-muted">
              {completeMusicProgram.description}
            </p>
          </div>
          <div className="grid gap-4 text-sm text-ink-muted">
            {completeMusicProgram.years.map((year) => (
              <div
                key={year.title}
                className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4"
              >
                <p className="text-sm font-semibold text-ink">{year.title}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  {year.focus.join(" | ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
