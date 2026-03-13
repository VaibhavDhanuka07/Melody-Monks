import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";
import RaagPracticeTool from "@/components/tools/RaagPracticeTool";

const ScaleTrainer = dynamic(() => import("@/components/practice/ScaleTrainer"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading scale trainer...</div>,
});
const Metronome = dynamic(() => import("@/components/practice/Metronome"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading metronome...</div>,
});

export const metadata = {
  title: "Harmonium Tools",
  description: "Harmonium scales, raag practice, and tempo tools.",
};

const harmoniumTools = [
  {
    id: "harmonium-scale",
    name: "Scale Trainer",
    description: "Practice harmonium scales with tempo.",
    toolType: "Practice",
    href: "/practice/scale-trainer",
  },
  {
    id: "harmonium-raag",
    name: "Raag Practice Tool",
    description: "Generate raag phrases for riyaz.",
    toolType: "Raag",
    href: "/tools/harmonium#raag",
  },
  {
    id: "harmonium-metronome",
    name: "Metronome",
    description: "Stay in time with adjustable BPM.",
    toolType: "Timing",
    href: "/practice/metronome",
  },
];

export default function HarmoniumToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Harmonium Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Harmonium practice suite
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Build scale fluency and raag confidence with guided tools.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={harmoniumTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <ScaleTrainer />
        <Metronome />
        <div id="raag">
          <RaagPracticeTool />
        </div>
      </section>
    </div>
  );
}
