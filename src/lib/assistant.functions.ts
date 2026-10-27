import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type AssistantResult = { ok: true; reply: string; conversationId?: string | undefined } | { ok: false; error: string; status?: number | undefined };
export interface CampusUser { id: string; name: string; email: string; role: string }
export type LoginResult = { ok: true; token: string; user: CampusUser } | { ok: false; error: string; status?: number | undefined };
export type MeResult = { ok: true; user: CampusUser } | { ok: false; error: string; status?: number | undefined };

const statusMessage: Record<number, string> = {
  404: "The campus server isn't accepting requests right now (the n8n workflow may be inactive).",
  400: "The request was not valid. Please check your input.",
  401: "Your session has expired or is invalid. Please sign in again.",
  403: "You don't have permission to do that.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "The campus server had a problem. Please try again shortly.",
};

/** Calls the n8n unified API (URL kept server-side in N8N_WEBHOOK_URL). */
async function callN8n(body: Record<string, unknown>, token?: string) {
  const url = process.env["N8N_WEBHOOK_URL"];
  if (!url) return { ok: false as const, status: 0, error: "The campus backend is not configured yet." };
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
    const text = await res.text();
    let json: any = null;
    try {
      const parsed = JSON.parse(text);
      json = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      /* plain text */
    }
    if (!res.ok) {
      const msg = statusMessage[res.status] ?? (res.status >= 500 ? statusMessage[500] : `The campus server responded with an error (${res.status}).`);
      return { ok: false as const, status: res.status, error: msg, json };
    }
    if (json && (json.success === false || json.ok === false)) {
      return { ok: false as const, status: Number(json.status) || 400, error: String(json.error ?? json.message ?? "Request failed."), json };
    }
    return { ok: true as const, status: res.status, json, text };
  } catch {
    return { ok: false as const, status: 0, error: "Could not reach the campus server. Check your connection and retry." };
  }
}

function pickUser(j: any): CampusUser | null {
  const u = j?.user ?? j?.data?.user ?? j?.data ?? j;
  if (!u || typeof u !== "object" || u.id == null || !u.email) return null;
  return { id: String(u.id), name: String(u.name ?? u.email), email: String(u.email), role: String(u.role ?? "student") };
}

export const loginRequest = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().trim().email().max(255), password: z.string().min(1).max(200) }))
  .handler(async ({ data }): Promise<LoginResult> => {
    const r = await callN8n({ action: "login", email: data.email, password: data.password });
    if (!r.ok) {
      if (r.status === 401 || r.status === 403 || r.status === 400) return { ok: false, status: r.status, error: "Invalid email or password." };
      return { ok: false, status: r.status, error: r.error };
    }
    const j = r.json;
    const token = j?.token ?? j?.access_token ?? j?.accessToken ?? j?.data?.token ?? j?.data?.access_token;
    if (typeof token !== "string" || token.split(".").length !== 3) {
      return { ok: false, error: "Invalid email or password." };
    }
    const user = pickUser(j);
    return user ? { ok: true, token, user } : { ok: true, token, user: { id: "", name: "", email: data.email, role: "" } };
  });

export const meRequest = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string().min(10).max(4000) }))
  .handler(async ({ data }): Promise<MeResult> => {
    const r = await callN8n({ action: "me" }, data.token);
    if (!r.ok) return { ok: false, status: r.status, error: r.error ?? "Request failed." };
    const user = pickUser(r.json);
    return user ? { ok: true, user } : { ok: false, status: 401, error: "Could not verify your session." };
  });

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string().min(10).max(4000),
      message: z.string().trim().min(1).max(4000),
      conversationId: z.string().max(200).optional(),
      mode: z.enum(["chat", "study-plan"]).default("chat"),
    }),
  )
  .handler(async ({ data }): Promise<AssistantResult> => {
    const r = await callN8n(
      { action: "chat", message: data.message, mode: data.mode, ...(data.conversationId ? { conversationId: data.conversationId } : {}) },
      data.token,
    );
    if (!r.ok) return { ok: false, status: r.status, error: r.error ?? "Request failed." };
    const o = r.json;
    const reply = o ? (o.reply ?? o.output ?? o.response ?? o.answer ?? o.message ?? o.text ?? o.data?.reply) : r.text;
    if (!reply || !String(reply).trim()) return { ok: false, error: "The assistant returned an empty response." };
    const cid = o?.conversationId ?? o?.conversation_id ?? o?.data?.conversationId;
    return { ok: true, reply: String(reply), conversationId: cid ? String(cid) : undefined };
  });
