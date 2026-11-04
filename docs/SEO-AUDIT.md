# SEO Content Audit

## Tend marketing site (static build, pre-launch)

### Date: 2026-11-04

Scope: search engines (SEO), answer engines such as Google's AI answers
and voice assistants (AEO), and generative engines such as ChatGPT,
Perplexity, Claude and Gemini (GEO). Goal: help restaurants find Tend and
become clients.

The site is not public yet. It was audited as built (`npm run build`, served
locally), so canonical and Open Graph URLs show `http://localhost:3000`.
Production uses `SITE_URL`. Indexing is off on purpose (`SITE_INDEXABLE` is
unset): every page sends `noindex, nofollow` and robots.txt disallows all
crawlers. That is correct before launch, and the launch steps are at the end.

The `market-seo` skill's `analyze_page.py` is not bundled in this install,
so the same data points were extracted with a browser-based script.

---

## SEO Health Score: 76/100 (pre-launch)

| Area                              | Score   | Why                                                                                     |
| --------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| On-page SEO                       | 22 / 25 | Strong title, description, one H1, alt text; the H1 carries no search keyword           |
| Technical SEO                     | 24 / 25 | Static HTML, canonical, sitemap, robots, manifest, fast and stable; indexing still off  |
| Structured data, AEO and GEO      | 17 / 20 | Full schema graph, FAQ, llms.txt; no contact point or social profiles, sources unlinked |
| Content quality (E-E-A-T)         | 11 / 20 | Substantive, sourced copy; no About, team, contact, privacy policy or case studies      |
| Conversion path (winning clients) | 2 / 10  | Clear CTAs, but no way to contact Tend: no email, phone or enquiry form                 |

The biggest gap is not technical: **a restaurant that wants Tend cannot get
in touch**. Every "Bring Tend to your restaurant" button scrolls to the
restaurants section, which links on to the estimator. There is no
`mailto:`, phone number or form anywhere on the site.

---

## On-Page SEO Checklist

### Title Tag

- Status: **Pass** (changed in this audit)
- Before: "Tend — Order, gift drinks & treat someone at restaurants" (56
  characters; written for diners, brand first)
- Now: "Restaurant Table Ordering, Gifting & Payments App | Tend" (56
  characters)
- Why: it leads with what restaurant buyers search for ("restaurant table
  ordering"), names the differentiator (gifting drinks to other tables) and
  puts the brand last, where an unknown brand costs least. Every word comes
  from the page. Set in `src/config/site.ts`.

### Meta Description

- Status: **Pass** (changed in this audit)
- Before: "Tend is a dining app preparing to launch: order and pay at your
  table, send drinks to another table, treat someone remotely, and estimate
  restaurant gains." (155)
- Now: "Tend is preparing to launch: order and pay at the table, send drinks
  to another table, treat someone remotely, and see what it could add to
  your restaurant." (156)
- Why: it keeps the honest pre-launch status, lists the three things only
  Tend does together, and ends on a reason for a restaurant to click (the
  estimator). It is used for Open Graph, Twitter, the web manifest and the
  structured data.

### Heading Hierarchy

- Status: **Needs Work** (owner decision: visible copy)
- One H1: "A better meal. A thoughtful gesture. All in Tend." It is on-brand
  but carries no search phrase.
- 11 H2s (one per section) and H3s beneath them, with no skipped levels. The
  two H4s are titles inside feature previews, under their H3.
- Section H2s are emotional ("Little taps. Bigger possibilities."), so
  search engines get their topical signal from H3s, body copy and the title.
  That is acceptable for a brand page. Topical landing pages (see Content
  Gap) are the better place for keyword headings.

### Image Optimization

- Status: **Pass**
- Content images have descriptive alt text: the hero ("Fresh pasta,
  burrata and a cocktail shared across a restaurant table"), the app
  screens and the IGV logo.
- Decorative images use `alt=""` (the 11 dish photos inside the Why Tend
  illustrations, which are `aria-hidden`).
- Files are AVIF/WebP with responsive sizes for the hero (640 to 1536px)
  and descriptive file names (`hero-table-1280.avif`,
  `truffle-gnocchi-detail.webp`).
- Below-the-fold images lazy-load and the hero loads eagerly.

### Internal Linking

- Status: **Pass for a one-page site**
- Navigation, the footer and the CTAs link to section anchors (`#benefits`,
  `#features`, `#restaurants`, `#estimator`, `#questions`) with descriptive
  anchor text. The 404 page links to `/#section` (`SectionLink`).
- Deep linking needs more pages (see Content Gap).

### URL Structure

- Status: **Pass**
- One route (`/`) plus `/robots.txt`, `/sitemap.xml`, `/llms.txt` and
  `/manifest.webmanifest`. Lowercase, trailing slash on pages
  (`trailingSlash: true`), no parameters.

---

## Content Quality (E-E-A-T)

| Dimension         | Score   | Evidence                                                                                                                                                                                        |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Experience        | Weak    | Real app screens in the walkthrough; no case studies, pilots or customer stories (Tend has not launched, so none should be invented)                                                            |
| Expertise         | Present | Six industry statistics with named sources; a transparent estimator with its formula and list prices; specific feature descriptions                                                             |
| Authoritativeness | Weak    | Parent company named and linked (Isak Global Ventures); no About page, team, press or third-party mentions                                                                                      |
| Trustworthiness   | Present | Honest pre-launch labels ("illustrative", "planned experience", "an estimate, not a promise"); HTTPS and security headers on Vercel. Missing: contact details, privacy policy, links to sources |

---

## Keyword Analysis

- Primary keyword (commercial intent, restaurant buyers): **restaurant
  table ordering app**, with close variants "QR code ordering for
  restaurants" and "order and pay at the table".
- Search intent: commercial. Operators compare ordering and payment
  platforms. The one page serves both diners and restaurants, which dilutes
  intent (see Content Gap).
- Placement: in the title (start); in the description ("order and pay at
  the table"); in body copy and H3s ("self-ordering", "QR menus", "digital
  ordering"); not in the H1; not in the URL (single page).

Secondary keywords, taken from the page's own copy. Volumes are unverified,
so check them in Google Keyword Planner or a similar tool before
prioritising:

- self-ordering for restaurants / QR menu ordering
- pay at table app / split the bill app
- send drinks to another table (Tend's differentiator; likely low
  competition)
- order food for someone at a restaurant remotely
- restaurant happy hour app / happy hour offers app
- restaurant ticket size increase / table turnover QR payments (research
  topics)
- restaurant ROI calculator / self-ordering revenue estimator

---

## Technical SEO

| Check                | Status | Notes                                                                                                                                                                     |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server-rendered HTML | Pass   | Static export: every heading, FAQ answer, research figure and the estimator's default result are in the raw HTML, so crawlers and AI bots don't need JavaScript           |
| robots.txt           | Pass   | Disallow-all until `SITE_INDEXABLE=true`, then `Allow: /` with the sitemap and host                                                                                       |
| XML sitemap          | Pass   | `/sitemap.xml` from `content/routes.ts`; `lastmod` added in this audit (the build date)                                                                                   |
| Canonical            | Pass   | Self-referencing, absolute, from `SITE_URL`                                                                                                                               |
| Meta robots          | Pass   | `noindex, nofollow` before launch; `index, follow` after; 404 always `noindex`                                                                                            |
| Open Graph / Twitter | Pass   | 1200x630 share image, title, description, alt                                                                                                                             |
| Icons and manifest   | Pass   | SVG favicon, 180px Apple touch icon; web manifest added in this audit                                                                                                     |
| Mobile               | Pass   | Viewport set; mobile-first CSS; no overflow from 320px up (docs/verification.md section 19)                                                                               |
| Language             | Pass   | `<html lang="en">`, `og:locale en_US`, `inLanguage: en`                                                                                                                   |
| Speed                | Pass   | Local build: LCP is the hero AVIF (about 0.25 to 0.5s), CLS 0, about 190 KB gzip JS (docs/verification.md section 13). Re-measure on the live URL with PageSpeed Insights |

---

## AEO and GEO (answer and generative engines)

What these engines need is clear, quotable, well-sourced facts in crawlable
text, and an entity they can identify. Current state:

- **Pass:** raw HTML holds all content (above).
- **Pass:** `llms.txt` summarises Tend for AI crawlers from the same
  content modules as the page: what Tend is and its status, features, the
  six research figures with sources, how the estimator works, and the full
  FAQ. This audit added the four "For restaurants" benefits, the content
  that answers "what does Tend offer restaurants?".
- **Pass:** structured data identifies the entity: `Organization` (now with
  `description` and `logo`), `WebSite`, `WebPage` (now with
  `primaryImageOfPage`), `WebApplication` (the estimator) and `FAQPage` with
  the same 10 questions shown on the page. Google shows FAQ rich results
  only for some sites, but the markup still states the Q&A in a
  machine-readable form.
- **Pass:** answer-first FAQ (10 direct questions and answers) and
  self-contained statistics ("+15–30% larger ticket size with
  self-ordering", with source) are the kind of passages answer engines
  quote.
- **Needs work (owner):** link each research source to the original
  publication. The six citations name their source but don't link it.
  Generative engines and readers weigh linked primary sources more, and
  every figure must first be checked (README, Before launch).
- **Needs work (owner):** `sameAs` links to Tend's official profiles
  (LinkedIn, Instagram and so on) help engines join the entity up. Add them
  in `lib/structured-data.ts` once the profiles exist.
- **Needs work (owner):** a `contactPoint` (sales email or form) for the
  Organization, once one exists.

---

## Content Gap Analysis

Search volume is a qualitative estimate (not measured). Content needs owner
facts.

| Missing topic                                                                         | Potential | Competition | Content type                             | Priority |
| ------------------------------------------------------------------------------------- | --------- | ----------- | ---------------------------------------- | -------- |
| Contact / "Bring Tend to your restaurant" enquiry                                     | High      | n/a         | Form or email (a conversion path)        | 1        |
| For restaurants (benefits, estimator, pricing)                                        | High      | High        | Dedicated page `/restaurants/`           | 2        |
| Pricing ($499 / $399 / $299 list prices are already published in the estimator notes) | Med       | Med         | `/pricing/`                              | 2        |
| Send drinks to another table (social ordering)                                        | Med       | Low         | Feature page                             | 3        |
| Order for someone remotely                                                            | Med       | Low         | Feature page                             | 3        |
| Happy-hour offers for restaurants                                                     | Med       | Med         | Feature page                             | 3        |
| About Tend and the team                                                               | Low       | n/a         | `/about/` (E-E-A-T)                      | 3        |
| Privacy policy and terms                                                              | Low       | n/a         | Legal pages (trust; needed for any form) | 2        |
| Research explainers (ticket size, turnover, labour)                                   | Med       | Med         | Articles that cite the six sources       | 4        |

Adding pages: add the route under `src/app/`, list it in
`src/content/routes.ts` (sitemap) and give it `pageMetadata()` (canonical,
Open Graph). See docs/ARCHITECTURE.md.

---

## Featured Snippet Opportunities

- Paragraph snippets: FAQ answers are 40 to 90 words directly under each
  question. "What is Tend?", "How does the Tend estimator work?" and "Can I
  send drinks to another table?" are snippet-shaped already.
- List snippet: "How this estimate works" gives the formula (locations ×
  covers × ticket × 28 nights). A feature page could add a numbered "How
  Tend works for restaurants" list.
- Table snippet: on a future pricing page, an HTML table of the three list
  prices would be eligible.

---

## Schema Markup

| Schema                        | Status                                                 |
| ----------------------------- | ------------------------------------------------------ |
| Organization                  | Present (name, url, description, slogan, logo, parent) |
| WebSite                       | Present                                                |
| WebPage                       | Present (with primary image)                           |
| WebApplication (estimator)    | Present                                                |
| FAQPage                       | Present, matches the visible FAQ                       |
| BreadcrumbList                | N/A (one page); add with sub-pages                     |
| Product / SoftwareApplication | Not used: no live product, price or rating to describe |
| Review / AggregateRating      | N/A, and must never be invented                        |

Validate on the live URL with Google's Rich Results Test and the Schema.org
validator.

---

## Core Web Vitals

Locally, LCP is well under 2.5s (the hero AVIF), CLS is 0 on mobile and
desktop, and INP risk is low: the only interactions are tabs, sliders, FAQ
and the menu, with about 17 KB gzip of the site's own JavaScript. Field data
appears in Search Console once real visitors arrive.

---

## Content Strategy Recommendations

1. Launch with a working enquiry path, then add `/restaurants/` and
   `/pricing/` so commercial searches land on commercial pages.
2. One feature page per differentiator: table-to-table gifting, remote
   ordering, happy hour.
3. Publish research explainers built on the six cited studies, linking the
   primary sources.
4. Once Tend is live with partners, add real case studies (with permission).
   They are the strongest E-E-A-T signal and are what AI engines quote.
5. Refresh the research figures yearly. The labour figure cites the NRA
   2025 abstract.

---

## Prioritized Recommendations

### Critical (before launch)

1. **Add a way for restaurants to contact Tend** (owner: an email address
   or a form endpoint). Without it the site can rank but cannot win
   clients. Point the "Bring Tend to your restaurant" CTAs at it and add a
   `contactPoint` to the Organization schema.
2. **Launch steps:** connect the domain, set `SITE_URL`, set
   `SITE_INDEXABLE=true`, redeploy, then submit `sitemap.xml` in Google
   Search Console and Bing Webmaster Tools.
3. **Verify the six research citations** against the original publications
   (README, Before launch).

### High priority (first month)

1. Privacy policy (required once a form collects details) and terms.
2. Link each research source to its publication.
3. Decide on analytics (for example cookieless Vercel Web Analytics), and
   update the CSP if a third-party script is added.
4. Resolve the Why Tend illustration content (real restaurant name,
   mismatched totals; README, Before launch).

### Medium priority (this quarter)

1. `/restaurants/` and `/pricing/` pages; `BreadcrumbList` once there are
   sub-pages.
2. Feature pages for gifting, remote ordering and happy hour.
3. Official social profiles, linked through `sameAs`.

### Low priority (when resources allow)

1. An About page (team, company); research explainer articles.
2. Consider a keyword phrase in the H1 (visible copy, owner decision).

### Done in this audit

- Title and description rewritten from page facts (`src/config/site.ts`).
- Organization `description` and `logo`; WebPage `primaryImageOfPage`
  (`src/lib/structured-data.ts`).
- Sitemap `lastmod` (`src/app/sitemap.ts`).
- Web manifest (`src/app/manifest.ts`).
- "For restaurants" section in `llms.txt` (`src/app/llms.txt/route.ts`).
