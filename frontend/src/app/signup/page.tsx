import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up",
  description: "Create a student account to join Melody Monks.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Get started</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Create your Melody Monks account
          </h1>
          <p className="mt-4 text-ink-muted">
            Save your practice progress, access lessons, and join live class updates.
          </p>
          <div className="card mt-8 p-6 text-sm text-ink-muted">
            Hook this form to Supabase Auth or Firebase Auth when you&apos;re ready to go live.
          </div>
        </div>

        <div className="card p-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
