import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-indigo via-brand-purple to-brand-amber text-white shadow-glow">
              <span className="text-base font-semibold">HM</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Melody Monks</p>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                Global Academy
              </p>
            </div>
          </div>
          <p className="text-sm text-ink-muted">
            Premium music education with live classes, performance feedback, and
            AI-powered practice tools.
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <span>4.9 Rating</span>
            <span>500+ Students</span>
            <span>Global Instructors</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-ink">Programs</p>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Piano Mastery
          </Link>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Guitar Foundations
          </Link>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Vocal Coaching
          </Link>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Instrument Bundles
          </Link>
          <Link href="/pricing" className="block text-ink-muted hover:text-ink">
            Pricing
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-ink">Practice</p>
          <Link href="/practice" className="block text-ink-muted hover:text-ink">
            Tool Dashboard
          </Link>
          <Link href="/practice/piano" className="block text-ink-muted hover:text-ink">
            Piano Keyboard
          </Link>
          <Link href="/practice/metronome" className="block text-ink-muted hover:text-ink">
            Metronome
          </Link>
          <Link href="/practice/ear-training" className="block text-ink-muted hover:text-ink">
            Ear Training
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-ink">Company</p>
          <Link href="/about" className="block text-ink-muted hover:text-ink">
            About
          </Link>
          <Link href="/gallery" className="block text-ink-muted hover:text-ink">
            Gallery
          </Link>
          <Link href="/book-trial" className="block text-ink-muted hover:text-ink">
            Book Trial
          </Link>
          <Link href="/dashboard" className="block text-ink-muted hover:text-ink">
            Student Dashboard
          </Link>
          <Link href="/admin" className="block text-ink-muted hover:text-ink">
            Instructor Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 Melody Monks Music Academy. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

