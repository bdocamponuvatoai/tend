"use client";

import { useSyncExternalStore } from "react";
import { CONSENT } from "@/content/consent";
import { openConsentSettings } from "@/lib/consent";

const noop = () => () => {};

/**
 * Footer control that reopens the consent card. Hidden until the page has
 * hydrated: without JavaScript it could do nothing.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return (
    <button
      type="button"
      hidden={!hydrated}
      onClick={openConsentSettings}
      className={className}
    >
      {CONSENT.settings}
    </button>
  );
}
