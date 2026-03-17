import LoginForm from "@/components/auth/LoginForm";

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
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
