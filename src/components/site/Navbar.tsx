import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Practice Tools", href: "/practice" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-amber text-white shadow-glow">
            <span className="text-lg font-semibold">HM</span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold">Melody Monks</p>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
              Music Academy
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-ink-muted shadow-soft md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book-trial"
            className="rounded-full bg-brand-amber px-4 py-2 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            Book Trial
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-stroke bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand-indigo hover:text-brand-indigo"
          >
            Login
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/book-trial"
            className="rounded-full bg-brand-amber px-4 py-2 text-xs font-semibold text-ink shadow-soft"
          >
            Book Trial
          </Link>
        </div>
      </div>
    </header>
  );
}

