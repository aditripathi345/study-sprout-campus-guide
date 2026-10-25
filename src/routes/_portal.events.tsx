import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, Panel, Pill, Segmented } from "@/components/portal/ui";
import { events } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_portal/events")({
  head: () => pageHead("College Events", "Discover campus events and RSVP."),
  component: Events,
});

const views = ["Upcoming events", "Past events", "Calendar view"] as const;

function Events() {
  const [view, setView] = useState<(typeof views)[number]>("Upcoming events");
  const [rsvp, setRsvp] = useState<Record<string, boolean>>({});
  const list = events.filter((e) => (view === "Past events" ? e.past : !e.past));

  function toggle(id: string, title: string) {
    const next = !rsvp[id];
    setRsvp((r) => ({ ...r, [id]: next }));
    toast.success(next ? `RSVP confirmed for ${title}` : `RSVP cancelled for ${title}`);
  }

  return (
    <div className="space-y-4">
      <Segmented label="Event view" options={views} value={view} onChange={setView} />
      {view === "Calendar view" ? (
        <Panel>
          <div className="space-y-3">
            {[...events].sort((a, b) => (a.date.includes("September") ? -1 : 1) - (b.date.includes("September") ? -1 : 1)).map((e) => (
              <div key={e.id} className="flex items-center gap-4 rounded-2xl border border-border p-4">
                <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary"><CalendarDays className="size-5" /></span>
                <div><p className="font-semibold text-foreground">{e.date} • {e.time}</p><p className="text-sm text-muted-foreground">{e.title} — {e.place}</p></div>
              </div>
            ))}
          </div>
        </Panel>
      ) : !list.length ? (
        <EmptyState title="No past events" text="Events you attended will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((e) => (
            <Panel key={e.id}>
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-lg font-semibold text-foreground">{e.title}</p><p className="text-sm text-muted-foreground">{e.org}</p></div>
                <Pill tone="primary">Upcoming</Pill>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{e.desc}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-foreground"><CalendarDays className="size-4 text-primary" /> {e.date} • {e.time}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-foreground"><MapPin className="size-4 text-primary" /> {e.place}</p>
              <button onClick={() => toggle(e.id, e.title)} aria-pressed={!!rsvp[e.id]}
                className={cn("mt-4 h-9 w-full rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  rsvp[e.id] ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                {rsvp[e.id] ? "Going ✓" : "RSVP"}
              </button>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
