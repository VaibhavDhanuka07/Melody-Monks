import Link from "next/link";

export const metadata = {
  title: "Guitar Chord Chart",
  description: "Essential guitar chords, progressions, and practice tips.",
};

export default function GuitarChordChartPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand-gold-soft">SEO Tool</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Guitar Chord Chart
          </h1>
          <p className="mt-3 text-ink-muted">
            Master open chords and common progressions for rhythm and lead
            guitar.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-ink">Common Progressions</h2>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <p>- I - V - vi - IV (C - G - Am - F)</p>
            <p>- vi - IV - I - V (Am - F - C - G)</p>
            <p>- I - IV - V (C - F - G)</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-ink">Practice tip</h3>
            <p className="mt-3 text-sm text-ink-muted">
              Use a metronome and switch chords every four beats to build
              precision.
            </p>
            <Link
              href="/practice/metronome"
              className="btn-secondary mt-4 px-4 py-2 text-xs"
            >
              Open Metronome
            </Link>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-ink">Need feedback?</h3>
            <p className="mt-3 text-sm text-ink-muted">
              Join a live class to review chord transitions with an instructor.
            </p>
            <Link
              href="/book-trial"
              className="btn-accent mt-4"
            >
              Book Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

