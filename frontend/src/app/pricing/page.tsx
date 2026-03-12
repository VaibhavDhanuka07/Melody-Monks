import Link from "next/link";
import { pricingPlans } from "@/data/site";

export const metadata = {
  title: "Pricing",
  description: "Choose a piano program that fits your goals.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-16">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Pricing</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">
          Piano programs and memberships
        </h1>
        <p className="mt-3 text-ink-muted">
          Choose a plan that matches your learning pace and coaching needs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`card-strong flex flex-col gap-4 p-6 ${
              plan.highlighted ? "border-brand-gold/60" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-ink">{plan.name}</p>
              {plan.highlighted ? (
                <span className="rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                  Most Popular
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-2xl font-semibold text-ink">{plan.price}</p>
              <p className="text-xs text-ink-muted">{plan.cadence}</p>
            </div>
            <p className="text-sm text-ink-muted">{plan.description}</p>
            <ul className="space-y-2 text-sm text-ink-muted">
              {plan.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
            <Link href="/book-trial" className="btn-primary mt-auto">
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
