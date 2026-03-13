import dynamic from "next/dynamic";

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">Loading pitch training...</div>
  ),
});

export const metadata = {
  title: "Pitch Training",
  description: "Real-time pitch detection for vocal practice.",
};

export default function PitchTrainingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Pitch Training</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Train pitch accuracy in real time
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Use the microphone to detect notes and align your sur.
        </p>
      </div>
      <PitchDetector />
    </div>
  );
}
