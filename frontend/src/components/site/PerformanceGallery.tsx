"use client";

import Image from "next/image";
import { useState } from "react";
import { performanceVideos } from "@/data/site";
import VideoLightbox, { type LightboxVideo } from "./VideoLightbox";

export default function PerformanceGallery() {
  const [active, setActive] = useState<LightboxVideo | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {performanceVideos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() =>
              setActive({
                title: video.title,
                src: video.src,
                poster: video.poster,
              })
            }
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 text-left shadow-soft transition hover:-translate-y-1"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={video.poster}
                alt={video.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-black text-xs font-semibold">
                  Play
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{video.title}</p>
                  <p className="text-xs text-ink-muted">{video.subtitle}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <VideoLightbox
        open={Boolean(active)}
        onClose={() => setActive(null)}
        video={active}
      />
    </div>
  );
}
