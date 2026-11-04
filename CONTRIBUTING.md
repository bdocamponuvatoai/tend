# Contributing

How to work on the Tend site. Read `README.md` (setup, scripts) and
`docs/ARCHITECTURE.md` (how the code fits together) first.

## Workflow

1. Branch from `main` (`feature/…`, `fix/…`, `content/…`).
2. Make the change, then run **`npm run check`** (types, ESLint with zero
   warnings, Prettier, unit tests) and **`npm run build`**. Fix everything
   before pushing; CI runs the same steps.
3. Open a pull request. The template asks for the checks below. CI must be
   green before merging.
4. Never force-push `main`. Never commit `.env` files or secrets.

`npm run dev` serves the site at http://localhost:3000; `npm run preview`
serves the production build from `out/`.

## Rules that keep the site correct

- **Never invent facts.** No prices, results, reviews, testimonials,
  partner or restaurant names, or launch dates unless the business supplied
  them. Keep the pre-launch and "illustrative" labels.
- **Copy lives in `src/content/` and `src/config/site.ts`.** The FAQ,
  features and research also feed the JSON-LD and `/llms.txt`, so change
  them in one place.
- **Server Components by default.** Add `"use client"` only when the
  browser is needed (state, effects, events).
- **CSS is mobile-first.** Base styles for phones, `min-width` queries up
  (701px and 1001px are the main breakpoints). Keep the import order in
  `globals.css`, with `layout/page-grid.css` last.
- **No symbol characters in the page** (↗, ✳, ✓ …). Phones swap them for
  colour emoji. Use `components/ui/glyph.tsx` or a lucide icon.
- **Fonts through `--font-sans` / `--font-serif` only.**
- **Images:** import them from `src/assets/` (`next/image` with width and
  height), give meaningful images real alt text and decorative ones
  `alt=""`, and lazy-load anything below the fold.

## Accessibility checklist

- Small text reaches 4.5:1 contrast (use the darker golds on sand and
  champagne).
- Every interactive element works by keyboard, shows a visible focus ring
  and has an accessible name.
- Decorative icons and glyphs are `aria-hidden`.
- Animations respect `prefers-reduced-motion`.
- One `h1` per page, and headings in order.

## Before a pull request

- [ ] `npm run check` and `npm run build` pass.
- [ ] Checked at 390px (phone), 820px (tablet) and 1440px (desktop), with no
      horizontal scroll.
- [ ] Checked in Chrome and in Safari or Firefox.
- [ ] Copy changes are approved and contain no invented facts.
- [ ] New third-party origins (scripts, images, fonts) are added to the CSP
      in `vercel.json` and to `docs/ARCHITECTURE.md` section 8.
- [ ] Significant changes are recorded in `docs/verification.md`.

## Commit messages

Imperative subject under about 70 characters ("Add pricing page", "Fix menu
focus on close"), a blank line, then what changed and why, and how it was
checked.

## Releases

`main` is production. With the repository linked to Vercel, every push to
`main` deploys and pull requests get preview URLs. Set `SITE_URL` and,
only after the owner approves going public, `SITE_INDEXABLE=true` in the
Vercel project (README, Configuration).
