import { useSyncExternalStore } from "react";

/*
 * The visitor's analytics choice: the one source of truth for the banner, the
 * footer control and the Tag Manager loader. Stored in localStorage with a
 * version and a timestamp; asked again after 12 months or when VERSION
 * changes. Every open tab follows the same choice (storage events).
 */

export type ConsentChoice = "granted" | "denied";

export const CONSENT_STORAGE_KEY = "tend:consent";
const VERSION = 1; // bump when what the visitor agrees to changes
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

interface Stored {
  v: number;
  analytics: ConsentChoice;
  at: number;
}

let choice: ConsentChoice | null | undefined; // undefined = not read yet
let settingsOpen = false;
const listeners = new Set<() => void>();

function read(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<Stored>;
    if (s.v !== VERSION) return null;
    if (s.analytics !== "granted" && s.analytics !== "denied") return null;
    if (typeof s.at !== "number" || Date.now() - s.at > MAX_AGE_MS) return null;
    return s.analytics;
  } catch {
    return null; // private modes can throw
  }
}

const emit = () => listeners.forEach((fn) => fn());

function onStorage(e: StorageEvent) {
  if (e.key !== CONSENT_STORAGE_KEY) return;
  choice = read();
  emit();
}

function subscribe(fn: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  if (choice === undefined) choice = read();
  return choice;
}

export function setConsent(next: ConsentChoice) {
  choice = next;
  settingsOpen = false;
  try {
    const value: Stored = { v: VERSION, analytics: next, at: Date.now() };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage unavailable: the choice holds for this page only.
  }
  emit();
}

export function openConsentSettings() {
  settingsOpen = true;
  emit();
}

export function closeConsentSettings() {
  settingsOpen = false;
  emit();
}

// The server snapshot is null/false, so hydration never mismatches; the real
// value follows on the client.
export function useConsent(): ConsentChoice | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

export function useConsentSettingsOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => settingsOpen,
    () => false,
  );
}
