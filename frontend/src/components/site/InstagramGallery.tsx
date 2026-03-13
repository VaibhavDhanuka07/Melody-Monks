import Image from "next/image";
import {
  instagramPosts,
  instagramProfileUrl,
} from "@/data/instagram";

export default function InstagramGallery() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Instagram</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Latest highlights from @musicianvasu
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            Reels, photos, and performance highlights from the studio.
          </p>
        </div>
        <a
          href={instagramProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Follow on Instagram
        </a>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {instagramPosts.map((post) => (
          <div
            key={post.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-soft"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {post.embedUrl ? (
                <iframe
                  title={post.title}
                  src={post.embedUrl}
                  className="h-full w-full"
                  loading="lazy"
                  allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              ) : (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-ink">
                {post.type}
              </span>
            </div>
            <div className="space-y-2 px-4 py-4">
              <p className="text-sm font-semibold text-ink">{post.title}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-gold hover:text-brand-gold-soft"
              >
                View on Instagram
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
