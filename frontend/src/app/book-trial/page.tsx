import BookingForm from "@/components/site/BookingForm";
import { site } from "@/data/site";

export default function BookTrialPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong grid gap-8 p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Book Trial</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">
              Start your music journey today
            </h1>
            <p className="mt-4 text-sm text-ink-muted">
              Book a free 30-minute guitar trial class and receive a custom
              roadmap to reach your next milestone.
            </p>
            <div className="mt-6 space-y-2 text-sm text-ink-muted">
              <p>- One-on-one guidance with Vasu</p>
              <p>- Personalized practice plan</p>
              <p>- Performance feedback</p>
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
              className="btn-secondary mt-6 w-full"
            >
              Chat Now
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <BookingForm />
      </section>
    </div>
  );
}
