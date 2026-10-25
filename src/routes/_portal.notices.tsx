import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, Panel, Pill, Segmented } from "@/components/portal/ui";
import { noticeCategories, notices, priorityTone } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/notices")({
  head: () => pageHead("Notices", "Academic, examination, event and administrative notices."),
  component: Notices,
});

function Notices() {
  const [cat, setCat] = useState<(typeof noticeCategories)[number]>("All");
  const [open, setOpen] = useState<(typeof notices)[number] | null>(null);
  const list = notices.filter((n) => cat === "All" || n.category === cat);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3"><span className="text-sm font-medium text-muted-foreground">Filter</span><Segmented label="Notice category" options={noticeCategories} value={cat} onChange={setCat} /></div>
      {!list.length && <EmptyState title="No notices" text="There are no notices in this category." />}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((n) => (
          <Panel key={n.title}>
            <div className="flex items-start justify-between gap-2">
              <div><p className="font-semibold text-foreground">{n.title}</p><p className="text-sm text-muted-foreground">{n.category} • {n.date}</p></div>
              <Pill tone={priorityTone[n.priority]}>{n.priority}</Pill>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{n.body}</p>
            <button onClick={() => setOpen(n)} className="mt-4 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Read more</button>
          </Panel>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-3xl">
          {open && (
            <>
              <DialogHeader><DialogTitle>{open.title}</DialogTitle><DialogDescription>{open.category} • {open.date}</DialogDescription></DialogHeader>
              <Pill tone={priorityTone[open.priority]} className="w-fit">{open.priority}</Pill>
              <p className="text-sm text-foreground">{open.body}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
