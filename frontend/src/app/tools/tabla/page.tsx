import ToolsGrid from "@/components/site/ToolsGrid";
import BeatGenerator from "@/components/tools/BeatGenerator";
import PracticeTimer from "@/components/tools/PracticeTimer";
import RhythmTrainer from "@/components/tools/RhythmTrainer";

export const metadata = {
  title: "Tabla Tools",
  description: "Taal practice, rhythm training, and beat loops.",
};

const tablaTools = [
  {
    id: "tabla-rhythm",
    name: "Rhythm Trainer",
    description: "Tap tempo and track your BPM.",
    toolType: "Rhythm",
    href: "/tools/tabla#rhythm",
  },
  {
    id: "tabla-beat",
    name: "Beat Generator",
    description: "Practice with groove patterns and taal cycles.",
    toolType: "Groove",
    href: "/tools/tabla#beat",
  },
  {
    id: "tabla-timer",
    name: "Practice Timer",
    description: "Run focused taal drills.",
    toolType: "Routine",
    href: "/tools/practice-timer",
  },
];

export default function TablaToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Tabla Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Taal and rhythm training
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Strengthen timing with rhythm trainers, beat loops, and timers.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={tablaTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <div id="rhythm">
          <RhythmTrainer />
        </div>
        <div id="beat">
          <BeatGenerator />
        </div>
        <PracticeTimer />
      </section>
    </div>
  );
}
