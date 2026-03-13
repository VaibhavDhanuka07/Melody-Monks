import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";
import RaagPracticeTool from "@/components/tools/RaagPracticeTool";

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading pitch trainer...</div>,
});

export const metadata = {
  title: "Vocal Practice Tools",
  description: "Pitch training, warmups, and raag practice for singers.",
};

const vocalTools = [
  {
    id: "vocal-pitch",
    name: "Pitch Trainer",
    description: "Real-time pitch feedback for sur accuracy.",
    toolType: "Pitch",
    href: "/tools/pitch-training",
  },
  {
    id: "vocal-warmups",
    name: "Voice Warmups",
    description: "Daily warm-up routines for stamina.",
    toolType: "Warmup",
    href: "/tools/voice-warmups",
  },
  {
    id: "vocal-raag",
    name: "Raag Practice Tool",
    description: "Generate raag phrases for riyaz.",
    toolType: "Raag",
    href: "/tools/vocal-practice#raag",
  },
];

export default function VocalPracticePage() {
  return (
    <div className="space-y-12 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Vocal Practice</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Vocal training toolkit
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Train pitch, warm up your voice, and practice raag phrases.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ToolsGrid tools={vocalTools} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 space-y-6">
        <PitchDetector
          label="Vocal Pitch Trainer"
          title="Match sur with live feedback"
          description="Sing into the mic and align to target notes."
        />
        <div id="raag">
          <RaagPracticeTool />
        </div>
      </section>
    </div>
  );
}
