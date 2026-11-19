/**
 * Analytics consent copy (client-approved default). "Cookie settings" in the
 * body must match the footer control's label.
 */
export const CONSENT = {
  heading: "Analytics cookies",
  body:
    "With your permission, we use Google Analytics cookies to understand how visitors use this " +
    "site, so we can improve it. Nothing is collected unless you accept. You can change your " +
    "choice at any time under Cookie settings.",
  decline: "Decline",
  accept: "Accept",
  settings: "Cookie settings",
  // Renders only when given a URL. Never invent a policy page.
  privacyPolicy: { label: "Privacy Policy", href: null as string | null },
} as const;
