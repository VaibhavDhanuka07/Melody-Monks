"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

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
          Track your progress, lessons, and practice.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Course progress", value: "42%" },
          { label: "Next lesson", value: "Improvisation Basics" },
          { label: "Practice time", value: "2h this week" },
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
              Piano Mastery Program - 42% complete
            </div>
            <div className="card px-4 py-3">Technique Lab - 18% complete</div>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Quick Actions</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <Link href="/dashboard/lessons" className="card px-4 py-3">
              Continue next lesson
            </Link>
            <Link href="/dashboard/practice" className="card px-4 py-3">
              Log practice session
            </Link>
            <Link href="/dashboard/performance-upload" className="card px-4 py-3">
              Upload performance
            </Link>
          </div>
        </div>
      </div>

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
