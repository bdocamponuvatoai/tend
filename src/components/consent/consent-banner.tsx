"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT } from "@/content/consent";
import {
  closeConsentSettings,
  getConsent,
  setConsent,
  useConsent,
  useConsentSettingsOpen,
  type ConsentChoice,
} from "@/lib/consent";

const APPEAR_DELAY_MS = 900; // a beat after the page settles (no intro animation)
const EXIT_MS = 320; // keep equal to the closed transition in consent.css

/**
 * Analytics consent card. Asks once (a beat after load, without taking
 * focus) until the visitor chooses; reopens from "Cookie settings" in the
 * footer with focus on its heading, Escape to close and the stored choice
 * shown as pressed. Renders nothing on the server: without JavaScript there
 * is nothing to consent to. Styles: styles/components/consent.css.
 */
export function ConsentBanner({ side = "right" }: { side?: "left" | "right" }) {
  const choice = useConsent();
  const settingsOpen = useConsentSettingsOpen();
  const [askReady, setAskReady] = useState(false);
  const [present, setPresent] = useState(false); // mounted
  const [open, setOpen] = useState(false); // data-state="open"
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const mode = settingsOpen ? "settings" : "ask";
  const visible = settingsOpen || (askReady && choice === null);

  // Ask only when nothing is stored, a beat after the page settles.
  useEffect(() => {
    if (getConsent() !== null) return;
    const timer = window.setTimeout(() => setAskReady(true), APPEAR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Mount when it should show; on leaving, play the exit, unmount, and return
  // focus to the control that opened it.
  useEffect(() => {
    if (visible) {
      if (settingsOpen && !returnFocus.current) {
        const active = document.activeElement;
        returnFocus.current = active instanceof HTMLElement ? active : null;
      }
      const frame = requestAnimationFrame(() => setPresent(true));
      return () => cancelAnimationFrame(frame);
    }
    const frame = requestAnimationFrame(() => setOpen(false));
    const timer = window.setTimeout(() => {
      setPresent(false);
      const target = returnFocus.current;
      returnFocus.current = null;
      if (target?.isConnected) target.focus({ preventScroll: true });
    }, EXIT_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [visible, settingsOpen]);

  // Enter: mounted closed, opened on a later frame so the transition runs.
  // From "Cookie settings", focus moves to the heading.
  useEffect(() => {
    if (!present || !visible) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true));
    });
    if (mode === "settings") headingRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [present, visible, mode]);

  if (!present) return null;

  const pressed = (value: ConsentChoice) =>
    mode === "settings" ? choice === value : undefined;
  const { href, label } = CONSENT.privacyPolicy;
  const external = !!href && /^https?:\/\//.test(href);

  return (
    <section
      id="consent"
      className="consent"
      data-side={side}
      data-state={open ? "open" : "closed"}
      data-nosnippet=""
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      onKeyDown={(event) => {
        if (event.key === "Escape" && mode === "settings") {
          event.stopPropagation();
          closeConsentSettings();
        }
      }}
    >
      <div className="consent-card">
        <span aria-hidden="true" className="consent-rule" />
        <h2
          id="consent-title"
          ref={headingRef}
          tabIndex={-1}
          className="consent-title"
        >
          {CONSENT.heading}
        </h2>
        <p id="consent-body" className="consent-body">
          {CONSENT.body}
        </p>
        {href && (
          <a
            href={href}
            className="consent-link"
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
            {external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        )}
        <div className="consent-actions">
          {/* Equal weight: the same button style for both choices. */}
          <button
            type="button"
            className="btn consent-btn"
            aria-pressed={pressed("denied")}
            onClick={() => setConsent("denied")}
          >
            {CONSENT.decline}
          </button>
          <button
            type="button"
            className="btn consent-btn"
            aria-pressed={pressed("granted")}
            onClick={() => setConsent("granted")}
          >
            {CONSENT.accept}
          </button>
        </div>
      </div>
    </section>
  );
}
