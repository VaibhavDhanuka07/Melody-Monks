"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const buildRedirectUrl = (path = "/dashboard") => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL;
    return origin ? `${origin}${path}` : undefined;
  };

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
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
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: buildRedirectUrl("/login"),
      },
    });

    if (authError) {
      setError(authError.message);
      setStatus("idle");
      return;
    }

    if (data.session) {
      setMessage("Account created. Redirecting to your dashboard...");
      window.location.href = "/dashboard";
      return;
    }

    setMessage("Check your email for a confirmation link to complete signup.");
    setStatus("idle");
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleEmailSignup}>
        <div>
          <label className="text-xs font-semibold text-ink">Full name</label>
          <input
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
          />
        </div>
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
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
          />
        </div>
        <button className="btn-primary w-full" disabled={status === "loading"}>
          {status === "loading" ? "Creating..." : "Create Account"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-200">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-ink-muted">{message}</p> : null}
      <p className="mt-4 text-center text-xs text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-gold">
          Log in
        </Link>
        .
      </p>
    </>
  );
}
