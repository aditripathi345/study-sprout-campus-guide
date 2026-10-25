import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type AssistantResult = { ok: true; reply: string } | { ok: false; error: string };

/**
 * Forwards a prompt to the n8n campus-buddy webhook configured in the
 * N8N_WEBHOOK_URL secret. Without it the assistant reports itself unavailable
 * instead of inventing answers.
 */
export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      message: z.string().trim().min(1).max(4000),
      mode: z.enum(["chat", "study-plan"]).default("chat"),
    }),
  )
  .handler(async ({ data }): Promise<AssistantResult> => {
    const url = process.env.N8N_WEBHOOK_URL;
    if (!url) {
      return {
        ok: false,
        error: "The AI assistant service is not connected yet. Please try again once it has been configured.",
      };
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: data.message, mode: data.mode }),
      });
      if (!res.ok) return { ok: false, error: `The assistant service responded with an error (${res.status}).` };
      const text = await res.text();
      let reply = text;
      try {
        const json = JSON.parse(text);
        const obj = Array.isArray(json) ? json[0] : json;
        reply = obj?.reply ?? obj?.output ?? obj?.response ?? obj?.message ?? obj?.text ?? text;
      } catch {
        /* plain text reply */
      }
      if (!String(reply).trim()) return { ok: false, error: "The assistant returned an empty response." };
      return { ok: true, reply: String(reply) };
    } catch {
      return { ok: false, error: "Could not reach the assistant service. Check your connection and retry." };
    }
  });
