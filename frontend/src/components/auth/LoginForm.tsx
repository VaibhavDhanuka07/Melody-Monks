"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    setStatus("loading");
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setStatus("idle");
      return;
    }

    setMessage("Welcome back! Redirecting to your dashboard...");
    window.location.href = "/dashboard";
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleEmailLogin}>
        <div>
          <label className="text-xs font-semibold text-ink">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
          />
        </div>
        <button className="btn-primary w-full" disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Log In"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-ink-muted">{message}</p> : null}
      <p className="mt-4 text-center text-xs text-ink-muted">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-brand-gold">
          Create an account
        </Link>
        .
      </p>
    </>
  );
}
