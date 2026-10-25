import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { EmptyState, Panel, Pill, Segmented } from "@/components/portal/ui";
import { days, statusTone, timetable } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_portal/timetable")({
  head: () => pageHead("Timetable", "Your weekly class timetable with faculty, rooms and timings."),
  component: Timetable,
});

const filters = ["Today", "Week", "All"] as const;

function Timetable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [day, setDay] = useState<string | null>(null);
  let list = timetable;
  if (filter === "Today") list = list.filter((c) => c.day === "Monday");
  if (day) list = list.filter((c) => c.day === day);

  return (
    <div className="space-y-4">
      <Panel className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3"><span className="text-sm font-medium text-muted-foreground">Filter</span><Segmented label="Timetable range" options={filters} value={filter} onChange={(v) => { setFilter(v); setDay(null); }} /></div>
        <div className="flex flex-wrap gap-2">
          {days.map((d) => (
            <button key={d} onClick={() => setDay(day === d ? null : d)} aria-pressed={day === d}
              className={cn("rounded-full border px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                day === d ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-secondary")}>{d}</button>
          ))}
        </div>
      </Panel>
      {!list.length && <EmptyState title="No classes" text="There are no classes for this selection." />}
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((c, i) => (
          <div key={i} className={cn("rounded-2xl border p-4 shadow-soft", c.status === "Current" ? "border-primary bg-primary-soft" : "border-border bg-card")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{c.day}</p>
                <p className="font-semibold text-foreground">{c.subject}</p>
                <p className="text-sm text-muted-foreground">{c.faculty} • {c.room}</p>
              </div>
              <Pill tone={statusTone[c.status]}>{c.status}</Pill>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" /> {c.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
