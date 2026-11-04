# Architecture

How the Tend site is built, where everything lives, and why. Read this
after the README. For contribution rules see `CONTRIBUTING.md`; for the
history of checks and decisions see `docs/verification.md`.

## 1. What it is

A single-page marketing site for Tend (a dining app preparing to launch)
plus a 404 page, built with **Next.js 16 (App Router), React 19 and
TypeScript** as a **fully static export**. `npm run build` writes plain
HTML, CSS, JS and images to `out/`. There is no server, database, API or
user data: the site is files on a CDN (Vercel).

```
content/ + config/  ──▶  Server Components (build time)  ──▶  out/*.html
                             │                                  + JSON-LD, robots.txt,
                             └─ a few Client Components ─▶      sitemap.xml, llms.txt,
                                (hydrate in the browser)        manifest.webmanifest
```

## 2. Rendering model

- Every component is a **Server Component** rendered once at build time,
  unless it starts with `"use client"`.
- Client Components exist only where the page needs the browser:

| Client Component                      | Why it runs in the browser                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `components/layout/site-header.tsx`   | Compact-on-scroll header; mobile menu (Escape, makes `main`/`footer` inert, locks page scroll) |
| `components/layout/back-to-top.tsx`   | Floating button with a reading-progress ring                                                   |
| `components/layout/scroll-reveal.tsx` | Fades sections in as they enter the viewport (`lib/reveal.ts`; off for reduced motion)         |
| `components/ui/section-link.tsx`      | `#section` links that become `/#section` off the home page (404)                               |
| `components/ui/brand.tsx`             | Wordmark: links to `#` (back to top) on the home page, to `/` elsewhere                        |
| `components/home/story-tabs.tsx`      | Feature tabs: ARIA tabs with arrow-key support and previous/next buttons                       |
| `components/home/estimator-form.tsx`  | Sliders, live maths (`lib/estimator.ts`), eased figures, the phone result bar                  |
| `components/home/products-root.tsx`   | Mounts the product walkthrough (`lib/products-section.ts`) when it nears the viewport          |

Everything else, including all copy, ships as HTML. Crawlers and AI bots
see the full page without running JavaScript.

## 3. Page composition

`src/app/page.tsx` defines the section order. Each section has its own
component, stylesheet and content source:

| Section (anchor)                 | Component(s)                                     | Styles                                            | Content                                    |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------------- | ------------------------------------------ |
| Hero                             | `home/hero.tsx`, `hero-picture.tsx`              | `sections/hero.css`, `design/sections.css`        | inline; tagline from `config/site.ts`      |
| Why Tend (`#benefits`)           | `home/benefits.tsx`, `benefit-visual.tsx`        | `sections/benefits.css`, `design/bento.css`       | `content/home.ts` → `benefits`             |
| Experience (`#experience`)       | `home/experience.tsx`                            | `sections/intro.css`, `design/sections.css`       | `content/home.ts` → `experienceSteps`      |
| Feature tabs (`#features`)       | `home/feature-showcase.tsx`, `story-tabs.tsx`    | `sections/features.css`, `design/sections.css`    | inline `stories` in `feature-showcase.tsx` |
| Feature index                    | `home/feature-directory.tsx`                     | `sections/directory.css`                          | `content/home.ts` → `featureDirectory`     |
| For restaurants (`#restaurants`) | `home/restaurants.tsx`                           | `sections/restaurants.css`, `design/sections.css` | `content/home.ts` → `restaurantBenefits`   |
| Research (`#research`)           | `home/research.tsx`                              | `sections/research.css`                           | `content/research.ts`                      |
| Estimator (`#estimator`)         | `home/estimator.tsx`, `estimator-form.tsx`       | `sections/estimator.css`                          | `lib/estimator.ts` (maths, prices)         |
| Manifesto (`#manifesto`)         | `home/manifesto.tsx`                             | `sections/manifesto.css`                          | inline                                     |
| FAQ (`#questions`)               | `home/faq-section.tsx`                           | `sections/faq.css`, `design/sections.css`         | `content/faq.ts`                           |
| Products (`#products`)           | `home/products-section.tsx`, `products-root.tsx` | `sections/products.css`, `design/bento.css`       | `content/product-demos.ts`                 |
| Closing                          | `home/closing.tsx`                               | `sections/closing.css`, `design/sections.css`     | inline                                     |

The root layout (`src/app/layout.tsx`) adds the skip link, header, footer,
back-to-top button and scroll reveal around every page.

## 4. Content layer

- **`src/content/`** holds the copy: `home.ts` (cards), `faq.ts`,
  `research.ts`, `product-demos.ts` (walkthrough screens on ImageKit) and
  `routes.ts` (every public route, used by the sitemap).
- **`src/config/site.ts`** holds the name, tagline, search title and
  description, theme colour, parent company and navigation. It is safe to
  import anywhere.
- **`src/config/deployment.ts`** reads `SITE_URL` and `SITE_INDEXABLE` at
  build time. It is server-only.
- One source feeds several outputs. The FAQ, for example, feeds the page,
  the `FAQPage` JSON-LD and `llms.txt`, so editing `content/faq.ts` updates
  all three.
- **Never invent facts.** No prices, results, reviews, partner names or
  dates the business hasn't supplied. Pre-launch and "illustrative" labels
  are deliberate.

## 5. Styling

Plain CSS (no Tailwind, no CSS-in-JS), imported once by
`src/styles/globals.css` in a fixed cascade order:

1. `base/` – tokens (`tokens.css`: colours, page grid, radius, easing) and
   element defaults (`base.css`).
2. `layout/header.css`, `components/`, `sections/*.css` – one partial per
   section, in the order the original site defined them (some rules rely on
   overriding earlier partials at equal specificity).
3. `sections/products.css` – the product section, after the Tend sections
   so their element styles can't leak into it.
4. `design/` – the shared look layered on top: `system.css` (buttons, icon
   badges, back-to-top, drawn glyphs), `header.css` (sticky header, dark
   mobile menu), `sections.css` (per-section refinements) and `bento.css`
   (rounded tiles, folder-tab corners, the Why Tend illustrations).
5. `layout/page-grid.css` – **must stay last**: the shared side gutter
   (`--page-pad`) and minimum touch areas.

Rules:

- **Mobile-first.** Base styles are for phones; every width breakpoint is a
  `min-width` query: 701px (tablet) and 1001px (desktop), plus 431, 761,
  1024, 1101 and 1281px in a few sections. Only the menu uses `max-height`
  (short screens). Don't add `max-width` queries.
- **Fonts** are self-hosted with `next/font/local` (`src/styles/fonts.ts`)
  and used through `--font-sans` (DM Sans) and `--font-serif` (Cormorant
  Garamond). Never write a family name in CSS. Use
  `font-variant-numeric: lining-nums` for serif numbers, because Cormorant's
  old-style "1" reads as "I".
- **Icons** are lucide line icons: `components/ui/icon.tsx` (badges set per
  item in `content/home.ts`) and `components/ui/glyph.tsx` (link arrows, the
  hero asterisk). **Never type ↗, ✳ or other symbols** into the page. The
  fonts lack them, so phones substitute colour emoji.
- **Contrast:** small text must reach 4.5:1 (WCAG AA). The sand and
  champagne surfaces need the darker golds already in use (`#76581c`,
  `#7a5b1c`, `#634a16`).
- **WebKit grid quirk:** cards of varying height use flex layouts on phones
  and tablets. As a CSS grid, WebKit kept stale row heights after a resize
  (docs/verification.md section 13).

## 6. Interactive behaviour (accessibility notes)

- **Mobile menu:** a full-screen sheet below 701px. While it's open,
  `main` and `footer` are `inert` and the page doesn't scroll; Escape closes
  it and returns focus to the toggle; widening the window closes it.
- **Feature tabs:** ARIA `tablist`/`tab`/`tabpanel`, roving focus with the
  arrow keys, and previous/next buttons that move focus to the new tab.
- **Estimator:** each slider has an `aria-valuetext`. The headline figure
  is announced once per change from a visually hidden live region, while
  the visible number eases (`lib/use-tweened.ts`; instant with reduced
  motion). On phones a bar pinned to the bottom shows the live total while
  the sliders are on screen; it is decorative (`aria-hidden`, not
  focusable). The figure sizes itself to its panel through `--chars`
  (container units).
- **Back to top** moves focus to `#main`; **skip link** sits above the
  header.
- Motion respects `prefers-reduced-motion` everywhere.

## 7. SEO, AEO and GEO

| Output                  | Source                                 | Notes                                                               |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| Title, description, OG  | `lib/metadata.ts`, `config/site.ts`    | Canonical from `SITE_URL`; 1200x630 share image (`og-image.jpg`)    |
| Robots meta             | `app/layout.tsx`                       | `noindex` unless `SITE_INDEXABLE=true`; the 404 is always `noindex` |
| JSON-LD                 | `lib/structured-data.ts`               | Organization, WebSite, WebPage, WebApplication (estimator), FAQPage |
| `/robots.txt`           | `app/robots.ts`                        | Disallow-all until indexable                                        |
| `/sitemap.xml`          | `app/sitemap.ts` + `content/routes.ts` | `lastmod` is the build date                                         |
| `/llms.txt`             | `app/llms.txt/route.ts`                | Plain-language summary for AI engines, built from `content/`        |
| `/manifest.webmanifest` | `app/manifest.ts`                      | Name, colours, icons                                                |
| Icons                   | `app/icon.svg`, `app/apple-icon.png`   |                                                                     |

`docs/SEO-AUDIT.md` holds the current audit and the prioritised list.

## 8. Security model

- **Attack surface:** static files only, with no server code, cookies,
  forms that post, or user data. The estimator runs entirely in the
  browser.
- **Headers** (`vercel.json`, all paths): a CSP allowing only this origin
  plus `https://ik.imagekit.io` images; no frames in or out; `nosniff`;
  `strict-origin-when-cross-origin`; `X-Frame-Options: DENY`; a
  Permissions-Policy denying camera, microphone, location, payment, USB,
  serial, HID, Bluetooth, motion sensors, screen capture and Topics; COOP
  `same-origin`; `X-Permitted-Cross-Domain-Policies: none`; HSTS 2 years
  with subdomains.
- **`script-src 'unsafe-inline'`** is required: a static export bootstraps
  Next.js with inline scripts and has no per-request nonce. Mitigation: no
  user input is ever rendered, there are no third-party scripts, and
  `JsonLd` escapes `<`.
- **Adding a third-party service** (analytics, forms, fonts) means adding
  its origin to the CSP and updating this section.
- **Supply chain:** `npm audit --omit=dev` runs in CI; Dependabot updates
  npm weekly and Actions monthly; Actions are pinned to commit SHAs; the
  workflow token is read-only and not persisted.
- **Secrets:** none are needed. `.env*` files are git-ignored except
  `.env.example`.

See `SECURITY.md` for how to report a vulnerability.

## 9. Quality gates

- `npm run check` runs typecheck, ESLint with zero warnings, a Prettier
  check and unit tests (`lib/estimator.test.ts`). CI runs it, then the
  build, on every push and pull request.
- Browser support: Chrome/Edge 111+, Firefox 111+, Safari 16.4+
  (`browserslist`).
- `docs/verification.md` records every significant change and how it was
  verified: accessibility (axe), four-engine cross-browser checks,
  responsive sweeps, copy comparisons and performance.

## 10. Key decisions

| Decision                                      | Why                                                                                                                                                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Static export, no server                      | A marketing site with no user data: fastest, cheapest and smallest attack surface                                                                                                                                 |
| `images.unoptimized` with pre-optimised files | The image optimiser needs a server; the hero has AVIF/WebP sizes from `npm run images`. AVIF lives in `public/images/hero` with hashed names (Turbopack cannot import AVIF), cached as immutable by `vercel.json` |
| App screens served from ImageKit              | Shared with the IGV product pages; versioned with `DEMO_ASSETS_V`                                                                                                                                                 |
| Indexing gated by `SITE_INDEXABLE`            | Prevents a preview or unapproved copy being indexed; the build fails if indexable with a localhost URL                                                                                                            |
| SVG glyphs instead of characters              | Phones rendered ↗ as a colour emoji                                                                                                                                                                               |
| Mobile-first CSS                              | One direction of overrides; proven equal to the previous rendering at 31 widths (docs/verification.md section 19)                                                                                                 |

## 11. Common changes

- **Edit copy:** change `src/content/*.ts` or the component (see the table
  in section 3). Check the page, JSON-LD and `llms.txt` if it's FAQ,
  research or feature copy.
- **Add an FAQ:** append to `content/faq.ts`. The page, `FAQPage` schema and
  `llms.txt` pick it up.
- **Add a section:** create `components/home/<name>.tsx` (a Server Component
  unless it needs the browser), add it to `app/page.tsx`, and add
  `styles/sections/<name>.css` (mobile-first) to `globals.css` before
  `products.css`. Give the `<section>` the `section` class (page grid and
  spacing) plus an `id` and `aria-labelledby`. If it should reveal on
  scroll, add its selector to `layout/scroll-reveal.tsx`.
- **Add a page:** `src/app/<route>/page.tsx` with
  `export const metadata = pageMetadata({ title, path, description })`, and
  add the route to `content/routes.ts`. Use `SmartLink` for links between
  pages.
- **Replace the hero photo:** overwrite `src/assets/images/hero-table.jpg`,
  then run `npm run images` (AVIF/WebP sizes and the share image).
- **Add an icon:** add a lucide icon to `components/ui/icon.tsx`'s map, or
  an arrow with `<LinkArrow />` / `<LinkArrow down />`.
