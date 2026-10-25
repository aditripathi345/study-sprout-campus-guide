import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, CalendarDays, CircleCheck, ClipboardCheck, FileText, GraduationCap } from "lucide-react";
import { IconBubble, Logo, SampleBadge } from "@/components/portal/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Campus Assistant — SRM IST Delhi NCR Campus" },
      { name: "description", content: "Your timetable, attendance, assignments, examinations, notices and campus services in one intelligent platform." },
      { property: "og:title", content: "AI Campus Assistant — SRM IST Delhi NCR Campus" },
      { property: "og:description", content: "Your Campus. One Intelligent Assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: ClipboardCheck, title: "Smart Dashboard", text: "Academic overview with attendance, classes, deadlines and notices." },
  { icon: Bot, title: "AI Campus Assistant", text: "A dedicated assistant interface for campus questions and summaries." },
  { icon: CircleCheck, title: "Attendance Tracking", text: "Subject-wise attendance with demo progress and history views." },
  { icon: FileText, title: "Assignment Management", text: "Submission states, filters, detail modals and upload-ready screens." },
  { icon: GraduationCap, title: "Examination Schedule", text: "Upcoming exam list with calendar and room information." },
  { icon: CalendarDays, title: "College Events", text: "Event discovery, RSVP interactions and campus activity tracking." },
];
const flow = ["Student", "Authentication", "React Dashboard", "Backend APIs", "Academic Database / Campus APIs", "AI Processing", "Personalized Response"];

const stats = [
  { icon: CircleCheck, label: "Attendance", value: "87%", sub: "Good standing", bar: 87 },
  { icon: ClipboardCheck, label: "Pending Assignments", value: "3", sub: "Due this week" },
  { icon: GraduationCap, label: "Next Exam", value: "DBMS", sub: "12 October" },
  { icon: CalendarDays, label: "Upcoming Event", value: "Tech Fest", sub: "25 October" },
];

function scrollToFeatures() {
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
}

function Landing() {
  return (
    <div className="min-h-screen bg-app">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Logo />
            <div>
              <p className="font-bold leading-tight text-foreground">AI Campus Assistant</p>
              <p className="text-xs text-muted-foreground">SRM IST Delhi NCR Campus</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <button onClick={scrollToFeatures} className="hidden rounded-lg px-2 py-1 text-sm font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:block">
              Explore Features
            </button>
            <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-hero">
        <div className="grid items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">Advanced Programming Practice Project</span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.15] tracking-tight text-foreground md:text-6xl">
              Your Campus.
              <br />
              <span className="text-primary">One Intelligent Assistant.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              AI Campus Assistant brings your timetable, attendance, assignments, examinations, notices and campus services together in one intelligent platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Login <ArrowRight className="size-4" />
              </Link>
              <button onClick={scrollToFeatures} className="rounded-full border border-border bg-card px-8 py-2.5 text-sm font-medium text-foreground shadow-soft hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Explore Features
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-elevated">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Student Overview</p>
                <p className="text-xl font-bold text-foreground">Good Morning, Devagya</p>
              </div>
              <SampleBadge />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between"><IconBubble><s.icon /></IconBubble><SampleBadge /></div>
                  <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{s.sub}</p>
                  {s.bar && <div className="mt-4 h-2 rounded-full bg-primary-soft"><div className="h-2 rounded-full bg-primary" style={{ width: `${s.bar}%` }} /></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 px-4 py-16">
        <h2 className="text-lg font-bold text-foreground">A complete university SaaS dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">Built as a polished frontend demonstration for B.Tech CSE 2nd Year APP.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <IconBubble><f.icon /></IconBubble>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 pt-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h2 className="text-lg font-bold text-foreground">Demo workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">Frontend architecture prepared for Node.js, Express.js, MongoDB, JWT and Gemini integration.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {flow.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="grid min-h-20 w-full place-items-center rounded-2xl border border-border bg-secondary p-3 text-center text-sm font-semibold text-foreground">{step}</div>
                {i < flow.length - 1 && <ArrowRight className="size-4 text-primary" aria-hidden />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="flex flex-col justify-between gap-3 px-4 py-8 text-sm md:flex-row md:items-center">
          <div>
            <p className="font-semibold text-foreground">AI Campus Assistant</p>
            <p className="text-muted-foreground">Advanced Programming Practice • B.Tech CSE — 2nd Year • SRM IST Delhi NCR Campus</p>
          </div>
          <p className="text-muted-foreground">Team: Devagya Triphati, Aryan Srivastava, Harsh Gupta</p>
        </div>
      </footer>
    </div>
  );
}
