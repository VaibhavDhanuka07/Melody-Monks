export const metadata = {
  title: "Admin Panel",
  description: "Instructor admin dashboard for managing courses and students.",
};

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-purple">Admin Panel</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Instructor Admin
        </h1>
        <p className="mt-3 text-ink-muted">
          Manage students, courses, lessons, bookings, and analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active students", value: "312" },
          { label: "Courses", value: "12" },
          { label: "Bookings", value: "48" },
          { label: "Revenue", value: "INR 4.2L" },
        ].map((item) => (
          <div
            key={item.label}
            className="card p-6"
          >
            <p className="text-sm text-ink-muted">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Recent Bookings</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">
              Arjun K. - Piano Mastery - Confirmed
            </div>
            <div className="card px-4 py-3">
              Mei L. - Vocal Studio - Pending
            </div>
            <div className="card px-4 py-3">
              Luis M. - Guitar Foundations - Confirmed
            </div>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm font-semibold text-ink">Quick Actions</p>
          <div className="mt-4 space-y-3 text-sm text-ink-muted">
            <div className="card px-4 py-3">
              Upload lesson videos
            </div>
            <div className="card px-4 py-3">
              Manage instructor roster
            </div>
            <div className="card px-4 py-3">
              View analytics report
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
