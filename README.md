# Tend website

Marketing site for **Tend**, a dining app preparing to launch (part of Isak
Global Ventures). One page for diners and restaurants, including an
industry-data estimator for restaurant operators.

Built with Next.js 16 (App Router) and React 19 as a fully **static export**:
`npm run build` writes plain HTML, CSS and JS to `out/`, which any static host
can serve.

## Getting started

Requires Node.js 20.9 or newer (`.nvmrc` pins 24, the current LTS).

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
| `npm run lint`         | ESLint (Next.js core-web-vitals + TypeScript rules).                        |
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
    home/               one component per page section; story-tabs and
                        estimator-form are the only other client components
    ui/                 Brand (wordmark), SmartLink
    seo/                JsonLd
  config/
    site.ts             name, tagline, title, description, navigation (client-safe)
    deployment.ts       SITE_URL / SITE_INDEXABLE handling (server-only)
  content/              all page copy: home.ts, faq.ts, research.ts, routes.ts
  lib/
    estimator.ts        estimator maths and number formatting (+ tests)
    metadata.ts         pageMetadata(): title, description, canonical, OG/Twitter
    structured-data.ts  schema.org graph (Organization, WebSite, WebPage,
                        WebApplication, FAQPage)
  styles/
    globals.css         imports the partials below, in cascade order
    fonts.ts            next/font/local: DM Sans + Cormorant Garamond
    base/ layout/ components/ sections/
  assets/
    images/             hero-table.jpg, igv-logo.png (static imports)
    fonts/              self-hosted woff2 files
scripts/
  fix-export-segments.mjs
docs/
  verification.md       how the migration and later changes were verified
```

## Conventions

- **Copy lives in `src/content/`** (and `config/site.ts`). The FAQ, research
  figures and features feed the page, the JSON-LD and `llms.txt`, so editing
  one place updates all three.
- **Server Components by default.** Only the mobile menu, the feature tabs and
  the estimator ship JavaScript.
- **CSS order matters.** `globals.css` imports partials in the order the
  original stylesheet defined them; some rules rely on overriding earlier
  partials at equal specificity. Add new sections as new partials at the end.
  Class names match the original site; keep them when editing markup.
- **Fonts** are self-hosted with `next/font/local` and exposed as
  `--font-sans` / `--font-serif`. Never write a family name in CSS.
- **Links:** use `SmartLink`. It uses `next/link` for `/…` routes and a plain
  `<a>` for hash, `tel:`, `mailto:` and external links.
- **Never invent facts.** No prices, results, reviews, launch dates or partner
  names unless the business has supplied them. The pre-launch and
  "illustrative" notes on the page are deliberate.

## Routes

| Path           | Contents                                                              |
| -------------- | --------------------------------------------------------------------- |
| `/`            | Home: hero, benefits, features, restaurants, research, estimator, FAQ |
| `/robots.txt`  | Disallow-all until `SITE_INDEXABLE=true`                              |
| `/sitemap.xml` | Every route in `src/content/routes.ts`                                |
| `/llms.txt`    | Plain-text summary for AI answer engines                              |
| `/404.html`    | Styled not-found page                                                 |

In-page anchors: `#benefits`, `#experience`, `#features`, `#restaurants`,
`#research`, `#estimator`, `#questions`.

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
(`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`, `Strict-Transport-Security`). No Content-Security-Policy
yet: one must be tested against Next.js's inline scripts before it is added.

Any other static host works too: upload `out/` and configure the same headers.

### Deployments

- Preview: _not deployed yet_
