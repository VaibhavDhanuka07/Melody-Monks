import Link from "next/link";

const courseList = [
  {
    title: "Piano Mastery",
    instrument: "Piano",
    level: "Beginner to Advanced",
    description:
      "From foundational finger technique to expressive performances with live feedback.",
    price: "INR 2000/month",
  },
  {
    title: "Guitar Foundations",
    instrument: "Guitar",
    level: "Beginner to Intermediate",
    description:
      "Chord fluency, rhythm practice, and improvisation labs with global coaches.",
    price: "INR 2200/month",
  },
  {
    title: "Vocal Studio",
    instrument: "Vocal",
    level: "All Levels",
    description:
      "Breath control, vocal range training, and performance confidence building.",
    price: "INR 2400/month",
  },
  {
    title: "Drum Lab",
    instrument: "Drums",
    level: "Beginner to Advanced",
    description:
      "Groove building, timing accuracy, and high-energy live sessions.",
    price: "INR 2600/month",
  },
  {
    title: "Violin Pathway",
    instrument: "Violin",
    level: "Beginner to Intermediate",
    description:
      "Bow control, ear training, and repertoire development for classical pieces.",
    price: "INR 2300/month",
  },
];

export const metadata = {
  title: "Courses",
  description: "Explore piano, guitar, vocal, drum, and violin courses.",
};

export default function CoursesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-indigo">Courses</p>
          <h1 className="mt-2 text-4xl font-semibold text-ink">
            Pick your instrument and build a custom roadmap
          </h1>
        </div>
        <Link
          href="/book-trial"
          className="btn-accent"
        >
          Book a Trial Class
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {courseList.map((course) => (
          <div
            key={course.title}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-ink">{course.title}</p>
                <p className="text-sm text-ink-muted">{course.instrument}</p>
              </div>
              <span className="rounded-full bg-brand-indigo/10 px-3 py-1 text-xs font-semibold text-brand-indigo">
                {course.level}
              </span>
            </div>
            <p className="mt-4 text-sm text-ink-muted">{course.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">{course.price}</span>
              <Link
                href="/book-trial"
                className="text-sm font-semibold text-brand-indigo"
              >
                Enroll
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
