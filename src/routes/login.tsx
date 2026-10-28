import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/portal/ui";
import { useServerFn } from "@tanstack/react-start";
import { setSession } from "@/lib/auth";
import { loginRequest, meRequest } from "@/lib/assistant.functions";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — AI Campus Assistant" },
      { name: "description", content: "Sign in to AI Campus Assistant with your campus account." },
      { property: "og:title", content: "Login — AI Campus Assistant" },
      { property: "og:description", content: "A premium campus portal for academic life." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const inputCls = "flex h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive";

function LoginPage() {
  const navigate = useNavigate();
  const doLogin = useServerFn(loginRequest);
  const doMe = useServerFn(meRequest);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (loading) return;
    const e: typeof errors = {};
    const v = identifier.trim();
    if (!v) e.identifier = "Enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e.identifier = "Enter a valid email address.";
    if (!password) e.password = "Enter your password.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const res = await doLogin({ data: { email: v, password } });
      if (!res.ok) { setErrors({ form: res.error }); return; }
      const me = await doMe({ data: { token: res.token } });
      if (!me.ok) { const why = me.status === 401 || me.status === 403 ? "the server rejected the access token (" + me.status + ")" : me.status === 0 ? "a network error" : (me.status ?? 0) >= 500 && me.status !== 502 ? "a server error (" + me.status + ")" : me.error;
        setErrors({ form: `Signed in, but account verification failed: ${why}` }); return; }
      setSession({ token: res.token, user: me.user }, remember);
      setPassword("");
      toast.success(`Welcome, ${me.user.name}`);
      navigate({ to: "/dashboard" });
    } catch {
      setErrors({ form: "Could not reach the campus server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-app lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between border-r border-border bg-hero p-10 lg:flex">
        <Link to="/" className="inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft className="size-4" /> Back to landing
        </Link>
        <div>
          <Logo size="lg" />
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground">A premium campus portal for academic life.</h1>
          <p className="mt-4 max-w-md text-muted-foreground">Sign in with your campus account. Your identity and role are verified by the campus server.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["JWT Ready", "MongoDB Ready", "Gemini Ready"].map((t) => (
            <div key={t} className="rounded-2xl border border-border bg-card px-4 py-4 text-sm font-semibold text-foreground shadow-soft">{t}</div>
          ))}
        </div>
      </aside>

      <main className="flex flex-col items-center justify-center p-4 sm:p-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 self-start text-sm font-medium text-foreground lg:hidden">
          <ArrowLeft className="size-4" /> Back to landing
        </Link>
        <form onSubmit={onSubmit} noValidate className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-elevated">
          <div className="flex flex-col items-center text-center">
            <Logo size="lg" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to AI Campus Assistant</p>
          </div>

          {errors.form && <p role="alert" className="mt-6 rounded-xl border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive">{errors.form}</p>}

          <label htmlFor="identifier" className="mt-4 block text-sm font-medium text-foreground">Email</label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} aria-invalid={!!errors.identifier} aria-describedby="identifier-err" type="email" placeholder="you@srmist.edu.in" className={inputCls} autoComplete="username" />
          </div>
          {errors.identifier && <p id="identifier-err" className="mt-1 text-xs text-destructive">{errors.identifier}</p>}

          <label htmlFor="password" className="mt-4 block text-sm font-medium text-foreground">Password</label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby="password-err" className={inputCls} autoComplete="current-password" />
          </div>
          {errors.password && <p id="password-err" className="mt-1 text-xs text-destructive">{errors.password}</p>}

          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 rounded border-border accent-primary" />
              Remember me
            </label>
            <button type="button" onClick={() => toast.info("Password reset is handled by your campus administrator in this demo.")} className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="mt-5 h-11 w-full rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {loading ? "Signing in…" : "Login"}
          </button>

        </form>
      </main>
    </div>
  );
}
