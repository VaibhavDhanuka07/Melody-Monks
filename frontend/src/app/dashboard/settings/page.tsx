export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Profile settings</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Update your profile, goals, and notification preferences.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-ink-muted">
            Full name
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              placeholder="Student Name"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              placeholder="you@example.com"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Learning goal
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              placeholder="Perform a recital piece"
            />
          </label>
          <label className="text-sm text-ink-muted">
            Preferred schedule
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              placeholder="Evenings, weekends"
            />
          </label>
        </div>
        <button className="btn-primary">Save Settings</button>
      </div>
    </div>
  );
}
