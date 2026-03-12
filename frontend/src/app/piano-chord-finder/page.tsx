import Link from "next/link";

export const metadata = {
  title: "Piano Chord Finder",
  description:
    "Find piano chords quickly with voicing tips, progressions, and practice guidance.",
};

export default function PianoChordFinderPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand-gold">SEO Tool</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Piano Chord Finder
          </h1>
          <p className="mt-3 text-ink-muted">
            Explore essential piano chords, learn fingerings, and build smoother
            progressions.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold text-ink">Popular Chords</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { chord: "C Major", notes: "C - E - G" },
              { chord: "D Minor", notes: "D - F - A" },
              { chord: "E Minor", notes: "E - G - B" },
              { chord: "F Major", notes: "F - A - C" },
              { chord: "G Major", notes: "G - B - D" },
              { chord: "A Minor", notes: "A - C - E" },
            ].map((item) => (
              <div
                key={item.chord}
                className="card px-4 py-3"
              >
                <p className="text-sm font-semibold text-ink">{item.chord}</p>
                <p className="text-xs text-ink-muted">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-ink">How to use</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>- Pick a chord from the list.</li>
              <li>- Practice the notes with the piano keyboard tool.</li>
              <li>- Move through chord progressions to build muscle memory.</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-ink">Next step</h3>
            <p className="mt-3 text-sm text-ink-muted">
              Try the interactive chord trainer for real-time audio feedback.
            </p>
            <Link
              href="/practice/chord-trainer"
              className="btn-primary mt-4"
            >
              Open Chord Trainer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


