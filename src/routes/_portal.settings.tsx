import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Panel } from "@/components/portal/ui";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/settings")({
  head: () => pageHead("Settings", "Account, notifications, privacy, appearance and assistant preferences."),
  component: SettingsPage,
});

const items = ["Email notifications", "Assignment reminders", "Exam reminders", "Event notifications", "Notice notifications", "AI Assistant Preferences", "Privacy controls", "Light appearance mode"];
const KEY = "campus-assistant-settings";

function SettingsPage() {
  const [state, setState] = useState<Record<string, boolean>>(() => Object.fromEntries(items.map((i) => [i, true])));
  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setState((p) => ({ ...p, ...JSON.parse(s) })); } catch { /* ignore */ }
  }, []);

  function toggle(name: string, v: boolean) {
    const next = { ...state, [name]: v };
    setState(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    toast.success(`${name} ${v ? "enabled" : "disabled"}`);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((name) => (
        <Panel key={name} className="flex items-center justify-between gap-4">
          <div>
            <p id={`s-${name}`} className="font-semibold text-foreground">{name}</p>
            <p className="mt-1 text-sm text-muted-foreground">Account, notifications, privacy, appearance and assistant preference settings.</p>
          </div>
          <Switch aria-labelledby={`s-${name}`} checked={state[name]} onCheckedChange={(v) => toggle(name, v)} />
        </Panel>
      ))}
    </div>
  );
}
