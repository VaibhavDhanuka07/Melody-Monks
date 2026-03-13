import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Courses", href: "/dashboard/courses" },
  { label: "Lessons", href: "/dashboard/lessons" },
  { label: "Live Classes", href: "/dashboard/live-classes" },
  { label: "Practice Tracker", href: "/dashboard/practice" },
  { label: "Tools", href: "/dashboard/tools" },
  { label: "AI Practice", href: "/dashboard/ai-practice" },
  { label: "AI Teacher", href: "/dashboard/ai-teacher" },
  { label: "Practice Plan", href: "/dashboard/practice-plan" },
  { label: "Assignments", href: "/dashboard/assignments" },
  { label: "Performance Upload", href: "/dashboard/performance-upload" },
  { label: "Certificates", href: "/dashboard/certificates" },
  { label: "Settings", href: "/dashboard/settings" },
];

const mobileItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/dashboard/courses" },
  { label: "Practice", href: "/dashboard/practice" },
  { label: "Tools", href: "/dashboard/tools" },
  { label: "Profile", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="lg:hidden">
        <div className="card-strong p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Student Portal
          </p>
          <h2 className="mt-2 text-lg font-semibold text-ink">
            Indian Music Mastery
          </h2>
          <div className="mt-4 flex items-center gap-3 overflow-x-auto text-xs font-semibold text-ink-muted">
            {mobileItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-white/10 px-4 py-2 transition hover:border-brand-gold/40 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:mt-0 lg:flex-row">
        <aside className="card-strong hidden h-fit w-full max-w-xs p-6 lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
            Student Portal
          </p>
          <h2 className="mt-3 text-xl font-semibold text-ink">
            Indian Music Mastery
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
    </div>
  );
}
