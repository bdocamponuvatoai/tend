// Serves the static export (out/) for the end-to-end tests, with the response
// headers from vercel.json so the Content-Security-Policy is the one the live
// site sends. upgrade-insecure-requests is dropped: the tests run on http.
// usage: node scripts/serve-out.mjs [port]   (default 4173)
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");
const port = Number(process.argv[2] ?? 4173);
const { headers: rules } = JSON.parse(
  await readFile(path.join(root, "vercel.json"), "utf8"),
);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
};

// vercel.json sources use "/(.*)" and "/images/(.*)" style patterns.
const matchers = rules.map((rule) => ({
  test: new RegExp(`^${rule.source.replace("(.*)", ".*")}$`),
  headers: rule.headers,
}));

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  for (const { test, headers } of matchers) {
    if (!test.test(pathname)) continue;
    for (const { key, value } of headers) {
      res.setHeader(
        key,
        key === "Content-Security-Policy"
          ? value.replace(/;\s*upgrade-insecure-requests/, "")
          : value,
      );
    }
  }
  let file = path.join(outDir, pathname);
  if (!file.startsWith(outDir)) {
    res.writeHead(400).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    res.end(await readFile(path.join(outDir, "404.html")));
  }
}).listen(port, () => {
  console.log(`Serving out/ on http://localhost:${port}`);
});
