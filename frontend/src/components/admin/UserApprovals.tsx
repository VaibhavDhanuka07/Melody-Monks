"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api/client";

type AdminUser = {
  id: string;
  email: string | null;
  role: string;
  approved: boolean;
  createdAt: string | null;
  lastSignInAt: string | null;
};

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
};

export default function UserApprovals() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      (user.email ?? "").toLowerCase().includes(term)
    );
  }, [query, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await apiFetch("/api/admin/users", { auth: true });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Unable to load users.");
      }
      const data = (await response.json()) as { users?: AdminUser[] };
      setUsers(data.users ?? []);
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Unable to load user approvals."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateApproval = async (userId: string, approved: boolean) => {
    setStatus(null);
    try {
      const response = await apiFetch(`/api/admin/users/${userId}/approval`, {
        auth: true,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "Unable to update approval.");
      }
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, approved } : user
        )
      );
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Unable to update approval."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">User Approvals</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            Approve dashboard access
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Approve or reject students before they can access the dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by email"
            className="min-w-[220px] rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-ink"
          />
          <button
            type="button"
            onClick={fetchUsers}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Refresh
          </button>
        </div>
      </div>

      {status ? <p className="mt-3 text-xs text-ink-muted">{status}</p> : null}

      {loading ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-ink-muted">
          Loading users...
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-ink-muted">
          No users found.
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-ink-muted"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink">
                    {user.email ?? "Unknown email"}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Role: {user.role || "student"} · Created{" "}
                    {formatDate(user.createdAt)} · Last sign-in{" "}
                    {formatDate(user.lastSignInAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      user.approved
                        ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                        : "border-white/10 bg-white/5 text-ink-muted"
                    }`}
                  >
                    {user.approved ? "Approved" : "Pending"}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateApproval(user.id, true)}
                    className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400 hover:text-emerald-100"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateApproval(user.id, false)}
                    className="rounded-full border border-red-400/40 px-3 py-1 text-xs font-semibold text-red-200 transition hover:border-red-400 hover:text-red-100"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
