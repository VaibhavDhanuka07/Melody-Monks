"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Instructor", href: "/instructor" },
  { label: "Student Success", href: "/student-success" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const mobileLinks = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "Courses", href: "/courses" },
      { label: "Curriculum", href: "/curriculum" },
      { label: "Instructor", href: "/instructor" },
      { label: "Student Success", href: "/student-success" },
      { label: "Reviews", href: "/reviews" },
      { label: "Tools", href: "/tools" },
      { label: "Blog", href: "/blog" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
    []
  );

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-black/80 px-4 py-3 shadow-soft backdrop-blur-xl">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/20 bg-white/5 text-brand-gold shadow-glow">
            <span className="text-lg font-semibold">MM</span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold leading-none text-ink">
              Melody Monks
            </p>
            <p className="mt-1 hidden text-[10px] uppercase tracking-[0.36em] text-ink-muted md:block">
              Indian Music Academy
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
          <div className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
            {navItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium transition ${
                    active
                      ? "bg-white/10 text-ink"
                      : "text-ink-muted hover:bg-white/5 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/login"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-ink-muted transition hover:border-white/20 hover:text-ink"
          >
            Login
          </Link>
          <Link
            href="/book-trial"
            className="btn-primary min-h-[46px] shrink-0 whitespace-nowrap px-5 py-2.5 text-sm"
          >
            Book Free Trial
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <Link
            href="/book-trial"
            className="btn-primary min-h-[42px] whitespace-nowrap px-4 py-2 text-xs sm:px-5 sm:text-sm"
          >
            Book Free Trial
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-ink-muted transition hover:text-ink"
            aria-label="Open menu"
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span className="h-0.5 w-full rounded-full bg-white/70" />
              <span className="h-0.5 w-full rounded-full bg-white/70" />
              <span className="h-0.5 w-full rounded-full bg-white/70" />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] xl:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[88vw] border-l border-white/10 bg-black/95 px-6 py-6 transition-transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl font-semibold text-ink">
                Melody Monks
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-ink-muted">
                Indian Music Academy
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-ink-muted transition hover:text-ink"
            >
              Close
            </button>
          </div>
          <nav className="mt-6 grid gap-2 text-sm text-ink-muted">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-2xl border px-4 py-3 transition ${
                  isActiveRoute(pathname, item.href)
                    ? "border-brand-gold/40 bg-brand-gold/10 text-ink"
                    : "border-white/10 bg-black/60 hover:border-brand-gold/40 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            <Link
              href="/book-trial"
              onClick={() => setMenuOpen(false)}
              className="btn-primary w-full"
            >
              Book Free Trial
            </Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-secondary w-full"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
