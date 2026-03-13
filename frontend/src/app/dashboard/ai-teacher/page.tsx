import dynamic from "next/dynamic";

const AITeacherPanel = dynamic(() => import("@/components/ai/AITeacherPanel"), {
  ssr: false,
  loading: () => (
    <div className="card-strong p-6 text-sm text-ink-muted">
      Loading AI teacher...
    </div>
  ),
});

export const metadata = {
  title: "AI Teacher",
  description: "Record practice, analyze pitch and rhythm, and get AI feedback.",
};

export default function AITeacherPage({
  searchParams,
}: {
  searchParams?: { instrument?: string; lessonId?: string };
}) {
  return (
    <AITeacherPanel
      instrument={searchParams?.instrument}
      lessonId={searchParams?.lessonId}
    />
  );
}
