import dynamic from "next/dynamic";

const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading scale trainer...
    </div>
  ),
});

export const metadata = {
  title: "Scale Trainer",
  description: "Practice scales with guided tempo and audio playback.",
};

export default function ScaleTrainerPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold-soft">Practice Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Scale Trainer</h1>
        <p className="mt-3 text-ink-muted">
          Practice scales with tempo guidance and note playback.
        </p>
      </div>
      <ScaleTrainer />
    </div>
  );
}

