"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { supabase } from "@/lib/supabase/client";

type PlanBlock = {
  id: string;
  title: string;
  minutes: number;
  description: string;
};

type PracticePlan = {
  instrument: string;
  duration: number;
  progress: number;
  blocks: PlanBlock[];
};

type PracticeSession = {
  duration?: number | null;
  date?: string | null;
};

const instruments = [
  "Singing",
  "Piano",
  "Guitar",
  "Drums",
  "Violin",
  "Flute",
  "Trumpet",
  "Harmonium",
  "Tabla",
];

const blockOrder: Array<PlanBlock["id"]> = [
  "warmup",
  "technique",
  "lesson",
  "song",
  "improvisation",
];

const blockTitles: Record<string, string> = {
  warmup: "Warmup",
  technique: "Technique exercises",
  lesson: "Lesson practice",
  song: "Song practice",
  improvisation: "Improvisation",
};

const instrumentTips: Record<string, Record<string, string>> = {
  Singing: {
    warmup: "Breath control + humming drills",
    technique: "Sargam & alankar repetitions",
    lesson: "Core raag phrases + clarity",
    song: "Bollywood song phrasing",
    improvisation: "Simple alaap explorations",
  },
  Piano: {
    warmup: "Finger stretches + scales",
    technique: "Hanon drills + chord transitions",
    lesson: "Lesson drills + left-hand focus",
    song: "Song voicing practice",
    improvisation: "Pentatonic improvisation",
  },
  Guitar: {
    warmup: "Finger stretches + chromatic run",
    technique: "Chord changes + strumming",
    lesson: "Lesson riffs + rhythm focus",
    song: "Bollywood song practice",
    improvisation: "Scale-based improvisation",
  },
  Drums: {
    warmup: "Stick control exercises",
    technique: "Rudiments + coordination",
    lesson: "Groove drills",
    song: "Play-along practice",
    improvisation: "Fill experiments",
  },
  Violin: {
    warmup: "Long tones + bowing",
    technique: "Intonation + scale drills",
    lesson: "Lesson phrases + timing",
    song: "Melody practice",
    improvisation: "Simple variations",
  },
  Flute: {
    warmup: "Breath control + tone",
    technique: "Scale drills + articulation",
    lesson: "Lesson melodies",
    song: "Song practice",
    improvisation: "Melodic improvisation",
  },
  Trumpet: {
    warmup: "Embouchure + long tones",
    technique: "Range building drills",
    lesson: "Lesson phrases",
    song: "Melody practice",
    improvisation: "Short improvisations",
  },
  Harmonium: {
    warmup: "Bellows control + scales",
    technique: "Chord transitions",
    lesson: "Lesson patterns",
    song: "Song accompaniment",
    improvisation: "Raag variations",
  },
  Tabla: {
    warmup: "Finger drills + bols",
    technique: "Theka patterns",
    lesson: "Lesson compositions",
    song: "Accompaniment practice",
    improvisation: "Layakari exploration",
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const roundToNearest = (value: number, step: number) =>
  Math.round(value / step) * step;

const getInstrumentSlug = (instrument: string) =>
  instrument.toLowerCase().replace(/\s+/g, "-");

const buildPlan = (
  instrument: string,
  progress: number,
  duration: number
): PracticePlan => {
  const base: Record<PlanBlock["id"], number> = {
    warmup: 0.15,
    technique: 0.2,
    lesson: 0.25,
    song: 0.25,
    improvisation: 0.15,
  };

  if (progress < 40) {
    base.lesson += 0.05;
    base.improvisation -= 0.05;
  } else if (progress > 70) {
    base.song += 0.05;
    base.technique -= 0.05;
  }

  const minutes: Record<PlanBlock["id"], number> = {
    warmup: 0,
    technique: 0,
    lesson: 0,
    song: 0,
    improvisation: 0,
  };
  let allocated = 0;
  blockOrder.forEach((block, index) => {
    if (index === blockOrder.length - 1) return;
    const blockMinutes = clamp(
      Math.round(duration * base[block]),
      4,
      duration
    );
    minutes[block] = blockMinutes;
    allocated += blockMinutes;
  });
  minutes.improvisation = Math.max(4, duration - allocated);

  const tips = instrumentTips[instrument] ?? instrumentTips.Singing;
  const blocks = blockOrder.map((block) => ({
    id: block,
    title: blockTitles[block],
    minutes: minutes[block],
    description: tips[block] ?? "Focus practice",
  }));

  return {
    instrument,
    duration,
    progress,
    blocks,
  };
};

export default function PracticePlanner() {
  const today = new Date().toISOString().slice(0, 10);
  const [instrument, setInstrument] = useState("Singing");
  const [duration, setDuration] = useState(45);
  const [progress, setProgress] = useState(0);
  const [historyAverage, setHistoryAverage] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
  }, []);

  useEffect(() => {
    const key = `practice-plan-${getInstrumentSlug(instrument)}-${today}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      setCompleted({});
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setCompleted(parsed);
    } catch {
      setCompleted({});
    }
  }, [instrument, today]);

  useEffect(() => {
    const key = `practice-plan-${getInstrumentSlug(instrument)}-${today}`;
    localStorage.setItem(key, JSON.stringify(completed));
  }, [completed, instrument, today]);

  useEffect(() => {
    const key = `lesson-progress-${getInstrumentSlug(instrument)}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      setProgress(0);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Record<
        string,
        { completed?: boolean }
      >;
      const total = Object.keys(parsed).length;
      const completedCount = Object.values(parsed).filter(
        (value) => value.completed
      ).length;
      setProgress(total ? Math.round((completedCount / total) * 100) : 0);
    } catch {
      setProgress(0);
    }
  }, [instrument]);

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryAverage(null);
      try {
        const response = await apiFetch("/api/practice-sessions", {
          query: {
            userId: userId || undefined,
            limit: 100,
          },
          auth: true,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { sessions: PracticeSession[] };
        const recent = data.sessions.filter((session) => {
          if (!session.date) return false;
          const date = new Date(session.date);
          const diff = Date.now() - date.getTime();
          return diff <= 7 * 24 * 60 * 60 * 1000;
        });
        const durations = recent
          .map((session) => session.duration || 0)
          .filter((value) => value > 0);
        if (!durations.length) return;
        const average =
          durations.reduce((sum, value) => sum + value, 0) / durations.length;
        setHistoryAverage(average);
      } catch {
        // ignore
      }
    };
    loadHistory();
  }, [userId]);

  useEffect(() => {
    if (!historyAverage) return;
    setDuration((current) => {
      if (current !== 45) return current;
      return clamp(roundToNearest(historyAverage, 5), 20, 90);
    });
  }, [historyAverage]);

  const plan = useMemo(
    () => buildPlan(instrument, progress, duration),
    [instrument, progress, duration]
  );

  const toggleCompleted = useCallback((blockId: string) => {
    setCompleted((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  }, []);

  const completedCount = plan.blocks.filter((block) => completed[block.id]).length;

  const savePlan = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        userId,
        instrument,
        date: today,
        planData: {
          ...plan,
          completed,
        },
      };
      const response = await apiFetch("/api/practice-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        auth: true,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Unable to save practice plan.");
      }
      setMessage("Practice plan saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save plan."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Practice Planner</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          AI Practice Planner
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Personalized daily routines based on your instrument, progress, and
          practice history.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-strong p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                Plan Settings
              </p>
              <select
                value={instrument}
                onChange={(event) => setInstrument(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-ink"
              >
                {instruments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-ink-muted">
              Course progress: {progress}%
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Available time
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <input
                type="range"
                min={20}
                max={90}
                step={5}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                className="w-full"
              />
              <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-ink-muted">
                {duration} min
              </span>
              {historyAverage ? (
                <span className="text-xs text-ink-muted">
                  Avg practice: {Math.round(historyAverage)} min
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              Today&apos;s Practice Plan
            </p>
            <div className="mt-4 space-y-3">
              {plan.blocks.map((block) => (
                <label
                  key={block.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink-muted"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {block.title}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {block.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-muted">
                      {block.minutes} min
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(completed[block.id])}
                      onChange={() => toggleCompleted(block.id)}
                      className="h-4 w-4 accent-brand-gold"
                    />
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
              <span>
                Completed: {completedCount} / {plan.blocks.length}
              </span>
              <button
                type="button"
                onClick={savePlan}
                className="btn-secondary px-4 py-2 text-xs"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Plan"}
              </button>
            </div>
            {message ? (
              <p className="mt-3 text-xs text-emerald-300">{message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-ink">Plan Insights</p>
            <div className="mt-4 space-y-3 text-sm text-ink-muted">
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                Focus emphasis:{" "}
                {progress < 40
                  ? "Lesson mastery & technique"
                  : progress > 70
                    ? "Song performance & improvisation"
                    : "Balanced practice"}
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                Total time: {duration} minutes
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
                Suggested next step: Record a short performance clip after the
                plan.
              </div>
            </div>
          </div>

          <div className="card p-6 text-sm text-ink-muted">
            Tip: Keep a daily log of your practice to unlock better AI
            recommendations.
          </div>
        </div>
      </div>
    </div>
  );
}
