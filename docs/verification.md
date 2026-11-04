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

## 5. "What's taking shape" product section (vs ojisak.com, 2026-11-04)

The Tend + BarPass section was compared with the live `#products` section on
ojisak.com at 1440, 900 and 375 px (Chrome, reduced motion so nothing is
mid-animation, each page loaded twice so `font-display: optional` uses Inter).

- Part B CSS: all 351 declarations of the live `products.css` are present
  unchanged.
- **Computed styles:** every property of all 178 elements matches at all three
  widths, except `background-position` on buttons (`0px 0px` vs the equivalent
  `0% 0%`).
- **Layout:** every visible element's box relative to the section matches to
  0.01 px; every text node matches. Pixel crops differ only through sub-pixel
  anti-aliasing (the section sits at a different fractional offset on each
  page); side-by-side screenshots are visually identical.

Fixes needed to get there:

- Tend's `.section` and `.section-label` rules leaked in (1800 px max width,
  gold uppercase label): those two classes are prefixed `ts-` in this section.
- Tend's `body` line-height, `summary` weight and `details p` colour/padding
  leaked in: neutralised in a marked isolation block in `products.css`.
- The brief's Part A scoped `.product-list` as `.products .product-list`, which
  beat Part B's 18 px tablet gap; it now uses `:where(.products)`, matching the
  live specificity.
- The brief's Part A omitted the live `@media (max-width: 760px) { h2 { font-size: 42px } }`; added.

Behaviour (built site, and `next dev` for React's double-mounted effects):
both phones autoplay through all six screens every 3.6 s and loop to the
first; mouse hover pauses and leaving resumes; PAUSE/PLAY holds and resumes;
step buttons jump to the chosen screen. With reduced motion nothing autoplays
and PLAY starts it. All 12 screens load from ImageKit (HTTP 200), with no
console errors and no 4xx. No horizontal scroll at 375 px. With JavaScript
disabled both welcome screens show and all copy is readable. In development
mode each phone has exactly 6 screens and one step guide (no duplicates).

Rest of the page vs the previous build: hero, benefits, experience, features,
directory, restaurants, research, estimator and manifesto are pixel-identical
at six widths; FAQ, closing and footer have 0 style and 0 layout differences
(the FAQ crop's last pixel row now blends into the grey section below it).

## 6. Page grid and touch areas (2026-11-04)

Goal: line every block up on the same content edges and make the site
mobile-first friendly without changing any copy.

- **Content unchanged:** only CSS files changed (no markup). Visible page text
  is identical to the previous build at 1600, 1280, 1024, 768, 390 and 320 px.
- **Only spacing changed:** a computed-style comparison at 375, 1440 and 2560
  px shows changes only to padding, margins, max-width, hit-area positioning
  and the menu button's minimum size (plus the widths those produce). No
  colour, font or text property changed.
- **Alignment:** header, hero copy, every section, the product section, the
  closing card (from 701px) and the footer now share one left/right content
  edge at every width (for example 23px at 375, 38px at 768, 101px at 1440).
  Before, the header and footer sat at 5%, sections at 7% and the product
  section at 6%.
- **Full width:** section backgrounds previously stopped at 1800px (visible
  side gutters at 1920 and 2560px); every band now runs full width and content
  stays centred at 1548px.
- **Responsive audit at 320, 360, 375, 390, 414, 600, 768, 820, 1024, 1280,
  1440, 1920 and 2560px:** no horizontal scroll, no element past the viewport
  edge, no text overflowing its box.
- **Touch areas:** text links, header and mobile-menu links, "Back to top", the
  PLAY/PAUSE pill, the menu button and the estimator sliders accept a tap 20px
  above and below their centre (22px for sliders) at 375 and 768px: 0 misses.
- **Regression:** site behaviour suite, estimator scenarios and product
  walkthrough checks give the same results as before.

## 7. BarPass removed from the product section (2026-11-04)

At the owner's request the BarPass spotlight was removed from "What's taking
shape": its markup, its six walkthrough screens, its CSS (3 rules, 8
declarations) and its mention in the development note, which now reads "Tend
is in development. Availability and launch details will be shared when
confirmed." The Tend spotlight is unchanged. Sections 5 and 6 describe the
section as it was before this change.

## 8. Product section on Tend's sand background (2026-11-04)

The section's background changed from ojisak.com's grey-blue (`#edf0f2`) to
Tend's sand (`#eae3d3`, as in the features and research sections), and its
label divider from `#d9dfe3` to Tend's divider-on-sand colour (`#c9bda4`).
A computed-style comparison with the previous build at 1440 and 375px shows
only those two properties changed. Contrast on sand: heading 13.5:1, body copy
4.8:1, gold heading 3.9:1 (large text; AA needs 3:1).

## 9. Design upgrade (2026-11-04)

Every section was refined in Tend's own palette and type (no new colours or
fonts): sticky frosted header with an "Estimator" pill, gold hero button,
icon cards (Why Tend, Everything around your meal), large serif step numbers,
segmented feature tabs, glass cards on the restaurant band, sand cards for the
research figures, level estimator cards, card-style FAQ with a sticky heading
on desktop, a glowing closing card with a button, footer navigation, and a
scroll reveal for cards (off for reduced motion). The product section now uses
Tend's DM Sans / Cormorant and colours; the Inter font files were removed.

- **Copy unchanged:** all 343 text nodes of the previous build are present in
  the same order. The 7 additions all reuse existing phrases: the closing
  button ("Bring Tend to your restaurant ↗") and the footer navigation (the
  header's five link labels). Image alt text, page title and description are
  identical.
- **Behaviour:** menu, tabs (all 14 keyboard/click paths), FAQ, skip link,
  footer year and 404 behave as before; every anchor link still lands 100px
  below the top of the viewport (below the 76px compact header). Estimator
  scenarios and the product walkthrough give the same results. 0 page errors,
  0 unexpected 4xx.
- **Responsive:** no horizontal scroll, overflowing element or text overflow
  at 13 widths from 320 to 2560px; touch-area hit tests: 0 misses.

## 10. Production clean-up (2026-11-04)

- **CSS:** removed 82 declarations that a later rule with the same selector
  always overrides (left by the original layered stylesheet and the design
  layer), 1 rule matching nothing, and the product section's unused `--pad`
  token; merged its three root rules into one. Computed styles of every
  element are identical to the previous build at 1600, 1280, 1024, 768, 390
  and 320px (0 differences). A second dead-code pass finds nothing; an unused
  selector scan (with the walkthrough built and runtime state classes
  allowlisted) finds 0 of 647.
- **Hero image:** served as AVIF/WebP at 640/960/1280/1536px (`npm run
images`) with the JPEG as fallback. Measured downloads: 81KB (1440px @1x,
  1920px) to 108KB (390px @3x, 1440px @2x), against 373KB before. `sizes`
  accounts for the cover crop, so the chosen file is always at least as wide
  as it is drawn. Visual difference: mean 2–4/255 per channel.
- **Content-Security-Policy** added to `vercel.json`. Tested by serving the
  build with the policy enforced (without `upgrade-insecure-requests`, which
  cannot apply to a plain-http test server): 0 violations across the site,
  estimator and walkthrough suites; client-side navigation still keeps state.
- **Accessibility:** axe-core (WCAG 2.0–2.2 A/AA + best practices) reports 0
  violations on the home page at 1440 and 390px and on the 404 page. Fixed 21
  contrast failures on sand surfaces (minimal darkening, computed to ≥4.6:1)
  and the walkthrough step buttons' accessible names.
- **Tooling:** ESLint back to 9 (the version range `eslint-config-next`'s
  plugins support; 10 was flagged invalid by `npm ls`); lint fails on
  warnings; `engines.node` ≥22.18; CI audits production dependencies.
  `npm audit --omit=dev`: 0 vulnerabilities. The remaining dev-only advisory
  (GHSA-g3hv-75wg-m249, `minimatch` inside ESLint plugins) has no compatible
  fix and only affects untrusted glob input.

## 11. Cross-browser compatibility (2026-11-04)

Targets: Chrome/Edge 111+, Firefox 111+, Safari 16.4+ (`browserslist` in
`package.json`, equal to the Next.js defaults).

Engines tested against the static build: Chrome 156, Edge 156 (Chromium),
Firefox 159 (Gecko, official Mozilla build driven over WebDriver BiDi;
Playwright's own Firefox is blocked by Windows Smart App Control) and WebKit
27.2 (Playwright). Results:

- **19/19 checks in every engine:** web fonts load; sticky header with a
  solid background; the benefits bento grid and folder-tab corner (these two
  replaced the earlier container-query and sticky-heading checks when the
  section was redesigned); round icon badges; estimator frame; feature tabs by click and arrow keys; FAQ
  disclosure; estimator default ($287,316) and slider-driven updates; smooth
  anchor scroll; product walkthrough builds 6 steps and responds to clicks;
  mobile menu opens and closes with Escape; 404 page.
- **No errors** (page errors, console errors, failed requests) in any engine.
- **No horizontal overflow** at 320, 390, 768, 1024, 1440 and 1920px.
- **Layout matches Chrome:** every section's height in Edge, Firefox and
  WebKit is within tolerance (4% / 24px) at all six widths.

Fixed:

- **Header background:** `color-mix()` (Firefox 113+) now has an `rgb()`
  fallback, so Firefox 111–112 keep a solid header instead of a transparent
  one.
- **Estimator sliders** rendered differently per engine (gold handle in
  Chrome, grey in Firefox, white in WebKit). They are now styled explicitly
  per engine and match.
- **Fonts:** declared once per variable file with its weight range. A
  measured probe shows text metrics identical in all three engines before and
  after; a Chrome pixel diff shows no change outside the sliders.

Known test-environment limit: Playwright's Windows WebKit lays text out
correctly (measured: same widths as Chrome for weights and lining numerals)
but paints the default glyphs, e.g. regular weight, old-style "1". Real
Safari (Core Text) paints what it lays out. Confirm on a Mac or iPhone, or
a device cloud, before launch.

## 12. Header shake, hero fold and closing spacing (2026-11-04)

- **Header shake (reported):** the sticky header shrank from 112px to 76px
  (88px to 68px on phones) inside the page flow. Each change moved the
  content, which changed `scrollY` and could flip the compact state back.
  The header now grows an equal margin beneath it as it shrinks (same
  duration and easing), so its footprint is constant (`--header-h`,
  `styles/design/header.css`). Measured by stepping the scroll across the
  threshold and back at 1518×718, 1440×900 and 390×844. Before: 140–158
  state flips, content at up to 23 different offsets, up to 12px scroll
  drift. After: 2 flips, 1 offset, 0 drift.
- **Hero call to action below the fold (reported, 1518×718, i.e. 1920×1080
  at 125% scaling):** the headline now scales with viewport height
  (`min(5.5vw, 11.5svh)`), the copy column is slightly wider so the headline
  is always 3 lines, and short screens (≤860px tall) get a 92px header and
  tighter spacing. The button is fully visible at 1280×720, 1366×768,
  1440×900, 1518×718, 1536×864, 1600×900, 1920×1080, 2560×1440 and 1024×768.
- **Closing card:** it touched the sand product band (margin-top 0), so its
  rounded corners sat on the colour change. It now has 48/72/96px of space
  above it (phone/tablet/desktop).
- **Footer:** the tagline sits under the logo, and the navigation, IGV and
  legal rows are each under a hairline. (The footer's "Back to top" link was
  later removed in favour of the floating back-to-top button.)

Re-verified: copy unchanged; axe 0 violations; 19/19 cross-browser checks
in Chrome, Edge, Firefox and WebKit with no errors or overflow; behaviour
matches the original in 23 of 34 checks (back-to-top now matches too).

## 13. Production audit (2026-11-04)

Whole-codebase review before launch: automated checks, an independent code
review of `src/`, and runtime checks of the static build.

Baseline: `npm run check` (types, ESLint with zero warnings, Prettier, 4
unit tests) and `npm run build` passed. `npm audit --omit=dev`: 0
vulnerabilities; the dev-only `minimatch` advisory in section 10 remains (its
suggested fix downgrades ESLint to v4). No unused CSS classes or components.

Fixed:

- **Why Tend illustrations, layout:** `bento.css` sized the illustration
  wrapper `width/height: 100%`, overriding the per-breakpoint sizes in
  `sections/benefits.css`. Phones showed the panels shifted left with a gap
  on the right and the dish photo 193px tall instead of 300px; on desktop the
  wide tiles' panels were about 180px wide instead of 310px; WebKit collapsed
  the dish photo to 0px after a resize. The wrapper now takes its size from
  `benefits.css` only.
- **Why Tend tiles, WebKit resize/rotation:** as a CSS grid, WebKit kept row
  heights from the previous viewport (e.g. iPad 1180→820: tiles 577px instead
  of 603px). Phones now stack the tiles in a flex column and tablets wrap them
  in flex rows; desktops keep the 12-column grid. 13 resize paths (phone and
  iPad rotations, window resizes across breakpoints) now match a fresh load
  in Chrome and WebKit. The panels are pinned to the tile bottom
  (`margin-top: auto`), which also removed a gap under the shorter tile in a
  tablet row.
- **Contrast:** the "01 / 04" tile numbers were 2.6–3.9:1 on the champagne,
  sand and gold tiles; they now use each fill's `--muted` colour.
- **Skip link** sat under the sticky header (z-index 10 vs 40); now 50.
- **404 page navigation:** header, menu and footer links were bare `#id`
  hashes, which on `/missing/` pointed at `/missing/#id`. New `SectionLink`
  writes `/#id` off the home page. Verified in Chrome and WebKit: 404 →
  footer "Estimator" lands on `/#estimator`, section 100px from the top.
- **Screen readers:** decorative ↗ ↓ + glyphs in buttons, links and FAQ
  summaries are `aria-hidden` (they were read as "north east arrow",
  "plus"). The estimator's per-slider `<output>` is `aria-hidden` (the
  slider already announces its value) and the revenue `<output>` is
  `aria-live="off"`, so one slider step makes one announcement plus the live
  total instead of four.
- **Performance:** the below-the-fold "more time at the table" photo
  (138 KB) was `loading="eager"`; it is lazy now. Two dish photos shown at
  42px were 720px files (~90–105 KB each); they are now 168px
  (8.6 KB and 5.7 KB). The truffle photo, shown up to ~570px wide, keeps
  720px.
- **Share image and icons:** Open Graph/Twitter now use a 1200×630 crop of
  the hero photo (`og-image.jpg`, generated by `npm run images`) instead of
  the 1536×1024 original, which social networks crop unpredictably. Added
  `app/apple-icon.png` (180px, full-bleed for iOS masking).
- **Headers:** added `Cross-Origin-Opener-Policy: same-origin`.
- **Robustness:** the illustration component was in `ui/app-screen.tsx`
  but exported `BenefitVisual` and threw on an unknown key at build time.
  It moved to `components/home/benefit-visual.tsx` with a typed key
  (`BenefitScreen`), so a typo fails the type check. Walkthrough markup
  escapes alt text and labels; its visibility observer reads the newest
  entry; tile fills cycle if a fifth benefit is added.
- **Dead code:** removed `.tile--cream`, a header gap rule that always lost
  to a later one, a reduced-motion transition that `!important` overrode, a
  `!important` pair, the scroll-reveal selector for the removed
  `.benefits-bottom` (now targets `.benefits-moment`), and four mojibake
  dashes in `bento.css` comments.

Re-verified on the final build:

- axe-core WCAG 2.2 A/AA + best practice: 0 violations at 1440px, 390px,
  the 404 page, and with the mobile menu open (top and scrolled).
- Cross-browser: 19/19 checks in Chrome 156, Edge 156, Firefox 159 and
  WebKit 27.2; no overflow at 320–1920px; layout within tolerance of Chrome
  in every engine (WebKit's Why Tend difference is gone). One Edge run logged
  `ERR_NETWORK_CHANGED` fetching a remote image (a local network event).
- Load (local): LCP is the hero AVIF; CLS 0 on mobile and desktop, before and
  after scrolling the whole page. First load: ~190 KB gzip JS (about 17 KB of
  it the site's own code; the rest is the Next.js/React runtime), 14 KB gzip
  CSS, 75 KB fonts.
- Copy: the comparison with the pre-redesign build still stops at "The real
  benefit?", as it did before this audit: the Why Tend pull quote and the
  new illustrations, journey rail and tile numbers were edited outside these
  sessions (see "Before launch" in the README). This audit's changes leave
  the rendered text identical.

Not changed: the footer © year is set at build time (static export), so it
updates on the next deploy after New Year.

## 14. Why Tend tiles redesigned (2026-11-04)

Reported: the section did not look good. At 1518px the illustration panels
were glued to the tiles' right and bottom edges with one rounded corner,
their content stopped early (blank strips under the lists), their text was
7–9px, every tile had a large empty area above its title, and the four
panels were styled four different ways.

Now every tile reads top to bottom (icon and number, title and copy, then
the illustration), and each illustration is a finished cream card with
rounded corners at a legible scale (labels 10px, item names 17px, amounts up
to 44px). Phones and tablets stack each card; desktops (1281px and up) give
every card two columns. Cards that share a row now end up close in height:
the largest text-to-card gap is 96px at any width from 320 to 1920px, down
from 189px.

Re-verified: rendered page text identical to the section 13 build; axe 0
violations (1440px, 390px, 404); 19/19 cross-browser checks in Chrome, Edge,
Firefox and WebKit with no errors, no overflow and layout within tolerance;
13 resize and rotation paths match a fresh load in Chrome and WebKit;
`npm run check` passes.

## 15. Estimator redesigned (2026-11-04)

Before: the heading and intro sat in the left half with the right half
empty; the calculator was one boxed form; the dark readout had a dead band
between the monthly figures and the breakdown; the method notes were one
dense paragraph.

Now: heading beside its intro on desktop; the inputs and the readout are two
bento tiles (28px corners); sliders have a 6px rail and a 24px handle; the
ticket-lift assumption sits on its own champagne panel; the readout keeps
the headline figure at the top and shares any spare height evenly above the
monthly figures and above the breakdown ledger; the method notes are two
paragraphs, the caveat set apart. Wording unchanged (rendered text identical
apart from the note's paragraph break).

Fixed on the way: with every slider at its maximum the annual gain is
$120,948,240, which overflowed the readout on phones (the old fixed font
size). The figure now sizes to its panel: up to 128px on desktop and 80px on
smaller screens, shrinking only for long numbers. Checked at default,
maximum and minimum (negative) inputs at 320, 390, 820, 1518 and 1920px in
Chrome and WebKit: fits every time.

Re-verified: axe 0 violations (1440px, 390px, 404, menu open) after
darkening the "YOUR ASSUMPTION" label (was 4.48:1 on its panel); 19/19
cross-browser checks in Chrome, Edge, Firefox and WebKit (the estimator
frame check now tests the two tiles' corners); `npm run check` passes.

## 16. Estimator interactions (2026-11-04)

- **Figures ease to new values** (`src/lib/use-tweened.ts`, about 0.45s,
  ease-out) instead of jumping: the headline, the monthly figures, the
  breakdown and current monthly revenue. The visible headline is
  `aria-hidden`; a visually hidden live region (`.sr-only`) holds the final
  figure, so screen readers hear one value per change, never the in-between
  frames. Instant with reduced motion.
- **The research range on the slider:** the ticket-lift slider shades
  15–30% of its travel (`RESEARCH_TICKET_LIFT_RANGE` in `lib/estimator.ts`,
  the range cited in `content/research.ts`) and labels it "15–30%" in its
  scale (decorative, `aria-hidden`).
- **Phone result bar:** on phones the readout sits below the sliders, so
  while the sliders are on screen and the headline figure is not, a bar at
  the foot of the screen shows the live annual gain; a tap scrolls to the
  readout. Decorative (`aria-hidden`, out of the tab order); hidden from
  701px up; leaves room for back-to-top.
- **Slider handles** show a halo on hover and swell slightly while held.

Verified in Chrome and WebKit: during easing the live region already holds
the final value and the visible figure passes through intermediate values
and settles on it; reduced motion shows the final value at once; the band's
edges sit exactly at 15% and 30% of the travel; the bar is hidden at the
page top, shows over every slider, updates with the sliders, hides once the
figure is on screen and scrolls the readout into view; no console errors.
axe 0 violations (1440px, 390px, 404, menu open); `npm run check` passes.
Rendered text adds only the reused "15–30%" label and the hidden copy of the
total.

## 17. Pre-push clean-up (2026-11-04)

- **Manifesto (redesigned outside these sessions, kept as is):** older rules
  still applied to it. The desktop 10% side padding from its centred days
  (`layout/page-grid.css`) put its content 45px inside the page grid at
  1518px; removed, so it now lines up with the header and every other
  section. Its background, label colour and button margin were also set in
  `design/sections.css`; those duplicates are gone and
  `sections/manifesto.css` owns the section.
- **404 page:** it borrowed the `manifesto` class, so the redesign removed its
  gold accent and its spacing ("Back to Tend" touched the paragraph). It now
  has its own `sections/not-found.css` (sand band, gold accent, spacing).
- **Unused tokens removed:** `--yellow`, `--champagne`, `--radius-md`.
- **`useTweened`:** with reduced motion on, the start point now stays
  current, so turning motion back on eases from the figure on screen.
- Scans: no unused CSS classes, assets or exports; no encoding damage,
  `console.log`, `TODO` or `debugger` in source; `npm audit --omit=dev` 0
  vulnerabilities.

Re-verified on the final build: `npm run check` and `npm run build` pass;
axe 0 violations (1440px, 390px, 404, menu open); 19/19 cross-browser checks
in Chrome, Edge, Firefox and WebKit, no errors or overflow, layout within
tolerance; estimator easing, research band, phone bar and headline fit pass
in Chrome and WebKit; 404 links reach their sections; rendered text identical
to the previous build.

## 18. Feature, research and methodology redesigns (2026-11-04)

The owner redesigned the feature-showcase heading, the Research heading and
cards, and the estimator's method notes (a methodology panel with an
equation rail and an outcome-note card), adding small labels (BEYOND THE
ORDER, PUBLISHED EVIDENCE, INDUSTRY SIGNAL, METHODOLOGY, OUTCOME NOTE).

Fixed before release:

- **Contrast:** the selected feature tab's number (#876520 on #f2e6ca,
  4.33:1) and the source line on the featured research card (#74591d on
  #e5ce94, 4.26:1) were below 4.5:1; both use a darker gold now.
- **Equation:** its `aria-label` sat on a plain `div`, where screen readers
  ignore it; `role="img"` makes it read as one sentence.
- **Research card numbers** use lining figures, so "01" no longer reads
  as "oI".

Verified: `npm run check` and `npm run build` pass; axe 0 violations
(1440px, 390px, 404, menu open); 19/19 cross-browser checks in Chrome, Edge,
Firefox and WebKit with no errors or overflow; the method prices render
intact ("$250/mo", "$499/mo"); the outcome-note card is complete at 390,
820 and 1518px.

## 19. Mobile-first CSS, responsive sweep and browser parity (2026-11-04)

**Mobile-first conversion.** 43 desktop-first `max-width` queries in 17
stylesheets (mostly the original partials and the ported product section)
were rewritten so the base rules are the phone styles and every width
breakpoint is a `min-width` query. Overrides that never applied (a more
specific or later rule always won, e.g. the hero's 9px eyebrow and the
tablet tab size) were dropped. The 65px phone padding repeated in four
sections now lives once in `sections/section.css`. Height queries for the
menu on short screens (`max-height`) are unchanged.

Proof of no visual change: every computed style of every element (including
`::before`/`::after`) and every element's box were compared with the
previous build in Chrome at 31 widths (320 to 2560px, both sides of every
breakpoint) on the home page with the walkthrough built, and at 5 widths on
the 404 page. Every box is identical. The only differing values are the
menu button's border and font size at 701px and up, where the button is
`display: none`.

**Responsive sweep** (Chrome, Edge, Firefox, WebKit; 320x640, 360x780,
375x812, 390x844, 430x932, phones in landscape 844x390 and 932x430, tablets
768x1024, 820x1180, 1024x768, 1180x820, and 1366x768, 1440x900,
1920x1080): no horizontal overflow, no element beyond the viewport, no
clipped text, no errors. The header links measure 22px tall but their touch
area extends to 40px (`layout/page-grid.css`), and they are spaced well
apart.

**1:1 parity:** of 168 section heights in Edge, Firefox and WebKit, 167 are
within 2px of Chrome. The exception is Firefox at 375px, where the hero
intro wraps to 4 lines instead of 5 because Firefox measures the text a
fraction of a pixel narrower (normal font-measurement variance between
engines).

Also re-verified: 19/19 interaction checks in all four engines; axe 0
violations; estimator features, 404 links and skip link; `npm run check`.

## 20. Arrow and asterisk icons drawn as SVG (2026-11-04)

Reported on a phone: the "Bring Tend to your restaurant ↗" button showed the
arrow as a blue colour-emoji tile. The site's fonts have no glyph for ↗
(U+2197) or ✳ (U+2733), so phones fill them from the colour emoji font.

All five ↗ (hero, closing, mobile-menu and manifesto buttons; 404 "Back to
Tend"), the ↓ on "Estimate the impact for your venue" and the hero's ✳ are
now drawn SVG line icons (`components/ui/glyph.tsx`: lucide ArrowUpRight /
ArrowDown at 1.75 stroke, and an eight-spoke asterisk), sized to the text
and `aria-hidden`. The hover nudge keeps its direction (up-right, or down
for ↓). A scan of the source finds no other emoji-capable character in the
page text; the footer © is in the site font, and the mobile menu's CSS →
(U+2192) has no emoji form.

Verified: every icon renders at 16px in Chrome and WebKit at 390px; axe 0
violations; 19/19 cross-browser checks in all four engines; `npm run check`.

## 21. SEO / AEO / GEO, security hardening and handover docs (2026-11-04)

**SEO, AEO and GEO** (full audit in `docs/SEO-AUDIT.md`, scored 76/100
pre-launch):

- Title "Restaurant Table Ordering, Gifting & Payments App | Tend" (56
  characters) and description (156) rewritten from page facts, keeping the
  pre-launch status.
- Organization schema: `description` and a 180px `logo`; WebPage:
  `primaryImageOfPage` (the 1200x630 share image).
- Sitemap `lastmod` (the build date); web manifest (`/manifest.webmanifest`);
  `llms.txt` gains the four "For restaurants" benefits.
- Confirmed: all copy, FAQ answers, research figures and the estimator's
  default result are in the raw HTML (no JavaScript needed); one H1; 10
  FAQ items on the page and in `FAQPage`; no image without alt.
- The biggest gap is commercial: there is no contact path (no email, phone
  or form). It is the first item in README, Before launch.

**Security:**

- `vercel.json`: CSP adds `frame-src 'none'`; Permissions-Policy also denies
  payment, USB, serial, HID, Bluetooth, motion sensors and screen capture;
  added `X-Permitted-Cross-Domain-Policies: none`.
- CI: actions pinned to commit SHAs (checkout v7.0.1, setup-node v7.1.0,
  upload-artifact v7.0.2), `persist-credentials: false`, read-only token.
- `SECURITY.md` (private vulnerability reporting; the security model).
- Checked by serving `out/` with the exact `vercel.json` headers (CSP
  without `upgrade-insecure-requests` on the plain-http test server) and
  loading the home page at 1440px and 390px (walkthrough and estimator
  exercised) and the 404: all 8 headers sent, no CSP violations,
  Permissions-Policy warnings, console errors or failed requests.

**Handover documentation:** `docs/ARCHITECTURE.md` (rendering model,
section map, content layer, styling cascade, interactions, SEO pipeline,
security model, decisions, common changes), `CONTRIBUTING.md`, a pull
request template, and a documentation map at the top of the README.

Re-verified: `npm run check` and `npm run build` pass; axe 0 violations;
19/19 cross-browser checks in Chrome, Edge, Firefox and WebKit.

## 22. Estimator pricing updated (2026-11-04)

The owner set new list prices per location per month: **$499 for 1–4
locations, $449 for 5–14, $399 for 15–24; 25 or more are quoted
separately** (previously $499 for one location, $399 for 2–14 and $299 for
15 or more). This also settles the earlier question about the 2–4 location
rate.

- `lib/estimator.ts`: `TEND_PRICING` (`starterPerLocation`,
  `growthPerLocation`, `scalePerLocation`, `quoteFromLocations`) and
  `tendMonthlyCost`, which refuses 25+ locations (`RangeError`) rather than
  inventing a price. `MAX_ESTIMATOR_LOCATIONS` (20) drives the slider, and
  a test keeps it below the quote threshold.
- The method notes and `llms.txt` state the new prices from the same
  constants.
- Tests: tier values at 1, 4, 5, 14, 15, 20 and 24 locations, and 25 throws.

Verified in Chrome: Tend cost per month is $499 (1), $1,996 (4), $2,245
(5), $6,286 (14), $5,985 (15) and $7,980 (20). The default estimate is
unchanged ($287,316). axe 0 violations; 19/19 cross-browser checks;
`npm run check` (5 tests) passes.
