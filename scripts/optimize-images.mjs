// Generates responsive AVIF/WebP versions of the hero photo, and the social
// share card, from the original JPEG. Run after replacing
// src/assets/images/hero-table.jpg:
//   npm run images
// Uses sharp, which ships with Next.js.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = "src/assets/images/hero-table.jpg";
const OUT_DIR = "src/assets/images/hero";
const WIDTHS = [640, 960, 1280, 1536];
const OG_IMAGE = "src/assets/images/og-image.jpg";

await mkdir(OUT_DIR, { recursive: true });
for (const width of WIDTHS) {
  const base = sharp(SOURCE).resize({ width, withoutEnlargement: true });
  await base
    .clone()
    .avif({ quality: 55, effort: 6 })
    .toFile(path.join(OUT_DIR, `hero-table-${width}.avif`));
  await base
    .clone()
    .webp({ quality: 74, effort: 6 })
    .toFile(path.join(OUT_DIR, `hero-table-${width}.webp`));
}
console.log(`Wrote ${WIDTHS.length * 2} hero images to ${OUT_DIR}`);

// Social share card (Open Graph / Twitter): 1200×630, centre crop.
await sharp(SOURCE)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(OG_IMAGE);
console.log(`Wrote ${OG_IMAGE}`);
