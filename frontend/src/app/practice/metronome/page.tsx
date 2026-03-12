import dynamic from "next/dynamic";

const Metronome = dynamic(() => import("@/components/practice/Metronome"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading metronome...
    </div>
  ),
});

export const metadata = {
  title: "Metronome",
  description: "Online metronome with adjustable BPM and visual beat.",
};

export default function MetronomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold-soft">Practice Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Online Metronome</h1>
        <p className="mt-3 text-ink-muted">
          Keep steady tempo with adjustable BPM and audio click.
        </p>
      </div>
      <Metronome />
    </div>
  );
}

