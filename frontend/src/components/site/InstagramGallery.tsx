"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { apiBaseUrl, instagramFallback, site } from "@/data/site";

export type InstagramItem = {
  id: string;
  title: string;
  image: string;
  url: string;
  type: string;
};

export default function InstagramGallery() {
  const [items, setItems] = useState<InstagramItem[]>(instagramFallback);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setStatus("loading");
        const response = await fetch(`${apiBaseUrl}/api/instagram`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to load instagram feed");
        }
        const data = (await response.json()) as { items: InstagramItem[] };
        if (data?.items?.length) {
          setItems(data.items);
        }
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    };
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Instagram</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Latest reels and moments from Vasu
          </h3>
        </div>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary px-5 py-2 text-xs"
        >
          Open Instagram
        </a>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-soft transition hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
                  {item.type}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink">
                  {item.title}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
      {status === "error" ? (
        <p className="text-xs text-ink-muted">
          Unable to load live Instagram posts. Showing curated highlights.
        </p>
      ) : null}
    </div>
  );
}
