import dynamic from "next/dynamic";
import Link from "next/link";

const Metronome = dynamic(() => import("@/components/practice/Metronome"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading metronome...
    </div>
  ),
});

export const metadata = {
  title: "Online Metronome",
  description: "Free online metronome with adjustable BPM and visual beat.",
};

export default function OnlineMetronomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-indigo">SEO Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Online Metronome</h1>
        <p className="mt-3 text-ink-muted">
          Keep time during practice with a clean, easy-to-use metronome.
        </p>
      </div>
      <Metronome />
      <div className="card p-6 text-sm text-ink-muted">
        Consistent timing builds confidence and reduces mistakes. Pair the
        metronome with the scale trainer for focused practice.
        <Link
          href="/practice/scale-trainer"
          className="ml-2 font-semibold text-brand-indigo"
        >
          Try Scale Trainer
        </Link>
        .
      </div>
    </div>
  );
}


