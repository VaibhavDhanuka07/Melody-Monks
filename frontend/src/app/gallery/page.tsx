import Image from "next/image";
import InstagramGallery from "@/components/site/InstagramGallery";
import { galleryCategories, galleryItems } from "@/data/gallery";

export default function GalleryPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Gallery</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Performances, live classes, and student showcases
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            A curated archive of instructor recitals, student performances, and
            behind-the-scenes moments.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <InstagramGallery />
      </section>

      {galleryCategories.map((category) => {
        const items = galleryItems.filter((item) => item.category === category);
        return (
          <section key={category} className="mx-auto w-full max-w-6xl px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink">{category}</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-soft"
                >
                  <div className="relative aspect-[4/3]">
                    {item.src ? (
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-muted">
                        Video placeholder
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 px-4 py-4">
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    {item.caption ? (
                      <p className="text-xs text-ink-muted">{item.caption}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
