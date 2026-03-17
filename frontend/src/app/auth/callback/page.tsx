"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Status = "loading" | "error";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Finishing sign-in...");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    const readParam = (key: string) =>
      searchParams.get(key) ?? hashParams.get(key);

    const errorDescription =
      readParam("error_description") ?? readParam("error");
    if (errorDescription) {
      setStatus("error");
      setMessage(decodeURIComponent(errorDescription));
      return;
    }

    const client = supabase;
    if (!client) {
      setStatus("error");
      setMessage(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    const next = readParam("next") ?? "/dashboard";
    const code = readParam("code");

    const finalize = async () => {
      try {
        if (code) {
          const { error } = await client.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }
        }

        const { data, error } = await client.auth.getSession();
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        if (!data.session) {
          setStatus("error");
          setMessage("We couldn't finish signing you in. Please try again.");
          return;
        }

        window.location.replace(next);
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "Unexpected error finishing sign-in."
        );
      }
    };

    void finalize();
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-16">
      <div className="card p-6 text-sm text-ink-muted">
        <p className="text-sm font-semibold text-ink">Signing you in</p>
        <p className="mt-3">{message}</p>
        {status === "error" ? (
          <div className="mt-4">
            <Link href="/login" className="btn-secondary">
              Back to login
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
