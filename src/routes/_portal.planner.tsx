import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, CalendarClock, Loader2, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, Panel, PanelHeader, Pill } from "@/components/portal/ui";
import { getToken } from "@/lib/auth";
import { askAssistant } from "@/lib/assistant.functions";
import { assignments, exams } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/planner")({
  head: () => pageHead("AI Study Planner", "Add assignments and exams, then let AI build a prioritized study plan."),
  component: Planner,
});

interface Item { id: string; type: "Assignment" | "Exam"; title: string; subject: string; due: string }
const initial: Item[] = [
  ...[assignments[4]!, assignments[2]!, assignments[3]!].map((a) => ({ id: a.id, type: "Assignment" as const, title: a.title, subject: a.shortSubject, due: a.due })),
  ...exams.map((e, i) => ({ id: `x${i}`, type: "Exam" as const, title: `${e.subject} ${e.type === "Practical" ? "Practical" : "Mid Semester"}`, subject: e.subject, due: `${e.date} ${e.time}` })),
];
const field = "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive";

function Planner() {
  const ask = useServerFn(askAssistant);
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ type: "Assignment" as Item["type"], date: "", title: "", subject: "" });
  const [errs, setErrs] = useState<{ title?: string; subject?: string; date?: string }>({});
  const [hours, setHours] = useState(3);
  const [plan, setPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function add(e: FormEvent) {
    e.preventDefault();
    const er: { title?: string; subject?: string; date?: string } = {};
    if (!form.title.trim()) er.title = "Title is required.";
    if (!form.subject.trim()) er.subject = "Subject is required.";
    if (!form.date) er.date = "Pick a date.";
    setErrs(er);
    if (Object.keys(er).length) return;
    const due = new Date(form.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
    setItems((l) => [...l, { id: crypto.randomUUID(), type: form.type, title: form.title.trim(), subject: form.subject.trim(), due }]);
    setForm({ type: form.type, date: "", title: "", subject: "" });
    toast.success("Item added");
  }

  async function generate() {
    if (!items.length) return;
    setLoading(true); setError(null); setPlan(null);
    const prompt = `Create a prioritized study plan for ${hours} study hours per day covering:\n` + items.map((i) => `- ${i.type}: ${i.title} (${i.subject}) due ${i.due}`).join("\n");
    try {
      const token = getToken();
      if (!token) throw new Error("signed out");
      const res = await ask({ data: { token, message: prompt, mode: "study-plan" } });
      if (res.ok) setPlan(res.reply); else setError(res.error);
    } catch {
      setError("Something went wrong while generating the plan.");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      <Panel>
        <PanelHeader icon={<CalendarClock className="size-5 text-primary" />} title="Your deadlines" subtitle="Add assignments and exams, then let AI build a prioritized plan." />
        <div className="space-y-2">
          {!items.length && <EmptyState title="No deadlines yet" text="Add an assignment or exam below." />}
          {items.map((i) => (
            <div key={i.id} className="flex items-start justify-between gap-2 rounded-2xl border border-border p-3">
              <div>
                <Pill tone={i.type === "Exam" ? "primary" : "muted"}>{i.type}</Pill>
                <p className="mt-2 font-medium text-foreground">{i.title}</p>
                <p className="text-xs text-muted-foreground">{i.subject} • {i.due}</p>
              </div>
              <button onClick={() => setItems((l) => l.filter((x) => x.id !== i.id))} aria-label={`Remove ${i.title}`} className="rounded-lg p-2 text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={add} noValidate className="mt-4 grid gap-3 rounded-2xl border border-dashed border-border p-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-foreground">Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Item["type"] })} className={`${field} mt-1`}>
              <option>Assignment</option><option>Exam</option>
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">Due / exam date
            <input type="date" value={form.date} aria-invalid={!!errs.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${field} mt-1`} />
            {errs.date && <span className="text-xs font-normal text-destructive">{errs.date}</span>}
          </label>
          <label className="text-sm font-medium text-foreground">Title
            <input value={form.title} aria-invalid={!!errs.title} placeholder="e.g. CN Lab Record" onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${field} mt-1`} />
            {errs.title && <span className="text-xs font-normal text-destructive">{errs.title}</span>}
          </label>
          <label className="text-sm font-medium text-foreground">Subject
            <input value={form.subject} aria-invalid={!!errs.subject} placeholder="e.g. Computer Networks" onChange={(e) => setForm({ ...form, subject: e.target.value })} className={`${field} mt-1`} />
            {errs.subject && <span className="text-xs font-normal text-destructive">{errs.subject}</span>}
          </label>
          <button type="submit" className="h-10 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary sm:col-span-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Add item</button>
        </form>

        <label className="mt-4 block text-sm font-medium text-foreground">Study hours per day
          <input type="number" min={1} max={12} value={hours} onChange={(e) => setHours(Math.min(12, Math.max(1, Number(e.target.value) || 1)))} className={`${field} mt-1`} />
        </label>
        <button onClick={generate} disabled={loading || !items.length} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate study plan
        </button>
      </Panel>

      <Panel>
        <PanelHeader icon={<Sparkles className="size-5 text-primary" />} title="AI study plan" subtitle="Your prioritized plan will appear here." />
        {loading && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Building your plan…</p>}
        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-2xl bg-destructive-soft p-4 text-sm text-destructive">
            <span className="flex items-start gap-2"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</span>
            <button onClick={generate} className="w-fit rounded-full border border-destructive/40 bg-card px-3 py-1.5 font-medium">Retry</button>
          </div>
        )}
        {plan && <div className="whitespace-pre-wrap text-sm leading-6 text-foreground">{plan}</div>}
        {!loading && !error && !plan && <p className="text-sm text-muted-foreground">Review your deadlines on the left and press “Generate study plan”.</p>}
      </Panel>
    </div>
  );
}
