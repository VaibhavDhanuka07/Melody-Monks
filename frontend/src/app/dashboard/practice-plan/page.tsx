import dynamic from "next/dynamic";

const PracticePlanner = dynamic(() => import("@/components/ai/PracticePlanner"), {
  ssr: false,
  loading: () => (
    <div className="card-strong p-6 text-sm text-ink-muted">
      Loading practice planner...
    </div>
  ),
});

export const metadata = {
  title: "Practice Plan",
  description: "Generate a personalized daily practice routine.",
};

export default function PracticePlanPage() {
  return <PracticePlanner />;
}
