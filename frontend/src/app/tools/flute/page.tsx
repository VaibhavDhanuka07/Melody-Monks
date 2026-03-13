import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";
import BreathingTrainer from "@/components/tools/BreathingTrainer";

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading pitch trainer...</div>,
});
const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading scale trainer...</div>,
});

export const metadata = {
  title: "Flute Tools",
  description: "Breathing, pitch training, and scale practice for flute.",
};

const fluteTools = [
  {
    id: "flute-breathing",
    name: "Breathing Trainer",
    description: "Build breath control for sustained notes.",
    toolType: "Breath",
    href: "/tools/flute#breathing",
  },
  {
    id: "flute-pitch",
    name: "Pitch Trainer",
    description: "Train pitch accuracy with live feedback.",
    toolType: "Pitch",
    href: "/tools/pitch-training",
  },
  {
    id: "flute-scale",
    name: "Scale Trainer",
    description: "Practice scales with tempo guidance.",
    toolType: "Practice",
    href: "/practice/scale-trainer",
  },
];

export default function FluteToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Flute Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Breath and pitch control
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Strengthen breath cycles, intonation, and scale fluency.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={fluteTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <div id="breathing">
          <BreathingTrainer />
        </div>
        <PitchDetector
          label="Flute Pitch Trainer"
          title="Stabilize tone"
          description="Use live pitch feedback to hold notes steadily."
        />
        <ScaleTrainer />
      </section>
    </div>
  );
}
