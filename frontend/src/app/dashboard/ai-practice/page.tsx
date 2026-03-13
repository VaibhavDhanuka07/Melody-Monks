import dynamic from "next/dynamic";

const PracticePlanCard = dynamic(() => import("@/components/ai/PracticePlanCard"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 text-sm text-ink-muted">Loading practice plan...</div>
  ),
});
const ExerciseGenerator = dynamic(() => import("@/components/ai/ExerciseGenerator"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 text-sm text-ink-muted">Loading exercises...</div>
  ),
});
const InstrumentPracticeFeedback = dynamic(
  () => import("@/components/ai/InstrumentPracticeFeedback"),
  {
    ssr: false,
    loading: () => (
      <div className="card p-6 text-sm text-ink-muted">Loading feedback...</div>
    ),
  }
);
const ProgressStats = dynamic(() => import("@/components/ai/ProgressStats"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 text-sm text-ink-muted">Loading progress...</div>
  ),
});
const PitchAnalyzer = dynamic(() => import("@/components/ai/PitchAnalyzer"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 text-sm text-ink-muted">Loading pitch analyzer...</div>
  ),
});
const AIChatCoach = dynamic(() => import("@/components/ai/AIChatCoach"), {
  ssr: false,
  loading: () => (
    <div className="card p-6 text-sm text-ink-muted">Loading AI coach...</div>
  ),
});

export const metadata = {
  title: "AI Music Practice Assistant",
  description:
    "Generate daily plans, analyze pitch, and get AI-powered practice feedback.",
};

export default function AiPracticePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold">AI Practice</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          AI Music Practice Assistant
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Create focused practice plans, analyze your pitch, and chat with your
          AI music coach.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PracticePlanCard />
        <ExerciseGenerator />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <InstrumentPracticeFeedback />
        <ProgressStats />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <PitchAnalyzer />
        <AIChatCoach />
      </div>
    </div>
  );
}
