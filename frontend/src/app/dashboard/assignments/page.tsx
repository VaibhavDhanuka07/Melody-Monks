import Link from "next/link";

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-brand-gold">Assignments</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">
          Weekly practice assignments
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Submit recordings and notes for instructor feedback.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          {
            title: "Week 8: Musical Expression",
            detail: "Record 60 seconds of the lesson piece with dynamics.",
          },
          {
            title: "Week 9: Harmony",
            detail: "Practice chord inversions and submit a short clip.",
          },
          {
            title: "Week 10: Improvisation",
            detail: "Create a 4-bar improvisation in C major.",
          },
        ].map((assignment) => (
          <div key={assignment.title} className="card p-6">
            <p className="text-lg font-semibold text-ink">{assignment.title}</p>
            <p className="mt-2 text-sm text-ink-muted">{assignment.detail}</p>
            <Link href="/dashboard/performance-upload" className="btn-secondary mt-4">
              Submit Recording
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
