import "server-only";

/**
 * Deployment settings, read from the environment at build time.
 * Server-only: never import this from a Client Component.
 */

const LOCAL_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`.replace(/\/+$/, "");
  return LOCAL_URL;
}

/** Absolute origin used for canonical URLs, Open Graph and the sitemap. */
export const siteUrl = resolveSiteUrl();

/** Search engines may index the site only when explicitly enabled. */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

if (isIndexable && siteUrl === LOCAL_URL) {
  throw new Error(
    "SITE_INDEXABLE=true but no SITE_URL (or Vercel production URL) is set. " +
      "Set SITE_URL to the public domain before enabling indexing.",
  );
}
