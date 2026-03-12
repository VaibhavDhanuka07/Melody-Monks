import StudentDashboard from "@/components/dashboard/StudentDashboard";

export const metadata = {
  title: "Student Dashboard",
  description: "Track courses, progress, and practice analytics.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-gold">Dashboard</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Student Dashboard
        </h1>
        <p className="mt-3 text-ink-muted">
          View enrolled courses, upcoming classes, and practice analytics.
        </p>
      </div>
      <StudentDashboard />
    </div>
  );
}
