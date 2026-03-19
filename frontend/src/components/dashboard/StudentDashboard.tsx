"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import ProgressStats from "@/components/ai/ProgressStats";
import { site } from "@/data/site";

const supabaseReady = Boolean(supabase);

export default function StudentDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseReady) {
      setLoading(false);
      return;
    }
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!supabaseReady) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        Configure `NEXT_PUBLIC_SUPABASE_URL` and
        `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable secure login.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        Loading dashboard...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        Please log in to access your dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Welcome back, {session.user.email}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Track your progress, lessons, practice, and upcoming live sessions on{" "}
          {site.liveClassPlatforms}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Course progress", value: "42%" },
          { label: "Next lesson", value: "Raag Yaman - Bandish" },
          { label: "Practice time", value: "2h this week" },
          { label: "Upcoming live class", value: "Sat 6:00 PM | Zoom" },
        ].map((item) => (
          <div key={item.label} className="card p-6">
            <p className="text-sm text-ink-muted">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">My Courses</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">
              Indian Music Mastery Program - 42% complete
            </div>
            <div className="card px-4 py-3">
              Bollywood Singing - 18% complete
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <p className="text-sm font-semibold text-ink">Quick Actions</p>
            <div className="mt-4 space-y-3 text-sm text-ink-muted">
              <Link href="/dashboard/lessons" className="card block px-4 py-3">
                Continue next lesson
              </Link>
              <Link
                href="/dashboard/live-classes"
                className="card block px-4 py-3"
              >
                Join upcoming Zoom / Meet class
              </Link>
              <Link href="/dashboard/practice" className="card block px-4 py-3">
                Log practice session
              </Link>
              <Link href="/dashboard/tools" className="card block px-4 py-3">
                Open practice tools
              </Link>
              <Link href="/dashboard/ai-practice" className="card block px-4 py-3">
                Open AI practice assistant
              </Link>
              <Link
                href="/dashboard/practice-plan"
                className="card block px-4 py-3"
              >
                Open AI practice planner
              </Link>
              <Link
                href="/dashboard/performance-upload"
                className="card block px-4 py-3"
              >
                Upload performance
              </Link>
            </div>
          </div>
          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-brand-gold">
              Practice Plan
            </p>
            <h3 className="mt-3 text-xl font-semibold text-ink">
              Today&apos;s practice routine
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>- Warmup · 5 min</li>
              <li>- Technique exercises · 10 min</li>
              <li>- Lesson practice · 10 min</li>
              <li>- Song practice · 15 min</li>
              <li>- Improvisation · 5 min</li>
            </ul>
            <Link href="/dashboard/practice-plan" className="btn-secondary mt-5">
              View Practice Plan
            </Link>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-strong p-6">
          <p className="text-sm font-semibold text-brand-gold">
            AI Music Practice Assistant
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-ink">
            Plan, analyze, and improve daily
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Generate daily practice plans, get feedback, and track your pitch
            accuracy in one place.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
            {[
              "Daily plans",
              "Pitch analysis",
              "Exercise generator",
              "AI coach chat",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
          <Link href="/dashboard/ai-practice" className="btn-primary mt-6">
            Open AI Practice
          </Link>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Latest AI insights</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
              Focus on sur stability using a tanpura drone.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
              Increase metronome tempo by 5 BPM every 3 days.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3">
              Record a 60-second performance clip for review.
            </div>
          </div>
        </div>
      </div>

      <ProgressStats />

      <div className="card p-6">
        <p className="text-sm font-semibold text-ink">Practice Analytics</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { label: "Weekly hours", value: "4.2" },
            { label: "Accuracy", value: "92%" },
            { label: "Streak", value: "9 days" },
          ].map((item) => (
            <div key={item.label} className="card px-4 py-3 text-sm text-ink-muted">
              <p className="text-xs uppercase tracking-wide">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
