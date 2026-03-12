import dynamic from "next/dynamic";

const EarTraining = dynamic(() => import("@/components/practice/EarTraining"), {
  ssr: false,
  loading: () => (
    <div className="card p-6">
      Loading ear training...
    </div>
  ),
});

export const metadata = {
  title: "Ear Training",
  description: "Train intervals and pitch recognition with interactive drills.",
};

export default function EarTrainingPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Practice Tool</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Ear Training</h1>
        <p className="mt-3 text-ink-muted">
          Build pitch recognition through guided listening exercises.
        </p>
      </div>
      <EarTraining />
    </div>
  );
}

