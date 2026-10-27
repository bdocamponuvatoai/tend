// Works around a Next.js static-export bug on Windows: prefetch segment files
// are written into nested folders (`__next.about/__PAGE__.txt`) instead of
// dotted file names (`__next.about.__PAGE__.txt`), so link prefetches 404.
// On other platforms there is nothing to move and the script is a no-op.
import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("out");
const PREFIX = "__next.";

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const p = path.join(dir, e.name);
      return e.isDirectory() ? listFiles(p) : [p];
    }),
  );
  return nested.flat();
}

async function flattenSegmentDirs(dir) {
  let moved = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(dir, entry.name);
    if (!entry.name.startsWith(PREFIX)) {
      moved += await flattenSegmentDirs(fullPath);
      continue;
    }
    for (const file of await listFiles(fullPath)) {
      const segments = path.relative(fullPath, file).split(path.sep);
      await rename(file, path.join(dir, [entry.name, ...segments].join(".")));
      moved++;
    }
    await rm(fullPath, { recursive: true });
  }
  return moved;
}

const moved = await flattenSegmentDirs(OUT_DIR);
if (moved > 0) console.log(`Flattened ${moved} prefetch segment files in out/`);
