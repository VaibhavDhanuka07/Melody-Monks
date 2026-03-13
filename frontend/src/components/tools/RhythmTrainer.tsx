"use client";

import { useRef, useState } from "react";

export default function RhythmTrainer() {
  const [bpm, setBpm] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const intervalsRef = useRef<number[]>([]);

  const handleTap = () => {
    const now = Date.now();
    if (lastTap) {
      const interval = now - lastTap;
      intervalsRef.current = [...intervalsRef.current.slice(-4), interval];
      const avg = intervalsRef.current.reduce((acc, value) => acc + value, 0) /
        intervalsRef.current.length;
      const nextBpm = Math.round(60000 / avg);
      setBpm(nextBpm);
    }
    setTapCount((prev) => prev + 1);
    setLastTap(now);
  };

  const handleReset = () => {
    setBpm(null);
    setTapCount(0);
    setLastTap(null);
    intervalsRef.current = [];
  };

  return (
    <div className="card-strong p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Rhythm Trainer</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Tap to find your tempo
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Tap steadily to calculate your rhythm BPM.
          </p>
        </div>
        <button type="button" onClick={handleTap} className="btn-primary">
          Tap
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
          <p className="text-xs text-ink-muted">Detected BPM</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {bpm ?? "--"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
          <p className="text-xs text-ink-muted">Tap Count</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{tapCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-4">
          <p className="text-xs text-ink-muted">Reset</p>
          <button type="button" onClick={handleReset} className="btn-secondary mt-2">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
