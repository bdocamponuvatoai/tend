# Tend website

Marketing site for **Tend**, a dining app preparing to launch (part of Isak
Global Ventures). One page for diners and restaurants, including an
industry-data estimator for restaurant operators.

Built with Next.js 16 (App Router) and React 19 as a fully **static export**:
`npm run build` writes plain HTML, CSS and JS to `out/`, which any static host
can serve.

## Getting started

Requires Node.js 22.18 or newer (the unit tests use Node's built-in TypeScript
support); `.nvmrc` pins 24, the current LTS.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script                 | What it does                                                                |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run dev`          | Development server with hot reload.                                         |
| `npm run build`        | Static export to `out/` (then `postbuild` fixes prefetch files on Windows). |
| `npm run preview`      | Serves `out/` locally (`npx serve@14 out`).                                 |
| `npm run lint`         | ESLint (Next.js core-web-vitals + TypeScript rules); fails on any warning.  |
| `npm run images`       | Regenerates the hero's AVIF/WebP sizes from `hero-table.jpg`.               |
| `npm run typecheck`    | Generates route types and runs `tsc --noEmit`.                              |
| `npm test`             | Unit tests (`node --test`) for the estimator maths.                         |
| `npm run format`       | Formats everything with Prettier.                                           |
| `npm run format:check` | Fails if anything is not formatted.                                         |
| `npm run check`        | typecheck + lint + format:check + test. Run before every push.              |

## Project structure

```
src/
  app/
    layout.tsx          root layout: fonts, header, footer, site-wide metadata
    page.tsx            the home page (section order lives here)
    not-found.tsx       styled 404
    icon.svg            favicon
    robots.ts           robots.txt (blocks everything until indexing is enabled)
    sitemap.ts          sitemap.xml, built from content/routes.ts
    llms.txt/route.ts   llms.txt summary for answer engines, built from content/
  components/
    layout/             site-header (client: mobile menu), site-footer
    home/               one component per page section; story-tabs,
                        estimator-form and products-root are the only other
                        client components
    ui/                 Brand (wordmark), SmartLink
    seo/                JsonLd
  config/
    site.ts             name, tagline, title, description, navigation (client-safe)
    deployment.ts       SITE_URL / SITE_INDEXABLE handling (server-only)
  content/              all page copy: home.ts, faq.ts, research.ts, routes.ts,
                        product-demos.ts (phone walkthrough screens)
  lib/
    estimator.ts        estimator maths and number formatting (+ tests)
    products-section.ts reveal + phone walkthroughs for #products
    metadata.ts         pageMetadata(): title, description, canonical, OG/Twitter
    structured-data.ts  schema.org graph (Organization, WebSite, WebPage,
                        WebApplication, FAQPage)
  styles/
    globals.css         imports the partials below, in cascade order
    fonts.ts            next/font/local: DM Sans + Cormorant Garamond
    base/ layout/ components/ sections/
  assets/
    images/             hero-table.jpg (source + OG image), hero/ (AVIF/WebP
                        sizes from `npm run images`), igv-logo.png
    fonts/              self-hosted woff2 files
scripts/
  fix-export-segments.mjs
  optimize-images.mjs   hero AVIF/WebP generator (`npm run images`)
docs/
  verification.md       how the migration and later changes were verified
```

## Conventions

- **Copy lives in `src/content/`** (and `config/site.ts`). The FAQ, research
  figures and features feed the page, the JSON-LD and `llms.txt`, so editing
  one place updates all three.
- **Server Components by default.** Only the mobile menu, the feature tabs, the
  estimator and the product walkthroughs ship JavaScript.
- **CSS order matters.** `globals.css` imports partials in the order the
  original stylesheet defined them; some rules rely on overriding earlier
  partials at equal specificity. Add new sections as new partials at the end.
  Class names match the original site; keep them when editing markup.
- **Fonts** are self-hosted with `next/font/local` and exposed as
  `--font-sans` / `--font-serif`. Never write a family name in CSS.
  Exception: the `#products` section (`sections/products.css`) is reproduced
  from ojisak.com; its fonts and colours are switched to Tend's in the
  "Tend look" block of that file.
- **The `#products` section** is adapted from ojisak.com and restyled in Tend's
  palette. Its classes are generic (`.product`, `.phone`, `.screen`,
  `.status`…), so don't reuse those names elsewhere; `ts-section` /
  `ts-section-label` are prefixed because Tend already uses `.section` and
  `.section-label`. The phone screens are served from ImageKit
  (`ik.imagekit.io`), which the Content-Security-Policy allows in `img-src`.
- **Accessibility.** The page passes axe-core's WCAG 2.2 A/AA checks. Small text
  on the sand bands uses slightly darker gold/grey (see the "Contrast on sand"
  block in `design/sections.css`); check contrast when adding colours there.
- **Page grid.** Every top-level block (header, sections, products, footer)
  takes its side spacing from `--page-pad` (`base/tokens.css`): 6% on
  phones, 5% on tablets, 7% on desktops, with content capped at 1548px and
  backgrounds full width. `layout/page-grid.css` applies it and must stay the
  last import. New sections get it automatically by using the `section` class.
  Write new CSS mobile-first (base styles for phones, `min-width` queries up).
- **Design layer.** `styles/design/` holds the shared look: `system.css`
  (flat buttons `.btn-gold` / `.btn-ink`, icon badges, scroll reveal),
  `header.css` (sticky frosted header, CTA pill) and `sections.css`
  (per-section refinements). The system is editorial, like a printed
  fine-dining menu: content sits on the page under hairline rules, hierarchy
  comes from type and one gold accent, and surfaces are flat (no glows, drop
  shadows or hover lifts). Only the estimator (an instrument) and the app
  previews (screens) are framed. "Why Tend" and "Everything around your meal"
  live in `sections/benefits.css` and `sections/directory.css`. Tokens are in
  `base/tokens.css`. Icons are lucide line icons in a hairline circle via
  `components/ui/icon.tsx`; each item's icon is set in `content/home.ts`. Scroll reveal (`lib/reveal.ts`) only touches
  elements below the fold and is off for reduced motion.
- **Links:** use `SmartLink`. It uses `next/link` for `/…` routes and a plain
  `<a>` for hash, `tel:`, `mailto:` and external links.
- **Never invent facts.** No prices, results, reviews, launch dates or partner
  names unless the business has supplied them. The pre-launch and
  "illustrative" notes on the page are deliberate.

## Browser support

Chrome / Edge 111+, Firefox 111+ and Safari 16.4+ (macOS and iOS), set in
`browserslist` in `package.json` (the Next.js defaults, made explicit). SWC
and Lightning CSS compile JavaScript and CSS for these targets.

When writing CSS:

- Give a plain fallback before newer colour functions: `color-mix()` needs
  Firefox 113, so the header sets an `rgb()` background first. Purely
  decorative uses (the product section's glows) may simply drop out.
- Form controls are drawn explicitly. The estimator sliders style
  `::-webkit-slider-*` and `::-moz-range-*` in separate rules, because one
  unknown selector in a list invalidates the whole rule. `accent-color`
  alone renders differently in every engine.
- Variable fonts are declared once with their full weight range
  (`src/styles/fonts.ts`).

Checked in Chrome, Edge, Firefox (Gecko) and WebKit (Playwright) for errors,
overflow at 320–1920px, every interaction and per-section layout. See
`docs/verification.md` section 11. Playwright's Windows WebKit lays text out
correctly but does not paint variable-font weights or OpenType numerals,
so confirm typography on a real Mac or iPhone before launch.

## Routes

| Path           | Contents                                                                        |
| -------------- | ------------------------------------------------------------------------------- |
| `/`            | Home: hero, benefits, features, restaurants, research, estimator, FAQ, products |
| `/robots.txt`  | Disallow-all until `SITE_INDEXABLE=true`                                        |
| `/sitemap.xml` | Every route in `src/content/routes.ts`                                          |
| `/llms.txt`    | Plain-text summary for AI answer engines                                        |
| `/404.html`    | Styled not-found page                                                           |

In-page anchors: `#benefits`, `#experience`, `#features`, `#restaurants`,
`#research`, `#estimator`, `#questions`, `#products`.

## Configuration

Set these at **build time** (see `.env.example`):

| Variable         | Default                                                                | Purpose                                                                                          |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `SITE_URL`       | `https://$VERCEL_PROJECT_PRODUCTION_URL`, else `http://localhost:3000` | Origin for canonical URLs, Open Graph, sitemap, robots and `llms.txt`. No trailing slash.        |
| `SITE_INDEXABLE` | `false`                                                                | `true` lets search engines index the site. The build fails if `true` while the URL is localhost. |

## Before launch

- [ ] Owner confirms all copy, including the six research figures and their
      sources in `src/content/research.ts`. Answer engines will quote them, so
      each citation should be checked against the original publication.
- [ ] Owner confirms the estimator's prices and assumptions in
      `src/lib/estimator.ts`. The Growth rate ($399) is applied from 2
      locations, while the original pricing labels Growth as 5–14 locations.
- [ ] Connect the real domain and set `SITE_URL` for production.
- [ ] Only then set `SITE_INDEXABLE=true` and redeploy.
- [ ] Run Lighthouse on the live URL and submit `sitemap.xml` in Google Search
      Console.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests:
`npm ci` → `npm run check` → `npm run build`, then uploads `out/` as an
artifact. Dependabot (`.github/dependabot.yml`) proposes npm updates weekly
(Next/React grouped) and GitHub Actions updates monthly.

## Hosting

Designed for Vercel: import the repository and Vercel detects Next.js and the
static export automatically. `vercel.json` adds security headers
(`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy`, `Strict-Transport-Security`).

The CSP allows only this site plus ImageKit images. `script-src` needs
`'unsafe-inline'` because a static export bootstraps Next.js with inline
scripts and cannot use per-request nonces. If you add a third-party service
(analytics, forms, fonts), add its origin to the CSP. Vercel's preview toolbar
is blocked by this policy; turn it off for the project or allow
`https://vercel.live` if you need preview comments.

Any other static host works too: upload `out/` and configure the same headers.

### Deployments

- Preview: _not deployed yet_
