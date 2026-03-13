import ReviewsCarousel from "@/components/site/ReviewsCarousel";
import { reviews } from "@/data/reviews";

const before = [
  "Unstable sur and pitch",
  "Weak taal sense and timing",
  "Low confidence in live performance",
];

const after = [
  "Accurate sur and sargam control",
  "Strong taal and layakari",
  "Confident stage performances",
];

export default function StudentSuccessPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Student Success</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              Transformation journeys in 12 weeks
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              Students progress from zero experience to expressive performances
              through the structured Indian Music Mastery Program.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-ink-muted">
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              92% report improved rhythm within 4 weeks
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              4.9 average rating across cohorts
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
              Monthly recitals and live showcases
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="card-strong p-8">
            <p className="text-sm font-semibold text-brand-gold">Before</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {before.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="card-strong p-8">
            <p className="text-sm font-semibold text-brand-gold">After 3 Months</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {after.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ReviewsCarousel reviews={reviews} />
      </section>
    </div>
  );
}
