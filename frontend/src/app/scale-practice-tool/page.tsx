import dynamic from "next/dynamic";
import Link from "next/link";

const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading scale trainer...
    </div>
  ),
});

export const metadata = {
  title: "Scale Practice Tool",
  description: "Practice scales with tempo control and guided audio playback.",
};

export default function ScalePracticeToolPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold-soft">SEO Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Scale Practice Tool
        </h1>
        <p className="mt-3 text-ink-muted">
          Build technique and finger strength with guided scale practice.
        </p>
      </div>
      <ScaleTrainer />
      <div className="card p-6 text-sm text-ink-muted">
        Looking for feedback on accuracy? Try the AI note detection tool on the
        piano keyboard page.
        <Link
          href="/practice/piano"
          className="ml-2 font-semibold text-brand-gold"
        >
          Open Piano Tool
        </Link>
        .
      </div>
    </div>
  );
}


