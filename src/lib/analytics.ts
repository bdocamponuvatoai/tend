import "server-only";

/**
 * Google Tag Manager container, loaded only after the visitor accepts
 * analytics cookies (components/analytics/google-tag-manager.tsx).
 *
 * Production only: Vercel sets VERCEL_ENV to "production" for production
 * deployments, "preview" for previews and nothing locally. The static export
 * bakes this in at build time, so previews, local builds and test runs never
 * report to the live property.
 *
 * Security: anyone with Publish rights on this container can run script on
 * every page of the site (the CSP in vercel.json allows Google Tag Manager).
 * Keep container access limited, and add any new vendor's origins to the CSP.
 */
export const GTM_ID: string | null =
  process.env.VERCEL_ENV === "production" ? "GTM-N553TXKS" : null;
