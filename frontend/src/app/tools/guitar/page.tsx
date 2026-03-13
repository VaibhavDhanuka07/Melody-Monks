import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";
import StrummingTrainer from "@/components/tools/StrummingTrainer";

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading guitar tuner...</div>,
});
const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading scale trainer...</div>,
});

export const metadata = {
  title: "Guitar Tools",
  description: "Guitar chord finder, tuner, and strumming practice.",
};

const guitarTools = [
  {
    id: "guitar-chord",
    name: "Chord Finder",
    description: "Browse chord shapes and progressions.",
    toolType: "Reference",
    href: "/guitar-chord-chart",
  },
  {
    id: "guitar-tuner",
    name: "Guitar Tuner",
    description: "Tune strings with live pitch detection.",
    toolType: "Tuning",
    href: "/tools/pitch-training",
  },
  {
    id: "guitar-strum",
    name: "Strumming Trainer",
    description: "Lock in down-up rhythm patterns.",
    toolType: "Practice",
    href: "/tools/guitar#strumming",
  },
  {
    id: "guitar-scale",
    name: "Scale Trainer",
    description: "Practice scales with tempo guidance.",
    toolType: "Practice",
    href: "/practice/scale-trainer",
  },
];

export default function GuitarToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Guitar Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Guitar practice toolkit
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Tune, strum, and sharpen your chord transitions with guided tools.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={guitarTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <PitchDetector
          label="Guitar Tuner"
          title="Tune your strings"
          description="Use live pitch detection to align each string."
          reference="Reference: Standard tuning E2 A2 D3 G3 B3 E4."
        />
        <div id="strumming">
          <StrummingTrainer />
        </div>
        <ScaleTrainer />
      </section>
    </div>
  );
}
