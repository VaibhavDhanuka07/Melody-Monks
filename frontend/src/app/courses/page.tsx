import Link from "next/link";
import { pricingPlans, site } from "@/data/site";
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
              A structured 12-week piano curriculum with {curriculumSummary.lessons}
              lessons, performance feedback, and certification.
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
        <div className="mt-8 grid gap-6 md:grid-cols-3">
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
    </div>
  );
}
