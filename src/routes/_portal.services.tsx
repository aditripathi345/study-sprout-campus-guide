import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bus, Clock, Coffee, Dumbbell, FlaskConical, Home, LifeBuoy, Monitor } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconBubble, Panel } from "@/components/portal/ui";
import { services } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/services")({
  head: () => pageHead("Campus Services", "Library, cafeteria, transport, hostel, labs, sports and student support."),
  component: Services,
});

const icons = [BookOpen, Coffee, Bus, Home, FlaskConical, Dumbbell, LifeBuoy, Monitor];

function Services() {
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (msg.trim().length < 10) return setErr("Please describe your request in at least 10 characters.");
    toast.success(`Request sent to ${open}`);
    setOpen(null);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((s, i) => {
          const Icon = icons[i];
          return (
            <Panel key={s.name} className="flex flex-col">
              <IconBubble><Icon /></IconBubble>
              <p className="mt-4 font-semibold text-foreground">{s.name}</p>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.desc}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-foreground"><Clock className="size-4 text-primary" /> {s.hours}</p>
              <button onClick={() => { setOpen(s.name); setMsg(""); setErr(""); }} className="mt-4 h-9 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Contact / Help
              </button>
            </Panel>
          );
        })}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle>Contact {open}</DialogTitle><DialogDescription>Describe what you need help with.</DialogDescription></DialogHeader>
          <form onSubmit={submit} noValidate className="space-y-3">
            <textarea value={msg} onChange={(e) => { setMsg(e.target.value); setErr(""); }} rows={4} aria-label="Your request" aria-invalid={!!err}
              className="w-full rounded-xl border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive" />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button type="submit" className="h-10 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">Send request</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
