/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getImageProps } from "next/image";
import { site } from "@/data/site";

const defaultTrustBadges = [
  "2000+ Students",
  "37 Years Experience",
  "300+ Professional Musicians",
];

const heroSizes = `
(max-width: 640px) 100vw,
(max-width: 1024px) 80vw,
50vw
`.trim();

function MentorHeroPicture() {
  const alt = "Mentor portrait in a studio setting";
  const common = {
    alt,
    fill: true,
    priority: true,
    sizes: heroSizes,
    quality: 85,
    style: { objectFit: "cover" as const },
  };

  const { props: desktop } = getImageProps({
    ...common,
    src: "/images/hero/mentor-hero-desktop.jpg",
  });
  const { props: tablet } = getImageProps({
    ...common,
    src: "/images/hero/mentor-hero-tablet.jpg",
  });
  const { props: mobile } = getImageProps({
    ...common,
    src: "/images/hero/mentor-hero-mobile.jpg",
  });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop.srcSet} />
      <source media="(min-width: 640px)" srcSet={tablet.srcSet} />
      <img {...mobile} alt={alt} />
    </picture>
  );
}

export default function HeroSection({
  trustBadges = defaultTrustBadges,
}: {
  trustBadges?: string[];
}) {
  return (
    <section className="relative min-h-[75vh] overflow-hidden sm:min-h-[85vh]">
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-24 sm:pt-28 lg:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative z-10 space-y-8">
            <div className="space-y-6 animate-fade-up text-center sm:text-left">
              <span className="badge">Premium Indian music academy</span>
              <h1 className="text-balance text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-6xl">
                Master Indian Music with a Legendary Mentor
              </h1>
              <p className="mx-auto max-w-2xl text-base text-white/80 sm:mx-0 sm:text-lg sm:text-ink-muted">
                Live on {site.liveClassPlatforms} | Recorded Lessons | Professional Certification
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <Link href="/book-trial" className="btn-primary w-full sm:w-auto">
                  Book Free Trial
                </Link>
                <Link href="/courses" className="btn-secondary w-full sm:w-auto">
                  Explore Courses
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
              {trustBadges.map((badge) => (
                <div key={badge} className="badge">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 sm:relative sm:inset-auto sm:mt-10 lg:mt-0">
            <div className="relative h-full w-full overflow-hidden sm:aspect-[16/9] sm:rounded-3xl sm:border sm:border-white/10 sm:bg-black/50 sm:shadow-lift lg:aspect-[4/5]">
              <div
                // If styles ever fail to load, `next/image`'s `fill`-style img can escape its
                // intended box. These inline fallbacks keep the hero image contained.
                style={{
                  position: "relative",
                  minHeight: "18rem",
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
              <MentorHeroPicture />
              <div className="absolute inset-0 sm:hidden bg-[linear-gradient(rgba(0,0,0,0.85),rgba(0,0,0,0.75))]" />
              <div className="absolute inset-0 hidden sm:block bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,169,106,0.22),transparent_55%)] opacity-70" />
              <div className="absolute -right-12 top-8 hidden h-48 w-48 rounded-full bg-brand-gold/20 blur-3xl lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
