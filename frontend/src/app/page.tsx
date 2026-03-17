import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import ToolsGrid from "@/components/site/ToolsGrid";
import BlogCard from "@/components/blog/BlogCard";
import InstagramGallery from "@/components/site/InstagramGallery";
import InstrumentImageMarqueeSection from "@/components/InstrumentImageMarqueeSection";
import { coursePaths, site, pricingPlans } from "@/data/site";
import { curriculumCourses } from "@/data/universal-curriculum";
import { getLatestPosts } from "@/data/blog";
import { reviews } from "@/data/reviews";
import { instruments } from "@/data/instruments";
import HeroSection from "@/components/HeroSection";

const PhotoShowcaseSection = dynamic(
  () => import("@/components/PhotoShowcaseSection"),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card-strong p-6 text-sm text-ink-muted">
          Loading photo showcase...
        </div>
      </section>
    ),
  }
);

const InstrumentShowcaseSection = dynamic(
  () => import("@/components/InstrumentShowcaseSection"),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="card-strong p-6 text-sm text-ink-muted">
          Loading instrument showcase...
        </div>
      </section>
    ),
  }
);

const ReviewsCarousel = dynamic(
  () => import("@/components/site/ReviewsCarousel"),
  {
    ssr: false,
    loading: () => (
      <div className="card-strong p-6 text-sm text-ink-muted">
        Loading student reviews...
      </div>
    ),
  }
);

const BookingForm = dynamic(() => import("@/components/site/BookingForm"), {
  ssr: false,
  loading: () => (
    <div className="card-strong p-6 text-sm text-ink-muted">
      Loading booking form...
    </div>
  ),
});

const trustBadges = [
  "2000+ Students",
  "37 Years Experience",
  "300+ Professional Musicians",
];

const studentSuccessBefore = [
  "Unsteady sur and pitch control",
  "Weak rhythm confidence",
  "Limited stage presence",
];

const studentSuccessAfter = [
  "Accurate sur and steady sargam",
  "Confident taal and timing",
  "Stage-ready performances",
];

export default function Home() {
  const latestPosts = getLatestPosts(3);
  const featuredCurriculum = curriculumCourses[0];
  const featuredInstruments = instruments.slice(0, 6).map((instrument) => ({
    id: instrument.id,
    name: instrument.name,
    description: instrument.description,
    toolType: "Instrument",
    href: instrument.href,
    badge: instrument.highlight,
    image: instrument.image,
  }));

  return (
    <div className="space-y-28 pb-28">
      <HeroSection trustBadges={trustBadges} />

      <PhotoShowcaseSection />

      <InstrumentShowcaseSection />

      <InstrumentImageMarqueeSection />

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
                  {site.instructor.experience}{" "}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Live mentorship on {site.liveClassPlatforms}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-ink-muted">
                {site.instructor.achievements.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <div className="grid gap-3 sm:grid-cols-2">
                {site.instructor.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-ink-muted"
                  >
                    <p className="uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "/vasu/instructor-1.webp",
              "/vasu/instructor-2.jpeg",
              "/vasu/instructor-3.webp",
            ].map(
              (src) => (
                <div
                  key={src}
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
                  style={{
                    // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                    position: "relative",
                    aspectRatio: "4 / 5",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={src}
                    alt="Instructor portrait"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )
            )}
            <div className="card-strong flex flex-col justify-between p-6">
              <p className="text-sm text-ink-muted">Performance highlight</p>
              <p className="text-xl font-semibold text-ink">
                Watch a short performance clip from the instructor.
              </p>
              <Link href="/gallery" className="btn-secondary mt-4">
                View Performances
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="courses">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Courses</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Hindustani, Bollywood, and instrument programs
            </h2>
          </div>
          <Link href="/courses" className="btn-secondary px-4 py-2 text-xs">
            Explore Courses
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coursePaths.slice(0, 6).map((path) => (
            <div key={path.title} className="card-strong flex flex-col gap-6 p-6">
              <div
                className="relative h-40 overflow-hidden rounded-2xl border border-white/10"
                style={{
                  // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                  position: "relative",
                  height: "10rem",
                  overflow: "hidden",
                }}
              >
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
              <div className="flex flex-wrap gap-2 text-xs text-ink-muted">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {path.modules} modules
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {path.lessons} lessons
                </span>
                {path.level ? (
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {path.level}
                  </span>
                ) : null}
                {path.duration ? (
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {path.duration}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {path.format}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-ink-muted">
                {path.topics.map((topic) => (
                  <li key={topic}>- {topic}</li>
                ))}
              </ul>
              <Link href="/book-trial" className="btn-secondary mt-auto w-full sm:w-auto">
                Enroll
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/courses" className="btn-secondary px-4 py-2 text-xs">
            View all courses
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="student-success">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">
              Student Success
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Transformation journeys in 12 weeks
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              From hesitant beginners to confident performers with structured
              coaching.
            </p>
          </div>
          <Link href="/student-success" className="btn-secondary px-4 py-2 text-xs">
            View Stories
          </Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-brand-gold">Before</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {studentSuccessBefore.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="card-strong p-6">
            <p className="text-sm font-semibold text-brand-gold">After 3 Months</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {studentSuccessAfter.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "92% report stronger rhythm in 4 weeks",
            "4.9 average cohort rating",
            "Monthly recitals and showcases",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4 text-sm text-ink-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="instagram">
        <InstagramGallery />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="curriculum">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Curriculum</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Structured learning path for every level
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {featuredCurriculum.modules.length} modules,{" "}
              {featuredCurriculum.modules.length * 4} lessons.
            </p>
          </div>
          <Link href="/curriculum" className="btn-secondary px-4 py-2 text-xs">
            Explore Curriculum
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {featuredCurriculum.modules.map((module, index) => (
            <div key={module.id} className="card-strong p-6">
              <div
                className="relative h-40 overflow-hidden rounded-2xl border border-white/10"
                style={{
                  // Defensive sizing so `next/image` fill never escapes if utility CSS fails to load.
                  position: "relative",
                  height: "10rem",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={module.image}
                  alt={module.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
              <div className="flex items-center justify-between">
                <p className="mt-4 text-sm font-semibold text-brand-gold">
                  Week {index + 1}
                </p>
                <span className="text-xs text-ink-muted">4 lessons</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-ink">
                {module.title}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {module.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {module.lessons.slice(0, 2).map((lesson) => (
                  <span
                    key={lesson.id}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted"
                  >
                    {lesson.title}
                  </span>
                ))}
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted">
                  +2 more
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="tools">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Music Tools</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Practice tools by instrument
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Choose your instrument to access tailored tools and practice flows.
            </p>
          </div>
          <Link href="/tools" className="btn-secondary px-4 py-2 text-xs">
            Open Tools
          </Link>
        </div>
        <div className="mt-8">
          <ToolsGrid tools={featuredInstruments} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="card-strong p-8">
            <p className="text-sm font-semibold text-brand-gold">Reviews</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink">
              Rated 4.9 by Indian music learners
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Hear from students while exploring the most popular learning tracks.
            </p>
            <div className="mt-6 grid gap-4">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                  <p className="text-sm font-semibold text-ink">{plan.name}</p>
                  <p className="mt-2 text-xs text-ink-muted">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>
          <ReviewsCarousel reviews={reviews} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6" id="blog">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">Blog</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">
              Tips, training, and student success stories
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Read the latest insights from the academy.
            </p>
          </div>
          <Link href="/blog" className="btn-secondary px-4 py-2 text-xs">
            View All Posts
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-black via-black/80 to-black p-10 text-center shadow-lift">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-gold">
            Free Music Trial Class
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-ink">
            Only limited slots available this week
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Secure your free session and get a personalized practice plan.
          </p>
          <Link href="/book-trial" className="btn-primary mt-6">
            Book Trial
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
                A premium Indian music coaching experience
              </h3>
              <ul className="space-y-3 text-sm text-ink-muted">
                <li>- Personalized assessment</li>
                <li>- Live classes on {site.liveClassPlatforms}</li>
                <li>- Recorded lessons and replays</li>
                <li>- Performance feedback</li>
                <li>- Certification roadmap</li>
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
    </div>
  );
}


