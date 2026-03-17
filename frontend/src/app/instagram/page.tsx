import type { Metadata } from "next";
import InstagramGallery from "@/components/site/InstagramGallery";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Selected Instagram posts and reels from @musicianvasu.",
};

export default function InstagramFeedPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong relative overflow-hidden p-10">
          <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-brand-gold/10 blur-2xl" />
          <p className="text-sm font-semibold text-brand-gold">Instagram</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Latest from @musicianvasu
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-ink-muted">
            Curated reels and posts embedded directly from Instagram.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <InstagramGallery showHeader={false} />
      </section>
    </div>
  );
}
