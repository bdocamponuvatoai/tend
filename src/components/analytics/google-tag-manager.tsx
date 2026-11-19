"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

const SCRIPT_ID = "gtm-script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Injects Google Tag Manager, once, only after the visitor accepts. Nothing is
 * in the page's HTML (no <head> snippet, no <noscript> iframe), so no request
 * reaches Google before a choice.
 */
function loadTagManager(id: string) {
  if (document.getElementById(SCRIPT_ID)) return; // exactly one, ever
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  // Must push `arguments`, not an array: GTM only reads commands in that shape.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  // The visitor agreed to analytics only: ad signals stay denied even if Ads
  // tags are added to the container later.
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/** _ga, _ga_<id>, _gid and _gat* on the host and every parent domain. */
function clearAnalyticsCookies() {
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++)
    domains.push("." + parts.slice(i).join("."));
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name || !/^(_ga($|_)|_gid$|_gat)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/** `gtmId` is null everywhere except the live production build (lib/analytics.ts). */
export function GoogleTagManager({ gtmId }: { gtmId: string | null }) {
  const choice = useConsent();

  useEffect(() => {
    if (!gtmId) return; // not production: never load
    if (choice === "granted") {
      loadTagManager(gtmId);
      return;
    }
    if (choice === "denied") {
      clearAnalyticsCookies();
      if (document.getElementById(SCRIPT_ID)) {
        window.gtag?.("consent", "update", { analytics_storage: "denied" });
        window.location.reload(); // a loaded container cannot be unloaded
      }
    }
  }, [gtmId, choice]);

  return null;
}
