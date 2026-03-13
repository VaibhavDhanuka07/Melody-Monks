export const metadata = {
  title: "Login",
  description: "Sign in to access your Indian music student dashboard.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Welcome back</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Log in to continue your practice
          </h1>
          <p className="mt-4 text-ink-muted">
            Access lesson recordings, track progress, and upload performances.
          </p>
          <div className="card mt-8 p-6 text-sm text-ink-muted">
            Configure Supabase Auth or Firebase Auth to enable secure sign-in and
            OAuth providers.
          </div>
        </div>

        <div className="card p-8">
          <form className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink"
              />
            </div>
            <button className="btn-primary w-full">Log In</button>
            <button type="button" className="btn-secondary w-full">
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
