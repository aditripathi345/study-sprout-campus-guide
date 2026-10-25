import type { ReactNode } from "react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/demo-data";

const toneClass: Record<Tone, string> = {
  demo: "bg-demo text-demo-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-destructive-soft text-destructive",
  primary: "bg-primary text-primary-foreground",
  muted: "bg-secondary text-secondary-foreground",
};

export function Pill({ tone = "muted", children, className }: { tone?: Tone | undefined; children: ReactNode; className?: string | undefined }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", toneClass[tone ?? "muted"], className)}>
      {children}
    </span>
  );
}

export const SampleBadge = () => <Pill tone="demo">Sample Data</Pill>;

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-3xl border border-border bg-card p-6 shadow-soft", className)}>{children}</section>;
}

export function PanelHeader({ title, subtitle, action, icon }: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">{icon}{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function IconBubble({ children }: { children: ReactNode }) {
  return <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary [&_svg]:size-5">{children}</span>;
}

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className={cn("grid place-items-center bg-primary text-primary-foreground shadow-soft", size === "lg" ? "size-14 rounded-2xl" : "size-11 rounded-full")}>
      <Bot className={size === "lg" ? "size-6" : "size-5"} />
    </span>
  );
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl bg-secondary p-1">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === o ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
