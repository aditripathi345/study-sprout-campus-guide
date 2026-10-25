import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Panel, PanelHeader, Pill, SampleBadge } from "@/components/portal/ui";
import { attendanceHistory, attendanceSubjects, statusTone } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/attendance")({
  head: () => pageHead("Attendance", "Overall and subject-wise attendance with history records."),
  component: Attendance,
});

function exportCsv() {
  const rows = [["Date", "Subject", "Status"], ...attendanceHistory.map((h) => [h.date, h.subject, h.status])];
  const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "attendance.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  toast.success("Attendance exported");
}

function Attendance() {
  const [subject, setSubject] = useState("All Subjects");
  const list = subject === "All Subjects" ? attendanceSubjects : attendanceSubjects.filter((s) => s.subject === subject);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <Panel>
          <div className="flex items-center justify-between"><h2 className="font-semibold text-foreground">Overall Attendance</h2><SampleBadge /></div>
          <div className="mx-auto mt-6 grid size-40 place-items-center rounded-full" style={{ background: "conic-gradient(var(--primary) 87%, var(--primary-soft) 0)" }}>
            <div className="grid size-32 place-items-center rounded-full bg-card text-center">
              <div><p className="text-3xl font-bold text-foreground">87%</p><p className="text-xs text-muted-foreground">Demo data</p></div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {[["119", "Present", "success"], ["12", "Absent", "danger"], ["5", "Late", "warning"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-secondary p-3"><p className="text-xl font-bold text-foreground">{n}</p><p className="text-xs text-muted-foreground">{l}</p></div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Subject-wise Attendance" subtitle="Progress bars and class counts." action={
            <select aria-label="Filter subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option>All Subjects</option>
              {attendanceSubjects.map((s) => <option key={s.subject}>{s.subject}</option>)}
            </select>} />
          <div className="space-y-4">
            {list.map((s) => (
              <div key={s.subject} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div><p className="font-semibold text-foreground">{s.subject}</p><p className="text-sm text-muted-foreground">{s.present}/{s.total} classes</p></div>
                  <p className="text-lg font-bold text-foreground">{s.pct}%</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-primary-soft"><div className="h-2 rounded-full bg-primary" style={{ width: `${s.pct}%` }} /></div>
                <div className="mt-3 flex flex-wrap gap-2"><Pill tone="success">Present {s.present}</Pill><Pill tone="danger">Absent {s.absent}</Pill><Pill tone="warning">Late {s.late}</Pill></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel>
        <PanelHeader title="Attendance History" subtitle="Monthly view sample records." action={
          <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Download className="size-4" /> Export attendance</button>} />
        <div className="divide-y divide-border">
          {attendanceHistory.map((h) => (
            <div key={h.date} className="flex items-center justify-between py-3 text-sm">
              <span className="w-20 text-muted-foreground">{h.date}</span>
              <span className="flex-1 font-medium text-foreground">{h.subject}</span>
              <Pill tone={statusTone[h.status]}>{h.status}</Pill>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
