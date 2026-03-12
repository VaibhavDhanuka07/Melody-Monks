import Image from "next/image";
import Link from "next/link";
import {
  galleryCategories,
  galleryItems,
  instagramItems,
} from "@/data/gallery";

export const metadata = {
  title: "Gallery",
  description: "Performances, teaching sessions, student achievements, and events.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 space-y-12">
      <div className="space-y-4">
        <p className="text-sm font-semibold text-brand-purple">Gallery</p>
        <h1 className="text-4xl font-semibold text-ink">
          Moments from the Melody Monks community
        </h1>
        <p className="text-ink-muted">
          Explore performances, teaching sessions, student milestones, and
          events led by Debojeet Lahiri (Musician Vasu).
        </p>
      </div>

      <div className="card p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Instagram feed</p>
          <p className="mt-2 text-sm text-ink-muted">
            Follow the latest reels, photos, and practice snippets on
            @musicianvasu.
          </p>
        </div>
        <a
          href="https://www.instagram.com/musicianvasu?igsh=MW15bWd0dDJoZWJkeQ=="
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Open Instagram
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {instagramItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="card p-5 text-sm text-ink transition hover:-translate-y-1 hover:shadow-lift"
          >
            <p className="text-xs text-ink-muted">Instagram</p>
            <p className="mt-2 font-semibold">{item.title}</p>
            <p className="mt-3 text-xs text-brand-indigo">Open link</p>
          </a>
        ))}
      </div>

      <div className="space-y-10">
        {galleryCategories.map((category) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink">{category}</h2>
              <Link href="/book-trial" className="btn-secondary px-4 py-2 text-xs">
                Book Trial
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {galleryItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="card p-4 space-y-3">
                    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-indigo/10 via-brand-purple/10 to-brand-amber/10 aspect-video">
                      {item.kind === "image" && item.src ? (
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : item.kind === "video" && item.src ? (
                        <video
                          controls
                          className="h-full w-full object-cover"
                          poster={item.poster}
                        >
                          <source src={item.src} />
                        </video>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-ink-muted">
                          Add {item.kind === "video" ? "video" : "image"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {item.title}
                      </p>
                      {item.caption && (
                        <p className="mt-2 text-xs text-ink-muted">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">Want to be featured?</p>
          <p className="mt-2 text-sm text-ink-muted">
            Share your practice wins with your coach and get highlighted in the
            gallery.
          </p>
        </div>
        <Link href="/book-trial" className="btn-accent">
          Book a Trial Class
        </Link>
      </div>
    </div>
  );
}


