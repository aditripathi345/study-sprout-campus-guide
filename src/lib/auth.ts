import { useEffect, useState } from "react";

// Mock JWT-ready demo session kept in the browser, matching the reference demo.
export type Role = "student" | "faculty" | "admin";
export interface Session {
  role: Role;
  identifier: string;
}

const KEY = "campus-assistant-session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session, remember: boolean) {
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}

/** undefined while hydrating, null when signed out. */
export function useSession() {
  const [s, setS] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    setS(getSession());
  }, []);
  return s;
}
