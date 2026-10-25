import { createFileRoute } from "@tanstack/react-router";
import { Panel, PanelHeader, Pill } from "@/components/portal/ui";
import { useSession } from "@/lib/auth";
import { student } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/profile")({
  head: () => pageHead("Profile", "Your personal, academic and account information."),
  component: Profile,
});

function Info({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <Panel>
      <PanelHeader title={title} />
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</dt><dd className="mt-1 font-medium text-foreground">{v}</dd></div>
        ))}
      </dl>
    </Panel>
  );
}

function Profile() {
  const session = useSession();
  return (
    <div className="space-y-6">
      <Panel className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-primary-soft text-xl font-bold text-primary">{student.initials}</span>
        <div>
          <p className="text-xl font-bold text-foreground">{student.name}</p>
          <p className="text-sm text-muted-foreground">{student.regNo}</p>
          <Pill tone="primary" className="mt-2 capitalize">{session?.role ?? "student"}</Pill>
        </div>
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Info title="Personal Information" rows={[["Name", student.name], ["Email", student.email], ["Phone", student.phone], ["Campus", student.campus]]} />
        <Info title="Academic Information" rows={[["Program", student.program], ["Year", student.year], ["Section", student.section], ["Registration Number", student.regNo]]} />
      </div>
      <Info title="Account Settings" rows={[["Authentication", "Mock JWT-ready session"], ["Access Role", session?.role ?? "student"], ["Status", "Active demo account"]]} />
    </div>
  );
}
