# Security policy

## Supported versions

Only the current `main` branch (the deployed site) is supported.

## Reporting a vulnerability

Please report privately, never in a public issue, through GitHub's
**"Report a vulnerability"** button on this repository's Security tab
(private vulnerability reporting). Include the affected URL or file, steps to
reproduce, and the impact you expect.

Repository admins: enable this under Settings → Code security → Private
vulnerability reporting. Once Tend has a public security contact address,
add it here and publish `/.well-known/security.txt` (RFC 9116).

## Security model

The site is a static export: HTML, CSS, JS and images served from a CDN,
with no server code, database, cookies, accounts or user data. The
estimator runs entirely in the browser.

Protections (details in `docs/ARCHITECTURE.md` section 8):

- Response headers in `vercel.json`: Content-Security-Policy (own origin
  plus ImageKit images, no frames), `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options: DENY`, a restrictive
  Permissions-Policy, Cross-Origin-Opener-Policy, `X-Permitted-Cross-Domain-Policies`
  and HSTS.
- `script-src 'unsafe-inline'` is a documented trade-off of static export
  (inline bootstrap scripts, no per-request nonce). It is mitigated by
  having no user input, no third-party scripts, and escaped JSON-LD.
- Dependencies: `npm audit --omit=dev` in CI; Dependabot updates for npm
  (weekly) and GitHub Actions (monthly).
- CI: actions pinned to commit SHAs, read-only token, credentials not
  persisted.
- No secrets are needed to build or run the site; `.env*` files are
  git-ignored.
