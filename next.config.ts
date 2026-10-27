import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes HTML/CSS/JS to `out/`.
  output: "export",
  // Emit `/about/index.html` rather than `/about.html` so any static host
  // serves clean URLs.
  trailingSlash: true,
  // The default image loader needs a server; static imports still provide
  // width/height, so layout stays stable.
  images: { unoptimized: true },
};

export default nextConfig;
