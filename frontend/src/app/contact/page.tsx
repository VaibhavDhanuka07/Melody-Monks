import { site } from "@/data/site";

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Contact</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              Connect with the Indian music academy
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              Reach out for course details, trial booking, or performance
              collaborations.
            </p>
            <div className="mt-6 space-y-3 text-sm text-ink-muted">
              <p>Email: melodymonks@gmail.com</p>
              <p>Studio: Kolkata, India</p>
              <p>Online sessions available worldwide</p>
              <p>Instagram: @musicianvasu</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/60 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
              WhatsApp
            </p>
            <p className="mt-3 text-2xl font-semibold text-ink">
              {site.whatsappLabel}
            </p>
            <a
              href={site.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6 w-full"
            >
              Chat with the team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
