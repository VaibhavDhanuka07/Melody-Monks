import Link from "next/link";
import ToolsGrid from "@/components/site/ToolsGrid";
import { instruments } from "@/data/instruments";
import type { Tool } from "@/data/tools";

export const metadata = {
  title: "Practice Tools",
  description: "Access practice tools for every instrument.",
};

export default function DashboardToolsPage() {
  const instrumentTools: Tool[] = instruments.map((instrument) => ({
    id: instrument.id,
    name: instrument.name,
    description: instrument.description,
    href: instrument.href,
    toolType: "Instrument Tools",
    badge: instrument.highlight,
    instrument: instrument.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-gold">Tools</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            Practice tools by instrument
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Launch metronomes, tuners, and trainers directly from your dashboard.
          </p>
        </div>
        <Link href="/tools" className="btn-secondary px-4 py-2 text-xs">
          View Full Tools Hub
        </Link>
      </div>

      <ToolsGrid tools={instrumentTools} />
    </div>
  );
}
