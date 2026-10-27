# Verification record

How the Next.js site was checked against the original single-file site
(`Tend-Website-19.html`), and how each later change was checked against the
step before it. Measured on 2026-10-27, Windows 11, Chrome (system install)
driven by Playwright, `prefers-reduced-motion: reduce`, device scale factor 1,
with every image decoded and `document.fonts.ready` awaited before capture.

## 1. Migration parity (Next.js port vs original)

**Pixels.** Full-page screenshots at 1600, 1280, 1024, 768, 390 and 320 px.

| Width | Page height (original = new) | Differing pixels | Largest channel difference |
| ----- | ---------------------------- | ---------------- | -------------------------- |
| 1600  | 8165                         | 1080             | 1 / 255                    |
| 1280  | 8180                         | 704              | 1 / 255                    |
| 1024  | 8670                         | 731              | 1 / 255                    |
| 768   | 9065                         | 559              | 1 / 255                    |
| 390   | 13125                        | 292              | 1 / 255                    |
| 320   | 14486                        | 222              | 1 / 255                    |

Every differing pixel is inside the hero photo, which has a CSS
`filter: brightness(.72)`, and is off by exactly 1/255 in one channel: GPU
rounding, not a layout or rendering change. Visible text was identical at
every width.

**Geometry.** The bounding box of all 192 text runs matched to 0.01 px.

**Computed styles.** Every property of every element matched at all six widths,
except values that cannot render differently: `next/image` adds
`color: transparent` and an `aspect-ratio` from its width/height attributes
(both overridden by the CSS width/height), and `background-position` computes
as `0px 0px` instead of the equivalent `0% 0%`.

Defects caught by these checks and fixed before sign-off:

- **Manifesto padding at 701–1000 px.** In the original, a media-query
  `.section { padding }` came after the base `.manifesto { padding }` and won.
  Splitting the stylesheet reordered them; the rule is now pinned in
  `sections/manifesto.css`.
- **Closing panel lost its 8 px corner radius.** The stylesheet splitter
  treated `border` as resetting `border-radius`; fixed and regenerated.
- **Footer wordmark did not scroll to the top.** A `next/link` to the current
  URL is a no-op; the wordmark now links to `#` on the home page, as before.

**Behaviour.** The same scripted interactions ran on both sites and the JSON
outcomes were compared: all 14 tab paths (click, ←, →, Home, End from each
tab), FAQ toggling, every header hash link (same scroll position), the
manifesto link, back-to-top, the wordmark, the skip link, the footer year, the
title, and the mobile menu (open, close, close on link). All matched.
Screenshots of the gift tab, remote tab and open mobile menu: 0 differing
pixels.

Intended differences: the menu now also closes on Escape (focus returns to the
toggle) and when the window widens to desktop; unknown URLs get a styled 404
page; client-side navigation from the 404 page back home keeps JavaScript
state and updates the title.

**Network and console.** Zero 4xx responses other than the deliberate
`/does-not-exist/` request, zero prefetch 404s, zero page errors or hydration
warnings.

**Head.** Every original tag is preserved with the same values (charset,
viewport, theme-color, description, title, icon). Added: `robots`
(noindex while in preview), canonical URL, Open Graph and Twitter cards,
font and hero-image preloads.

## 2. Estimator, research and SEO changes (vs the verified port)

Each section of the new build was compared with the verified port at all six
widths.

- Hero, benefits, experience, feature tabs and feature directory: **0 differing
  pixels**.
- Manifesto, closing and footer: pixel crops shift because the sections now sit
  lower on the page, so each was also compared structurally: **0 computed-style
  differences and 0 section-relative layout differences** for all 31 elements.
- Intended changes: header (new "Estimator" link), restaurants (new
  "Estimate the impact for your venue" link), FAQ (one new question), and the
  two new sections.

Estimator, driven by keyboard in Chrome and checked against the unit-tested
maths:

| Scenario                             | Annual net  | Monthly net | Tend cost / mo |
| ------------------------------------ | ----------- | ----------- | -------------- |
| Defaults (1 location, 120, $48, 15%) | $287,316    | $23,943     | $499           |
| 5 locations, 30%                     | $2,894,100  | $241,175    | $1,995         |
| 20 locations, 30%                    | $11,600,400 | $966,700    | $5,980         |
| Minimums (1, 40, $20, 0%)            | −$2,988     | −$249       | $499           |

## 3. Clean-up (vs the step before)

Removed 57 unused selectors (231 declarations), the unused Manrope font, and
the 1774 px logo (replaced by a 292 px copy, 284 KB → 10 KB). Full-page
comparison: identical heights and text at all widths; the only differing
pixels are inside the resampled logo at desktop widths (1,582 px), visually
identical. Behaviour suite and estimator re-run: unchanged.

## 4. Tooling

`npm run check` (typecheck, lint, Prettier, unit tests) and `npm run build`
pass. `npm audit` reports 0 vulnerabilities, with and without dev dependencies.
