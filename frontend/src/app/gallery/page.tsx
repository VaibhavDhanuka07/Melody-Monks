import Image from "next/image";
import InstagramFeed from "@/components/InstagramFeed";
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
            A curated archive of instructor recitals, student performances, and live
            class clips.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <InstagramFeed />
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
                    {item.kind === "video" ? (
                      item.src ? (
                        <video
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          preload={
                            item.category === "Live Classes" ||
                            item.category === "Student Performances"
                              ? "auto"
                              : "metadata"
                          }
                          autoPlay={
                            item.category === "Live Classes" ||
                            item.category === "Student Performances"
                          }
                          muted={
                            item.category === "Live Classes" ||
                            item.category === "Student Performances"
                          }
                          loop={
                            item.category === "Live Classes" ||
                            item.category === "Student Performances"
                          }
                          controls
                          playsInline
                          poster={item.poster}
                        >
                          <source src={item.src} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-ink-muted">
                          Video placeholder
                        </div>
                      )
                    ) : item.src ? (
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-ink-muted">
                        Image placeholder
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
