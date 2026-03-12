import Link from "next/link";

const stats = [
  { label: "Practice time", value: "4h 20m", trend: "+12%" },
  { label: "Accuracy score", value: "92%", trend: "+4%" },
  { label: "Daily streak", value: "9 days", trend: "On track" },
];

const tools = [
  {
    title: "Piano Keyboard",
    description: "Interactive keys with chord demos and AI note detection.",
    href: "/practice/piano",
  },
  {
    title: "Metronome",
    description: "Custom BPM control with visual beat tracking.",
    href: "/practice/metronome",
  },
  {
    title: "Chord Trainer",
    description: "Learn and hear common progressions with smart feedback.",
    href: "/practice/chord-trainer",
  },
  {
    title: "Scale Trainer",
    description: "Practice scales with guided fingerings and tempo control.",
    href: "/practice/scale-trainer",
  },
  {
    title: "Ear Training",
    description: "Train intervals and pitch recognition with AI detection.",
    href: "/practice/ear-training",
  },
];

export const metadata = {
  title: "Practice Tools",
  description: "Practice dashboard with interactive music tools.",
};

export default function PracticePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-gold-soft">Practice Tools</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Your practice dashboard
          </h1>
          <p className="mt-3 text-ink-muted">
            Track progress, stay consistent, and jump into your favorite tools.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="btn-secondary px-4 py-2 text-xs"
        >
          View student dashboard
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card p-6"
          >
            <p className="text-sm text-ink-muted">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-gold">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="card p-6 transition hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="text-lg font-semibold text-ink">{tool.title}</p>
            <p className="mt-2 text-sm text-ink-muted">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
