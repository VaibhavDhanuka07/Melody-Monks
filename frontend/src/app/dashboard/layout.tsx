import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Courses", href: "/dashboard/courses" },
  { label: "Lessons", href: "/dashboard/lessons" },
  { label: "Practice Tracker", href: "/dashboard/practice" },
  { label: "Assignments", href: "/dashboard/assignments" },
  { label: "Performance Upload", href: "/dashboard/performance-upload" },
  { label: "Certificates", href: "/dashboard/certificates" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
      <aside className="card-strong h-fit w-full max-w-xs p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
          Student Portal
        </p>
        <h2 className="mt-3 text-xl font-semibold text-ink">
          Piano Mastery
        </h2>
        <nav className="mt-6 space-y-2 text-sm text-ink-muted">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl border border-transparent px-3 py-2 transition hover:border-brand-gold hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
