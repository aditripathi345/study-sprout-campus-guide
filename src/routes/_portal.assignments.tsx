import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CloudUpload, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState, Panel, Pill, Segmented } from "@/components/portal/ui";
import { assignments as seed, priorityTone, statusTone, type Assignment } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/assignments")({
  head: () => pageHead("Assignments", "Track, filter and submit your assignments."),
  component: Assignments,
});

const tabs = ["All", "Pending", "Submitted", "Overdue"] as const;

function Assignments() {
  const [list, setList] = useState(seed);
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [asc, setAsc] = useState(true);
  const [open, setOpen] = useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState("");

  const shown = useMemo(() => list
    .filter((a) => tab === "All" || a.status === tab)
    .filter((a) => subject === "All Subjects" || a.subject === subject)
    .filter((a) => `${a.title} ${a.subject} ${a.faculty}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (asc ? a.order - b.order : b.order - a.order)), [list, tab, subject, q, asc]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!open) return;
    if (!file) return setFileErr("Choose a file to upload.");
    if (file.size > 10 * 1024 * 1024) return setFileErr("File must be under 10 MB.");
    setList((l) => l.map((a) => (a.id === open.id ? { ...a, status: "Submitted" } : a)));
    toast.success(`Submitted “${open.title}”`);
    setOpen(null);
  }

  return (
    <div className="space-y-4">
      <Panel className="grid gap-3 p-4 md:grid-cols-[1fr_14rem_12rem]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search assignments" placeholder="Search assignments" className="h-9 w-full rounded-full border border-input bg-card pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <select aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-full border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option>All Subjects</option>
          {[...new Set(seed.map((a) => a.subject))].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setAsc((v) => !v)} className="h-9 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Sort by due date {asc ? "↑" : "↓"}
        </button>
      </Panel>
      <Segmented label="Status" options={tabs} value={tab} onChange={setTab} />
      {!shown.length && <EmptyState title="No assignments found" text="Try a different search or filter." />}
      <div className="grid gap-4 md:grid-cols-2">
        {shown.map((a) => (
          <Panel key={a.id}>
            <div className="flex items-start justify-between gap-2">
              <div><p className="font-semibold text-foreground">{a.title}</p><p className="text-sm text-muted-foreground">{a.subject} • {a.faculty}</p></div>
              <Pill tone={priorityTone[a.priority]}>{a.priority}</Pill>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Due: {a.due}</p>
            <Pill tone={statusTone[a.status]} className="mt-3">{a.status}</Pill>
            <button onClick={() => { setOpen(a); setFile(null); setFileErr(""); }} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <CloudUpload className="size-4" /> View / Submit
            </button>
          </Panel>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-3xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription>{open.subject} • {open.faculty} • Due: {open.due}</DialogDescription>
              </DialogHeader>
              <p className="text-sm text-foreground">{open.description}</p>
              <div className="flex gap-2"><Pill tone={priorityTone[open.priority]}>{open.priority}</Pill><Pill tone={statusTone[open.status]}>{open.status}</Pill></div>
              {open.status === "Submitted" ? (
                <p className="rounded-2xl bg-success p-3 text-sm text-success-foreground">This assignment has been submitted.</p>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">Upload your work
                    <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setFileErr(""); }}
                      className="mt-1 block w-full rounded-xl border border-dashed border-border p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary-soft file:px-3 file:py-1 file:text-primary" />
                  </label>
                  {fileErr && <p className="text-xs text-destructive">{fileErr}</p>}
                  <button type="submit" className="h-10 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Submit assignment</button>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
