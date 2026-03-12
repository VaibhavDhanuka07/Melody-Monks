import dynamic from "next/dynamic";

const ChordTrainer = dynamic(() => import("@/components/practice/ChordTrainer"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading chord trainer...
    </div>
  ),
});

export const metadata = {
  title: "Chord Trainer",
  description: "Learn chord shapes and hear them instantly.",
};

export default function ChordTrainerPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-indigo">Practice Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Chord Trainer</h1>
        <p className="mt-3 text-ink-muted">
          Build chord memory with instant audio playback.
        </p>
      </div>
      <ChordTrainer />
    </div>
  );
}

