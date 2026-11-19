import { expect, test } from "@playwright/test";

// The consent contract (README, Analytics and cookie consent): nothing reaches
// Google before Accept; Accept loads Tag Manager once with ads denied; the
// choice is remembered; revoking clears the cookies and unloads GTM.
// Runs against a production build (playwright.config.ts checks). Google
// Analytics collect requests are answered locally, so a run never counts as a
// real visit.

const GOOGLE = /googletagmanager\.com|google-analytics\.com/;

type DataLayerCommand = [string, string, Record<string, string>];

test("consent gates Tag Manager", async ({ page, context }) => {
  const google: string[] = [];
  await context.route(/google-analytics\.com/, (route) =>
    route.fulfill({ status: 204, body: "" }),
  );
  page.on("request", (request) => {
    if (GOOGLE.test(request.url())) google.push(request.url());
  });

  await page.goto("/");
  const card = page.locator("#consent");
  await expect(card).toBeVisible({ timeout: 10_000 });
  expect(google).toHaveLength(0); // nothing before a choice

  await card.getByRole("button", { name: "Accept" }).click();
  await expect(card).toHaveCount(0);
  await expect(page.locator('script[src*="gtm.js"]')).toHaveCount(1);
  const consent = await page.evaluate(() => {
    const layer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
    return layer?.find(
      (entry) => (entry as ArrayLike<unknown>)?.[0] === "consent",
    ) as DataLayerCommand | undefined;
  });
  expect(consent?.[1]).toBe("default");
  expect(consent?.[2]).toMatchObject({
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  await page.reload();
  await expect(card).toHaveCount(0); // remembered
  await expect(page.locator('script[src*="gtm.js"]')).toHaveCount(1);

  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(page.locator("#consent-title")).toBeFocused();
  await expect(card.getByRole("button", { name: "Accept" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await Promise.all([
    page.waitForEvent("load"),
    card.getByRole("button", { name: "Decline" }).click(), // revoke → reload
  ]);
  await expect(page.locator('script[src*="gtm.js"]')).toHaveCount(0);
  const analyticsCookies = (await context.cookies()).filter((cookie) =>
    cookie.name.startsWith("_ga"),
  );
  expect(analyticsCookies).toHaveLength(0);
});

test("Decline: no request to Google across navigations", async ({
  page,
  context,
}) => {
  const google: string[] = [];
  await context.route(GOOGLE, (route) => {
    google.push(route.request().url());
    return route.fulfill({ status: 204, body: "" });
  });

  await page.goto("/");
  const card = page.locator("#consent");
  await expect(card).toBeVisible({ timeout: 10_000 });
  await card.getByRole("button", { name: "Decline" }).click();
  await expect(card).toHaveCount(0);

  for (const url of ["/", "/not-a-page/", "/"]) {
    await page.goto(url);
    // Hydrated and settled: a Tag Manager load would have started by now.
    await page.waitForLoadState("networkidle");
    await expect(card).toHaveCount(0);
  }
  expect(google).toHaveLength(0);
});
