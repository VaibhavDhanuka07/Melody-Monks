import dynamic from "next/dynamic";

const PianoKeyboard = dynamic(() => import("@/components/practice/PianoKeyboard"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading piano keyboard...
    </div>
  ),
});

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading pitch detection...
    </div>
  ),
});

const ChordDetector = dynamic(() => import("@/components/practice/ChordDetector"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading chord detection...
    </div>
  ),
});

export const metadata = {
  title: "Piano Keyboard",
  description: "Interactive piano keyboard with AI note and chord detection.",
};

export default function PianoToolPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-indigo">Practice Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Piano Keyboard Trainer
        </h1>
        <p className="mt-3 text-ink-muted">
          Play notes, explore chords, and receive real-time AI feedback.
        </p>
      </div>

      <PianoKeyboard />
      <PitchDetector />
      <ChordDetector />
    </div>
  );
}

