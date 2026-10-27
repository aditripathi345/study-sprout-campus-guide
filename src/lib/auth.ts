import { useEffect, useState } from "react";
import type { CampusUser } from "./assistant.functions";

// Token issued by the n8n backend. Stored in browser storage (not HttpOnly) —
// readable by page scripts, so all handling stays in this one module.
export interface Session {
  token: string;
  user: CampusUser;
}

const KEY = "campus-assistant-session";
let verified: Session | null = null;

export function getStoredSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    const s = raw ? (JSON.parse(raw) as Session) : null;
    return s && typeof s.token === "string" ? s : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return verified?.token ?? getStoredSession()?.token ?? null;
}

export function setSession(s: Session, remember: boolean) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s));
  verified = s;
}

export function markVerified(s: Session) {
  verified = s;
  const store = localStorage.getItem(KEY) ? localStorage : sessionStorage;
  store.setItem(KEY, JSON.stringify(s));
}

export function getVerifiedSession() {
  return verified;
}

export function clearSession() {
  verified = null;
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}

/** Verified session from the portal layout; null before verification. */
export function useSession() {
  const [s, setS] = useState<Session | null>(null);
  useEffect(() => {
    setS(getVerifiedSession());
  }, []);
  return s;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "?";
}
