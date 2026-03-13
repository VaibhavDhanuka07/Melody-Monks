import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";

const PianoKeyboard = dynamic(() => import("@/components/practice/PianoKeyboard"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading virtual piano...</div>,
});
const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading scale trainer...</div>,
});
const Metronome = dynamic(() => import("@/components/practice/Metronome"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading metronome...</div>,
});
const ChordDetector = dynamic(() => import("@/components/practice/ChordDetector"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading chord detection...</div>,
});

export const metadata = {
  title: "Piano Tools",
  description: "Virtual piano, scales, chords, and tempo training.",
};

const pianoTools = [
  {
    id: "piano-virtual",
    name: "Virtual Piano",
    description: "Play notes and chords on an interactive keyboard.",
    toolType: "Interactive",
    href: "/practice/piano",
  },
  {
    id: "piano-scale",
    name: "Scale Practice Tool",
    description: "Guided scale practice with tempo control.",
    toolType: "Practice",
    href: "/practice/scale-trainer",
  },
  {
    id: "piano-chord",
    name: "Chord Finder",
    description: "Explore common chord shapes and progressions.",
    toolType: "Reference",
    href: "/piano-chord-finder",
  },
  {
    id: "piano-metronome",
    name: "Metronome",
    description: "Lock your rhythm with adjustable BPM.",
    toolType: "Timing",
    href: "/practice/metronome",
  },
];

export default function PianoToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Piano Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Piano practice suite
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Use virtual piano, chord detection, and tempo training to strengthen
            technique.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={pianoTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <PianoKeyboard />
        <div className="grid gap-6 lg:grid-cols-2">
          <ScaleTrainer />
          <Metronome />
        </div>
        <ChordDetector />
      </section>
    </div>
  );
}
