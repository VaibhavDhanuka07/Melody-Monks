import Link from "next/link";
import { site } from "@/data/site";

type BlogArticleCtaProps = {
  title: string;
  category: string;
};

export default function BlogArticleCta({
  title,
  category,
}: BlogArticleCtaProps) {
  return (
    <section className="card-strong overflow-hidden p-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-gold">
            Free Trial Class
          </p>
          <h3 className="text-3xl font-semibold text-ink">
            Turn this {category.toLowerCase()} article into guided practice
          </h3>
          <p className="text-sm leading-7 text-ink-muted">
            If you found value in <span className="text-ink">{title}</span>,
            the next step is live feedback. Train with Debojeet Lahiri through
            Melody Monks on {site.liveClassPlatforms}, get a personal practice
            roadmap, and review your progress with real corrections instead of
            guessing alone.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
            <span className="rounded-full border border-white/10 px-3 py-1">
              Live on {site.liveClassPlatforms}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              Personalized practice plan
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              Performance feedback
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <Link href="/book-trial" className="btn-primary w-full text-center">
            Book Free Trial
          </Link>
          <a
            href={site.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary block w-full text-center"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
