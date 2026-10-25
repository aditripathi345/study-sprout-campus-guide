import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeader, Pill, Segmented } from "@/components/portal/ui";
import { exams } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/exams")({
  head: () => pageHead("Examinations", "Upcoming exam schedule with dates, times and rooms."),
  component: Exams,
});

const filters = ["All", "Mid Semester", "Practical"] as const;

function download() {
  const text = exams.map((e) => `${e.date}\t${e.time}\t${e.subject} (${e.type})\t${e.room}`).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([`Exam Schedule\n\n${text}\n`], { type: "text/plain" }));
  a.download = "exam-schedule.txt";
  a.click();
  URL.revokeObjectURL(a.href);
  toast.success("Schedule downloaded");
}

function Exams() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const list = exams.filter((e) => f === "All" || e.type === f);
  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center gap-3"><span className="text-sm font-medium text-muted-foreground">Filter</span><Segmented label="Exam type" options={filters} value={f} onChange={setF} /></div>
        {list.map((e) => (
          <Panel key={e.subject}>
            <div className="flex items-start justify-between gap-2">
              <div><p className="text-lg font-semibold text-foreground">{e.subject}</p><p className="text-sm text-muted-foreground">{e.type} • {e.place}</p></div>
              <Pill tone="primary">{e.days} days</Pill>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[[e.date, "Date"], [e.time, "Time"], [e.room, "Room"]].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-secondary p-3"><p className="font-semibold text-foreground">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
      <Panel className="h-fit">
        <PanelHeader title="Exam Calendar" subtitle="Clean calendar-style overview." />
        <div className="space-y-3">
          {exams.map((e) => (
            <div key={e.subject} className="flex items-center gap-3 rounded-2xl border border-border p-3">
              <div className="grid size-12 place-items-center rounded-xl bg-primary-soft text-center text-primary">
                <span className="text-sm font-bold leading-none">{e.date.split(" ")[0]}<br /><span className="text-[10px] font-medium">OCT</span></span>
              </div>
              <div><p className="font-medium text-foreground">{e.date}</p><p className="text-sm text-muted-foreground">{e.subject} • {e.time}</p></div>
            </div>
          ))}
        </div>
        <button onClick={download} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Download className="size-4" /> Download schedule
        </button>
      </Panel>
    </div>
  );
}
