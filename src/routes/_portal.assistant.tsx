import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Bot, CornerDownLeft, RotateCcw, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Panel, PanelHeader } from "@/components/portal/ui";
import { askAssistant } from "@/lib/assistant.functions";
import { quickPrompts } from "@/lib/demo-data";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_portal/assistant")({
  head: () => pageHead("AI Assistant", "Ask the AI Campus Assistant about your timetable, exams, assignments, notices and campus services."),
  component: AssistantPage,
});

interface Msg { role: "user" | "assistant"; text: string }

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ text: string; prompt: string } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error]);

  async function send(text: string, retry = false) {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setError(null);
    if (!retry) setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { message: prompt, mode: "chat" } });
      if (res.ok) setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
      else setError({ text: res.error, prompt });
    } catch {
      setError({ text: "Something went wrong while contacting the assistant.", prompt });
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <section className="flex h-[calc(100vh-10rem)] min-h-[32rem] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-border p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Bot className="size-5" /></span>
            <div>
              <h2 className="font-semibold text-foreground">AI Campus Assistant</h2>
              <p className="text-sm text-muted-foreground">Ask anything about your campus</p>
            </div>
          </div>
          <button onClick={() => { setMessages([]); setError(null); }} disabled={!messages.length && !error}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-secondary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <X className="size-4" /> <span className="hidden sm:inline">Clear conversation</span>
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5" aria-live="polite">
          {!messages.length && !loading && !error && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><Bot className="size-6" /></span>
                <p className="mt-4 font-semibold text-foreground">Hi! I'm your AI Campus Assistant.</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">Ask me about your timetable, exams, assignments, notices or campus services.</p>
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-primary-soft px-4 py-2.5 text-sm text-foreground">{m.text}</p>
              </div>
            ) : (
              <p key={i} className="max-w-[90%] whitespace-pre-wrap px-3 text-sm leading-6 text-foreground">{m.text}</p>
            ),
          )}
          {loading && (
            <div className="flex items-center gap-1.5 px-3" role="status" aria-label="Assistant is typing">
              {[0, 150, 300].map((d) => <span key={d} className="size-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${d}ms` }} />)}
            </div>
          )}
          {error && (
            <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-start gap-2"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error.text}</span>
              <button onClick={() => send(error.prompt, true)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-destructive/40 bg-card px-3 py-1.5 font-medium hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <RotateCcw className="size-4" /> Retry
              </button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-sm focus-within:ring-2 focus-within:ring-ring">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} rows={3} aria-label="Message"
              placeholder="Ask about timetable, exams, assignments, notices or services..."
              className="w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Enter to send • Shift+Enter for a new line</p>
              <button onClick={() => send(input)} disabled={!input.trim() || loading} aria-label="Send message"
                className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <CornerDownLeft className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <Panel>
          <PanelHeader title="Quick Actions" subtitle="Suggested prompts for your campus assistant." />
          <div className="space-y-2">
            {quickPrompts.map((p) => (
              <button key={p} onClick={() => send(p)} disabled={loading}
                className="w-full rounded-2xl border border-border bg-card px-3 py-2.5 text-left text-sm font-medium text-foreground shadow-sm hover:bg-secondary disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {p}
              </button>
            ))}
          </div>
        </Panel>
        <Panel className="bg-secondary">
          <h2 className="font-semibold text-foreground">Connected to your workflow</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Answers come from your n8n campus-buddy webhook, called securely from the server — no keys in the browser.</p>
        </Panel>
      </div>
    </div>
  );
}
