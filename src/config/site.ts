/**
 * Business details and navigation. Safe to import from client code: nothing
 * here depends on the environment.
 */

export type NavLink = {
  href: string;
  label: string;
  /** Shown as the header's call-to-action pill. */
  cta?: boolean;
};

export const site = {
  name: "Tend",
  tagline: "Your table. Their table. Wherever you are.",
  // Search-facing title and description, in the page's own terms. The title
  // leads with what restaurant buyers search for and ends with the brand
  // (50-60 characters); the description (150-160) keeps the pre-launch
  // status and closes on the estimator. The tagline stays in the hero,
  // footer and structured data.
  title: "Restaurant Table Ordering, Gifting & Payments App | Tend",
  description:
    "Tend is preparing to launch: order and pay at the table, send drinks to another table, treat someone remotely, and see what it could add to your restaurant.",
  themeColor: "#171810",
  locale: "en_US",
  parent: {
    name: "Isak Global Ventures",
    url: "https://isakglobalventures.com",
  },
  nav: [
    { href: "#benefits", label: "Why Tend" },
    { href: "#features", label: "App features" },
    { href: "#restaurants", label: "For restaurants" },
    { href: "#estimator", label: "Estimator", cta: true },
    { href: "#questions", label: "Good to know" },
  ] satisfies NavLink[],
} as const;
