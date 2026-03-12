export const metadata = {
  title: "Book Trial",
  description: "Book a free 30-minute trial class with Melody Monks instructors.",
};

export default function BookTrialPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold text-brand-amber">Free Trial</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Book your free 30-minute trial class
          </h1>
          <p className="mt-4 text-ink-muted">
            Tell us about your goals. We will match you with a coach and confirm
            a time that fits your time zone.
          </p>
          <div className="mt-8 grid gap-4">
            {[
              "Personalized instructor match",
              "Live class + practice roadmap",
              "AI practice tool access",
              "Performance feedback summary",
            ].map((item) => (
              <div
                key={item}
                className="card p-4 text-sm text-ink-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <form className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink">Full name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-2 w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink">Instrument</label>
              <select className="mt-2 w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm">
                <option>Piano</option>
                <option>Guitar</option>
                <option>Vocal</option>
                <option>Drums</option>
                <option>Violin</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink">Time zone</label>
              <input
                type="text"
                placeholder="IST, PST, GMT..."
                className="mt-2 w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink">Goals</label>
              <textarea
                placeholder="Tell us what you want to achieve"
                className="mt-2 h-28 w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm"
              ></textarea>
            </div>
            <button className="btn-primary w-full">
              Book Free Trial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

