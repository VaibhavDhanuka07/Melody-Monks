import PracticeTimer from "@/components/tools/PracticeTimer";

export const metadata = {
  title: "Practice Timer",
  description: "Track focused riyaz sessions with interval timers.",
};

export default function PracticeTimerPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16">
      <PracticeTimer />
    </div>
  );
}
