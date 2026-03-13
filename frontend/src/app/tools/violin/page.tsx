import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading violin tuner...</div>,
});
const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading scale trainer...</div>,
});

export const metadata = {
  title: "Violin Tools",
  description: "Tuning, scales, and pitch training for violin.",
};

const violinTools = [
  {
    id: "violin-tuner",
    name: "Violin Tuner",
    description: "Tune your violin with live pitch detection.",
    toolType: "Tuning",
    href: "/tools/pitch-training",
  },
  {
    id: "violin-scale",
    name: "Scale Trainer",
    description: "Practice scales with tempo guidance.",
    toolType: "Practice",
    href: "/practice/scale-trainer",
  },
  {
    id: "violin-pitch",
    name: "Pitch Trainer",
    description: "Train pitch accuracy in real time.",
    toolType: "AI Tool",
    href: "/tools/pitch-training",
  },
];

export default function ViolinToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Violin Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Violin tuning and pitch tools
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Stabilize intonation with tuner, pitch trainer, and scale practice.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={violinTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <PitchDetector
          label="Violin Tuner"
          title="Refine intonation"
          description="Track pitch stability while practicing scales."
          reference="Reference: Standard tuning G3 D4 A4 E5."
        />
        <ScaleTrainer />
      </section>
    </div>
  );
}
