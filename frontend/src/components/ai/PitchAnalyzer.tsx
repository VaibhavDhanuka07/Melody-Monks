"use client";

import dynamic from "next/dynamic";

const PitchDetector = dynamic(() => import("@/components/practice/PitchDetector"), {
  ssr: false,
  loading: () => <div className="card p-6">Loading pitch analyzer...</div>,
});

export default function PitchAnalyzer() {
  return (
    <div className="space-y-4">
      <PitchDetector
        label="Pitch Analyzer"
        title="Real-time pitch detection for singers"
        description="Track sur accuracy with live microphone feedback."
        reference="Reference: A4 = 440 Hz, Sa (C4) = 261 Hz."
      />
      <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-ink-muted">
        Tip: Use a tanpura drone and keep your pitch steady for 4 beats.
      </div>
    </div>
  );
}
