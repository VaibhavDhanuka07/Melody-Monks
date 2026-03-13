import Link from "next/link";
import { site } from "@/data/site";

const upcomingClasses = [
  {
    id: "live-1",
    title: "Hindustani Vocal - Raag Yaman",
    time: "Saturday | 6:00 PM IST",
    mode: "Zoom Meeting",
  },
  {
    id: "live-2",
    title: "Bollywood Singing - Expression Clinic",
    time: "Sunday | 5:00 PM IST",
    mode: "Google Meet Session",
  },
  {
    id: "live-3",
    title: "Tabla Layakari Drill",
    time: "Tuesday | 7:00 PM IST",
    mode: "Zoom Meeting",
  },
];

export const metadata = {
  title: "Live Classes",
  description: "Join upcoming live classes on Google Meet or Zoom.",
};

export default function LiveClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Live Classes</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Upcoming live sessions
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Join live coaching on {site.liveClassPlatforms}, ask questions in real
          time, and review recordings after class.
        </p>
      </div>

      <div className="grid gap-4">
        {upcomingClasses.map((session) => (
          <div key={session.id} className="card-strong p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-ink">{session.title}</p>
                <p className="mt-2 text-sm text-ink-muted">{session.time}</p>
                <p className="mt-1 text-xs text-ink-muted">{session.mode}</p>
              </div>
              <Link href="/dashboard" className="btn-primary px-4 py-2 text-xs">
                Join Session
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 text-sm text-ink-muted">
        Recordings are uploaded within 24 hours. Visit the Lessons tab to replay
        any Google Meet or Zoom class.
      </div>
    </div>
  );
}
