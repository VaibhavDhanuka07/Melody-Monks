"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
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
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Enrolled courses", value: "3" },
          { label: "Live classes", value: "2 upcoming" },
          { label: "Practice score", value: "92%" },
        ].map((item) => (
          <div
            key={item.label}
            className="card p-6"
          >
            <p className="text-sm text-ink-muted">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Enrolled Courses</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">
              Piano Mastery - 68% complete
            </div>
            <div className="card px-4 py-3">
              Guitar Foundations - 45% complete
            </div>
            <div className="card px-4 py-3">
              Ear Training - 72% complete
            </div>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Upcoming Classes</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">
              Piano Live - Thu 7:00 PM IST
            </div>
            <div className="card px-4 py-3">
              Guitar Jam - Sat 5:00 PM IST
            </div>
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
            <div
              key={item.label}
              className="card px-4 py-3 text-sm text-ink-muted"
            >
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

