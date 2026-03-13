import AdminManagement from "@/components/admin/AdminManagement";

export const metadata = {
  title: "Admin Panel",
  description: "Admin dashboard for managing Indian music courses and students.",
};

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-gold">Admin Panel</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Indian Music Academy Admin
        </h1>
        <p className="mt-3 text-ink-muted">
          Manage courses, lessons, enrollments, trial leads, and submissions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active students", value: "412" },
          { label: "Courses", value: "12" },
          { label: "Trial leads", value: "64" },
          { label: "Pending reviews", value: "12" },
        ].map((item) => (
          <div key={item.label} className="card p-6">
            <p className="text-sm text-ink-muted">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Recent Trial Leads</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">Riya K. - Vocal Trial - New</div>
            <div className="card px-4 py-3">Arun B. - Guitar Trial - Follow-up</div>
            <div className="card px-4 py-3">Maya P. - Bollywood Trial - Scheduled</div>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Admin Actions</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">Manage lessons and modules</div>
            <div className="card px-4 py-3">Review performance uploads</div>
            <div className="card px-4 py-3">Issue certificates</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdminManagement />
      </div>
    </div>
  );
}
