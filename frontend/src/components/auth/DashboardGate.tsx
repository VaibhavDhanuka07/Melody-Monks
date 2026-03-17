"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { isUserApproved } from "@/lib/supabase/approval";

type GateState = "loading" | "ready";

export default function DashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    if (!supabase) {
      setState("ready");
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setState("ready");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setState("ready");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!supabase) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="card p-6 text-sm text-ink-muted">
          Configure `NEXT_PUBLIC_SUPABASE_URL` and
          `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable the dashboard.
        </div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="card p-6 text-sm text-ink-muted">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="card p-6 text-sm text-ink-muted">
          <p className="text-sm font-semibold text-ink">
            Please log in to access the dashboard.
          </p>
          <Link href="/login" className="btn-secondary mt-4">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!isUserApproved(session.user)) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="card p-6 text-sm text-ink-muted">
          <p className="text-sm font-semibold text-ink">
            Your account is awaiting admin approval.
          </p>
          <p className="mt-2">
            Once approved, the dashboard will appear in the navigation.
          </p>
          <Link href="/contact" className="btn-secondary mt-4">
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
