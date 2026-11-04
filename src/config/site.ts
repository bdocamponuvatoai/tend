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
  // Search-facing title and description: name what Tend does, in the page's
  // own terms. The tagline stays in the hero, footer and structured data.
  title: "Tend — Order, gift drinks & treat someone at restaurants",
  description:
    "Tend is a dining app preparing to launch: order and pay at your table, send drinks to another table, treat someone remotely, and estimate restaurant gains.",
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
