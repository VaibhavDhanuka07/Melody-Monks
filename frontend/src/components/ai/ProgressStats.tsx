"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type PracticeSession = {
  id: string;
  practiceType?: string;
  duration?: number;
  date?: string;
  createdAt?: string;
};

const sampleSessions: PracticeSession[] = [
  { id: "sample-1", practiceType: "Vocal", duration: 25, date: "2026-02-20" },
  { id: "sample-2", practiceType: "Vocal", duration: 35, date: "2026-02-21" },
  { id: "sample-3", practiceType: "Tabla", duration: 20, date: "2026-02-22" },
  { id: "sample-4", practiceType: "Piano", duration: 30, date: "2026-02-23" },
];

const getWeekSessions = (sessions: PracticeSession[]) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  return sessions.filter((session) => {
    const value = session.date || session.createdAt;
    if (!value) return false;
    const sessionDate = new Date(value);
    return sessionDate >= sevenDaysAgo && sessionDate <= now;
  });
};

const getStreak = (sessions: PracticeSession[]) => {
  const uniqueDays = new Set(
    sessions
      .filter((session) => session.date || session.createdAt)
      .map((session) =>
        new Date((session.date || session.createdAt) as string).toDateString()
      )
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    if (uniqueDays.has(day.toDateString())) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
};

export default function ProgressStats() {
  const [sessions, setSessions] = useState<PracticeSession[]>(sampleSessions);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiFetch("/api/practice-sessions", {
          query: { limit: 100 },
          auth: true,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { sessions: PracticeSession[] };
        if (Array.isArray(data.sessions) && data.sessions.length > 0) {
          setSessions(data.sessions);
        }
      } catch {
        // fallback to sample data
      }
    };
    load();
  }, []);

  const weekSessions = useMemo(() => getWeekSessions(sessions), [sessions]);
  const totalMinutes = weekSessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );
  const streak = getStreak(sessions);
  const focus =
    sessions.length > 0
      ? sessions[0].practiceType || "Vocal"
      : "Vocal";

  return (
    <div className="card-strong p-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Progress Stats</p>
        <h3 className="mt-2 text-2xl font-semibold text-ink">
          Weekly practice overview
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          Track total minutes, streaks, and focus area.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
          <p className="text-xs text-ink-muted">Weekly minutes</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{totalMinutes}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
          <p className="text-xs text-ink-muted">Current streak</p>
          <p className="mt-2 text-2xl font-semibold text-ink">
            {streak} days
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
          <p className="text-xs text-ink-muted">Focus</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{focus}</p>
        </div>
      </div>
    </div>
  );
}
