import Link from "next/link";

const plans = [
  {
    name: "Beginner Plan",
    price: "INR 2000/month",
    description: "Weekly live class and guided practice tools.",
    features: [
      "Weekly live class",
      "Practice tools access",
      "Lesson recordings",
      "Progress tracking",
    ],
    popular: false,
  },
  {
    name: "Most Popular",
    price: "INR 3500/month",
    description: "Deep coaching plus AI feedback to accelerate mastery.",
    features: [
      "Twice-weekly live classes",
      "AI note + chord feedback",
      "Personalized practice plan",
      "Priority instructor chat",
    ],
    popular: true,
  },
  {
    name: "Elite Artist",
    price: "INR 5200/month",
    description: "Performance-ready mentorship with 1:1 guidance.",
    features: [
      "1:1 monthly coaching",
      "Performance review",
      "Advanced repertoire",
      "Portfolio support",
    ],
    popular: false,
  },
];

export const metadata = {
  title: "Pricing",
  description: "Choose a learning plan for your music journey.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-purple">Pricing</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Choose a plan that fits your rhythm
          </h1>
          <p className="mt-3 text-ink-muted">
            International payments via Stripe, India via Razorpay.
          </p>
        </div>
        <Link href="/book-trial" className="btn-accent">
          Book Free Trial
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 transition hover:-translate-y-1 hover:shadow-lift ${
              plan.popular ? "border-brand-indigo bg-white/90" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-ink">{plan.name}</p>
              {plan.popular && (
                <span className="rounded-full bg-brand-indigo/10 px-3 py-1 text-xs font-semibold text-brand-indigo">
                  Most Popular
                </span>
              )}
            </div>
            <p className="mt-4 text-2xl font-semibold text-ink">
              {plan.price}
            </p>
            <p className="mt-2 text-sm text-ink-muted">{plan.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-ink-muted">
              {plan.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
            <Link
              href="/book-trial"
              className={`mt-6 w-full ${
                plan.popular ? "btn-primary" : "btn-secondary"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <div className="card p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Need help choosing?</p>
          <p className="mt-2 text-sm text-ink-muted">
            Talk to our team and get a personalized plan recommendation.
          </p>
        </div>
        <Link href="/book-trial" className="btn-primary">
          Talk to an Advisor
        </Link>
      </div>
    </div>
  );
}
