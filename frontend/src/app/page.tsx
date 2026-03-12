import Image from "next/image";
import Link from "next/link";
import BookingForm from "@/components/site/BookingForm";
import InstagramGallery from "@/components/site/InstagramGallery";
import PerformanceGallery from "@/components/site/PerformanceGallery";
import TestimonialsCarousel from "@/components/site/TestimonialsCarousel";
import { coursePaths, site, testimonials } from "@/data/site";

const trustBadges = [
  "500+ Students",
  "10+ Years Experience",
  "Online & Offline Classes",
];

const transformationBefore = [
  "Cannot hold chords consistently",
  "Slow finger movement",
  "No rhythm control",
];

const transformationAfter = [
  "Play full songs",
  "Fingerstyle techniques",
  "Confident performances",
];

export default function Home() {
  return (
    <div className="space-y-28 pb-28">
      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/vasu/vasu-performance.svg"
            className="h-full w-full object-cover"
          >
            <source src="/videos/hero-guitar.mp4" />
          </video>
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/80 to-black" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-center gap-8 px-6 pb-16 pt-28">
          <div className="space-y-6 animate-fade-up">
            <span className="badge">Premium guitar academy</span>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Learn Guitar From a Professional Musician
            </h1>
            <p className="max-w-2xl text-lg text-ink-muted">
              Structured lessons for beginners to advanced players, with cinematic
              coaching and performance feedback.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/book-trial" className="btn-primary">
                Book Free Trial
              </Link>
              <Link href="#performances" className="btn-secondary">
                Watch Performance
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {trustBadges.map((badge) => (
              <div key={badge} className="badge">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="instructor">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card-strong relative overflow-hidden p-8">
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full bg-brand-gold/10 blur-2xl" />
            <div className="space-y-5">
              <p className="text-sm font-semibold text-brand-gold">Instructor</p>
              <h2 className="text-3xl font-semibold text-ink">
                {site.instructor.fullName}
              </h2>
              <p className="text-sm text-ink-muted">{site.instructor.role}</p>
              <p className="text-sm text-ink-muted">{site.instructor.bio}</p>
              <div className="flex flex-wrap gap-3 text-xs text-ink-muted">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {site.instructor.experience}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Live performance coaching
                </span>
              </div>
              <ul className="space-y-2 text-sm text-ink-muted">
                {site.instructor.achievements.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["/vasu/vasu-portrait.svg", "/vasu/vasu-performance.svg"].map(
              (src) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
                >
                  <Image
                    src={src}
                    alt="Vasu portrait"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )
            )}
            <div className="card-strong flex flex-col justify-between p-6">
              <p className="text-sm text-ink-muted">
                Performance philosophy
              </p>
              <p className="text-xl font-semibold text-ink">
                &ldquo;Technique is power. Emotion is the story.&rdquo;
              </p>
              <p className="text-xs text-ink-muted">Vasu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="courses">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Learning Path</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Structured course progression
            </h2>
          </div>
          <Link href="/courses" className="btn-secondary px-4 py-2 text-xs">
            View Courses
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {coursePaths.map((path) => (
            <div key={path.title} className="card-strong flex flex-col gap-6 p-6">
              <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={path.image}
                  alt={path.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">{path.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{path.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-ink-muted">
                {path.topics.map((topic) => (
                  <li key={topic}>- {topic}</li>
                ))}
              </ul>
              <Link href="/book-trial" className="btn-primary mt-auto">
                Enroll
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="performances">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Performances</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Cinematic guitar performance gallery
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Watch acoustic solos, electric showcases, and Instagram reels.
            </p>
          </div>
          <Link href="/gallery" className="btn-secondary px-4 py-2 text-xs">
            Open Gallery
          </Link>
        </div>
        <div className="mt-8">
          <PerformanceGallery />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="card-strong p-8">
            <p className="text-sm font-semibold text-brand-gold">
              Student Transformation
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              From beginner to performer in 3 months
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                  Before learning
                </p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  {transformationBefore.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                  After 3 months
                </p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  {transformationAfter.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-black via-black/80 to-black p-10 text-center shadow-lift">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
            Free Guitar Trial Class
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-ink">
            Only 20 slots available this week
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Secure your free session with Vasu and get a personalized plan.
          </p>
          <Link href="/book-trial" className="btn-primary mt-6">
            Book Your Free Trial
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="booking">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <BookingForm />
          <div className="card-strong flex flex-col justify-between p-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-brand-gold">What you get</p>
              <h3 className="text-2xl font-semibold text-ink">
                A premium coaching experience
              </h3>
              <ul className="space-y-3 text-sm text-ink-muted">
                <li>- Personalized skill assessment</li>
                <li>- Custom practice plan</li>
                <li>- Performance feedback</li>
                <li>- Access to exclusive resources</li>
              </ul>
            </div>
            <div className="mt-8 rounded-3xl border border-white/10 bg-black/60 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-ink-muted">
                WhatsApp
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {site.whatsappLabel}
              </p>
              <a
                href={site.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary mt-4 w-full"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="instagram">
        <InstagramGallery />
      </section>
    </div>
  );
}
