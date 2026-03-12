import Link from "next/link";

export const metadata = {
  title: "About",
  description: "About the Melody Monks Piano Academy.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-brand-gold">About</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          A cinematic piano learning experience
        </h1>
        <p className="mt-3 text-ink-muted">
          Melody Monks Piano Academy delivers a structured 12-week curriculum with
          performance coaching, practice tracking, and certification.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-lg font-semibold text-ink">Our Mission</p>
          <p className="mt-3 text-sm text-ink-muted">
            Help students become confident pianists with a clear, premium learning
            path and expert feedback.
          </p>
        </div>
        <div className="card p-6">
          <p className="text-lg font-semibold text-ink">Our Promise</p>
          <p className="mt-3 text-sm text-ink-muted">
            Consistent coaching, cinematic lessons, and measurable progress every
            week.
          </p>
        </div>
      </div>

      <Link href="/book-trial" className="btn-primary">
        Book a Free Trial
      </Link>
    </div>
  );
}
