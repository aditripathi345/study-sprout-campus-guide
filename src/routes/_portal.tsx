import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, BookOpen, Bot, CalendarDays, ChartColumn, ClipboardCheck, GraduationCap, LayoutGrid,
  LogOut, Menu, Search, Settings, UserCircle, CircleUserRound, type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo, Pill, SampleBadge } from "@/components/portal/ui";
import { clearSession, useSession } from "@/lib/auth";
import { notices, priorityTone, student } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_portal")({ component: PortalLayout });

type NavPath = "/dashboard" | "/assistant" | "/planner" | "/timetable" | "/attendance" | "/assignments" | "/exams" | "/notices" | "/events" | "/services" | "/profile" | "/settings";
const nav: { to: NavPath; label: string; title: string; icon: LucideIcon; keywords: string[] }[] = [
  { to: "/dashboard", label: "Dashboard", title: "Dashboard", icon: LayoutGrid, keywords: ["dashboard", "home", "overview"] },
  { to: "/assistant", label: "AI Assistant", title: "AI Assistant", icon: Bot, keywords: ["ai", "assistant", "chat", "ask"] },
  { to: "/planner", label: "Study Planner", title: "AI Study Planner", icon: Bot, keywords: ["study", "plan", "planner"] },
  { to: "/timetable", label: "Timetable", title: "Timetable", icon: CalendarDays, keywords: ["timetable", "class", "schedule", "lecture"] },
  { to: "/attendance", label: "Attendance", title: "Attendance", icon: ChartColumn, keywords: ["attendance", "present", "absent"] },
  { to: "/assignments", label: "Assignments", title: "Assignments", icon: ClipboardCheck, keywords: ["assignment", "homework", "submit", "deadline"] },
  { to: "/exams", label: "Examinations", title: "Examinations", icon: GraduationCap, keywords: ["exam", "dbms", "test", "mid semester", "practical"] },
  { to: "/notices", label: "Notices", title: "Notices", icon: BookOpen, keywords: ["notice", "announcement", "circular"] },
  { to: "/events", label: "College Events", title: "College Events", icon: CalendarDays, keywords: ["event", "fest", "workshop", "rsvp"] },
  { to: "/services", label: "Campus Services", title: "Campus Services", icon: CircleUserRound, keywords: ["library", "cafeteria", "transport", "hostel", "lab", "sports", "helpdesk", "service", "wifi"] },
  { to: "/profile", label: "Profile", title: "Profile", icon: UserCircle, keywords: ["profile", "account", "registration"] },
  { to: "/settings", label: "Settings", title: "Settings", icon: Settings, keywords: ["settings", "preferences", "notifications"] },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col p-5">
      <Link to="/dashboard" onClick={onNavigate} className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Logo />
        <div>
          <p className="text-sm font-bold text-foreground">AI Campus Assistant</p>
          <p className="text-xs text-muted-foreground">SRM IST Delhi NCR</p>
        </div>
      </Link>
      <nav className="mt-8 space-y-1" aria-label="Portal">
        {nav.map((n) => {
          const active = path === n.to;
          return (
            <Link key={n.to} to={n.to} onClick={onNavigate} aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-border bg-card p-4 shadow-soft">
        <SampleBadge />
        <p className="mt-2 text-xs leading-5 text-muted-foreground">Portal values are demo UI data for the APP project presentation.</p>
      </div>
    </div>
  );
}

function PortalLayout() {
  const session = useSession();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (session === null) navigate({ to: "/login", replace: true });
  }, [session, navigate]);

  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-app" role="status">
        <p className="text-sm text-muted-foreground">Loading your portal…</p>
      </div>
    );
  }

  const current = nav.find((n) => n.to === path);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const hit = nav.find((n) => n.keywords.some((k) => q.includes(k) || k.includes(q)));
    if (hit) {
      navigate({ to: hit.to });
      setQuery("");
    } else toast.error(`No results for “${query.trim()}”`);
  }

  function logout() {
    clearSession();
    toast.success("Logged out");
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-app">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 md:px-8">
            <button aria-label="Open navigation" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full border border-border bg-card lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 shrink-0 md:w-44">
              <h1 className="truncate text-2xl font-bold text-foreground">{current?.title ?? "Portal"}</h1>
              <p className="hidden text-sm text-muted-foreground md:block">B.Tech CSE 2nd Year APP Team Project</p>
            </div>
            <form onSubmit={onSearch} role="search" className="relative ml-auto hidden max-w-md flex-1 md:block lg:ml-4">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search portal" placeholder="Search DBMS, exam, library..."
                className="h-10 w-full rounded-full border border-input bg-card pl-9 pr-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </form>
            <div className="ml-auto flex items-center gap-2 md:ml-0">
              <DropdownMenu>
                <DropdownMenuTrigger aria-label="Open notifications" className="relative grid size-10 place-items-center rounded-full border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Bell className="size-4" />
                  <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notices.slice(0, 3).map((n) => (
                    <DropdownMenuItem key={n.title} onSelect={() => navigate({ to: "/notices" })} className="flex flex-col items-start gap-1">
                      <span className="flex w-full items-center justify-between gap-2 font-medium">{n.title}<Pill tone={priorityTone[n.priority]}>{n.priority}</Pill></span>
                      <span className="text-xs text-muted-foreground">{n.date}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/assistant" className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 sm:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Bot className="size-4" /> Ask AI
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger aria-label="Open profile menu" className="flex items-center gap-3 rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">{student.initials}</span>
                  <span className="hidden text-left xl:block">
                    <span className="block text-sm font-semibold text-foreground">{student.name}</span>
                    <span className="block text-xs capitalize text-muted-foreground">{session.role}</span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Logged in as {session.role}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate({ to: "/profile" })}><UserCircle className="size-4" /> Profile</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}><Settings className="size-4" /> Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={logout}><LogOut className="size-4" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
