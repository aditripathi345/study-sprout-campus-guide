import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, CalendarDays, ChevronRight, CircleCheck, ClipboardCheck, Clock, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { IconBubble, Panel, PanelHeader, Pill, SampleBadge } from "@/components/portal/ui";
import { useSession } from "@/lib/auth";
import { assignments, events, notices, priorityTone, statusTone, student, timetable } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_portal/dashboard")({
  head: () => pageHead("Dashboard", "Your academic overview: attendance, classes, deadlines, notices and events."),
  component: Dashboard,
});

const cards = [
  { icon: CircleCheck, label: "Attendance", value: "87%", sub: "Good standing", link: "View Details", to: "/attendance", bar: 87 },
  { icon: ClipboardCheck, label: "Pending Assignments", value: "3", sub: "Due this week", link: "View Assignments", to: "/assignments" },
  { icon: GraduationCap, label: "Next Examination", value: "DBMS", sub: "12 October • 19 days", link: "View Exam Schedule", to: "/exams" },
  { icon: CalendarDays, label: "Upcoming Event", value: "Tech Fest", sub: "25 October", link: "View Events", to: "/events" },
] as const;

function Dashboard() {
  const today = timetable.filter((c) => c.day === "Monday");
  const deadlines = assignments.filter((a) => a.status === "Pending").sort((a, b) => a.order - b.order);
  const [rsvp, setRsvp] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      <Panel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SampleBadge />
          <h2 className="mt-2 text-3xl font-bold text-foreground">Good Morning, {session?.user.name.split(" ")[0] ?? student.firstName} 👋</h2>
          <p className="mt-2 text-muted-foreground">Here's your academic overview for today.</p>
        </div>
        <AskButton />
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Panel key={c.label}>
            <div className="flex items-start justify-between"><IconBubble><c.icon /></IconBubble><SampleBadge /></div>
            <p className="mt-4 text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{c.value}</p>
            <p className="mt-3 text-sm text-muted-foreground">{c.sub}</p>
            {"bar" in c && <div className="mt-4 h-2 rounded-full bg-primary-soft"><div className="h-2 rounded-full bg-primary" style={{ width: `${c.bar}%` }} /></div>}
            <Link to={c.to} className="mt-5 inline-flex items-center gap-1 rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {c.link} <ChevronRight className="size-4" />
            </Link>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel>
          <PanelHeader title="Today's Classes" subtitle="Sample timetable values for the current day." />
          <div className="space-y-3">
            {today.map((c) => (
              <Link key={c.subject} to="/timetable" className={cn("flex flex-col gap-2 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                c.status === "Current" ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-secondary")}>
                <div>
                  <p className="font-semibold text-foreground">{c.subject}</p>
                  <p className="text-sm text-muted-foreground">{c.faculty} • {c.room}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-4" /> {c.time} <Pill tone={statusTone[c.status]}>{c.status}</Pill>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Upcoming Deadlines" subtitle="Assignment priorities and submission status." />
          <div className="space-y-3">
            {deadlines.map((a) => (
              <Link key={a.id} to="/assignments" className="block rounded-2xl border border-border p-4 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{a.title}</p>
                  <Pill tone={priorityTone[a.priority]}>{a.priority}</Pill>
                </div>
                <p className="text-sm text-muted-foreground">{a.shortSubject} • {a.due}</p>
                <Pill tone="warning" className="mt-3">{a.status}</Pill>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel>
          <PanelHeader title="Recent Notices" action={<Link to="/notices" className="text-sm font-medium text-primary hover:underline">View all</Link>} />
          <div className="space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div key={n.title} className="rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{n.title}</p>
                  <Pill tone={priorityTone[n.priority]}>{n.priority}</Pill>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.date} • {n.body}</p>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Upcoming Events" />
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-semibold text-foreground">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.date} • {e.place}</p>
                  </div>
                  <button onClick={() => { setRsvp((r) => ({ ...r, [e.id]: !r[e.id] })); toast.success(rsvp[e.id] ? `RSVP cancelled for ${e.title}` : `RSVP confirmed for ${e.title}`); }}
                    aria-pressed={!!rsvp[e.id]}
                    className={cn("rounded-full px-4 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      rsvp[e.id] ? "bg-success text-success-foreground" : "border border-border bg-card text-foreground hover:bg-secondary")}>
                    {rsvp[e.id] ? "Going" : "RSVP"}
                  </button>
                </div>
              ))}
            </div>
          </Panel>
          <Panel className="bg-primary-soft">
            <h2 className="font-semibold text-foreground">Need help?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Ask the AI Campus Assistant about your timetable, exams, assignments, notices or campus services.</p>
            <div className="mt-4"><AskButton /></div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function AskButton() {
  return (
    <Link to="/assistant" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <Bot className="size-4" /> Ask AI Assistant
    </Link>
  );
}
