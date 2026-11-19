import { existsSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// The consent test needs Tag Manager enabled, which happens only in a
// production build. Fail early with a clear message instead of a confusing
// "expected 1 gtm.js, received 0".
const page = "out/index.html";
if (!existsSync(page) || !readFileSync(page, "utf8").includes("GTM-")) {
  throw new Error(
    "out/ is not a production build. Run the build with VERCEL_ENV=production " +
      "first (see README, Analytics and cookie consent), then npm run test:e2e. " +
      "Rebuild without it before serving out/ anywhere else.",
  );
}

const PORT = 4173;

export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `node scripts/serve-out.mjs ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
