import Image from "next/image";
import { instrumentPhotography } from "@/data/media";

const instrumentImages = instrumentPhotography.map((item) => ({
  name: item.name,
  src: item.src,
}));

const duplicated = [...instrumentImages, ...instrumentImages];

export default function InstrumentImageMarqueeSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Instruments</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            Learn every instrument with a cinematic experience
          </h2>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-4">
        <div className="flex w-max gap-6 motion-reduce:animate-none animate-marquee">
          {duplicated.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="relative h-32 w-44 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-soft"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div
                // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                style={{
                  position: "relative",
                  minHeight: "8rem",
                  minWidth: "11rem",
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="176px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-4">
        <div className="flex w-max gap-6 motion-reduce:animate-none animate-marquee-reverse">
          {duplicated.map((item, index) => (
            <div
              key={`${item.name}-reverse-${index}`}
              className="relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/70 shadow-soft"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div
                // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                style={{
                  position: "relative",
                  minHeight: "7rem",
                  minWidth: "10rem",
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
              <Image
                src={item.src}
                alt={item.name}
                fill
                sizes="160px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
