import ToolsGrid from "@/components/site/ToolsGrid";
import BeatGenerator from "@/components/tools/BeatGenerator";
import PracticeTimer from "@/components/tools/PracticeTimer";
import RhythmTrainer from "@/components/tools/RhythmTrainer";

export const metadata = {
  title: "Drum Tools",
  description: "Rhythm training, beat generator, and practice timer.",
};

const drumTools = [
  {
    id: "drum-rhythm",
    name: "Rhythm Trainer",
    description: "Tap tempo and track your BPM.",
    toolType: "Rhythm",
    href: "/tools/drums#rhythm",
  },
  {
    id: "drum-beat",
    name: "Beat Generator",
    description: "Loop groove patterns for practice.",
    toolType: "Groove",
    href: "/tools/drums#beat",
  },
  {
    id: "drum-timer",
    name: "Practice Timer",
    description: "Run focused timing drills.",
    toolType: "Routine",
    href: "/tools/practice-timer",
  },
];

export default function DrumToolsPage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Drum Tools</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Rhythm and groove practice
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Build timing with rhythm trainers, beat loops, and practice timers.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={drumTools} />
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
