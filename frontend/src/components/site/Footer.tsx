import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-brand-gold shadow-glow">
              <span className="text-base font-semibold">MM</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                {site.name}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                Premium Guitar Academy
              </p>
            </div>
          </div>
          <p className="text-sm text-ink-muted">
            Cinematic guitar education with live coaching, performance training,
            and professional feedback.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
            <span>500+ Students</span>
            <span>10+ Years Experience</span>
            <span>Online &amp; Offline</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-ink">Programs</p>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Beginner Path
          </Link>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Intermediate Mastery
          </Link>
          <Link href="/courses" className="block text-ink-muted hover:text-ink">
            Advanced Performance
          </Link>
          <Link href="/book-trial" className="block text-ink-muted hover:text-ink">
            Book Trial
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-semibold text-ink">Explore</p>
          <Link href="/instructor" className="block text-ink-muted hover:text-ink">
            Instructor
          </Link>
          <Link href="/student-success" className="block text-ink-muted hover:text-ink">
            Student Success
          </Link>
          <Link href="/gallery" className="block text-ink-muted hover:text-ink">
            Gallery
          </Link>
          <Link href="/contact" className="block text-ink-muted hover:text-ink">
            Contact
          </Link>
        </div>

        <div className="space-y-4 text-sm">
          <p className="font-semibold text-ink">Contact</p>
          <p className="text-ink-muted">Email: hello@melodymonks.com</p>
          <p className="text-ink-muted">Studio: Kolkata, India</p>
          <a
            href={site.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-soft"
          >
            WhatsApp: {site.whatsappLabel}
          </a>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 Melody Monks. All rights reserved.</p>
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
