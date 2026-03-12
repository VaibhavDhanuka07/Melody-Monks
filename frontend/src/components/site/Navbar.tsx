import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Instructor", href: "/instructor" },
  { label: "Student Success", href: "/student-success" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand-gold shadow-glow">
            <span className="text-lg font-semibold">MM</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-ink">
              Melody Monks
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-ink-muted">
              Vasu Academy
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-ink-muted lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book-trial"
            className="btn-primary px-5 py-2 text-xs sm:text-sm"
          >
            Book Free Trial
          </Link>
          <Link
            href="/courses"
            className="hidden rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-ink-muted transition hover:text-ink sm:inline-flex"
          >
            Enroll
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 bg-black/70 lg:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 overflow-x-auto px-6 py-3 text-xs font-semibold text-ink-muted">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
