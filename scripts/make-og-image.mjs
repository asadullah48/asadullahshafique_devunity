#!/usr/bin/env node
/**
 * Make a 1200x630 social-share image from a blog image WITHOUT cropping.
 *
 *   node scripts/make-og-image.mjs <source.png> [output.png]
 *
 * The source is scaled to fit inside 1200x630 (fit: "contain") and the empty
 * side space is filled with the source's own background colour, sampled from
 * its top-left pixel. Output defaults to an `og/` folder beside the source:
 *
 *   public/images/blog/x.png  ->  public/images/blog/og/x.png
 *
 * Then point the article's `ogImage:` frontmatter at the output. content.ts
 * reads width/height from the PNG header, so nothing is typed by hand.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const [src, outArg] = process.argv.slice(2);
if (!src) {
  console.error("usage: node scripts/make-og-image.mjs <source.png> [output.png]");
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error(`source not found: ${src}`);
  process.exit(1);
}

const out = outArg ?? path.join(path.dirname(src), "og", path.basename(src));

// Top-left pixel, as raw RGBA, is the fill colour for the letterbox.
const { data } = await sharp(src)
  .ensureAlpha()
  .extract({ left: 0, top: 0, width: 1, height: 1 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const background = { r: data[0], g: data[1], b: data[2], alpha: data[3] / 255 };
const hex = `#${[data[0], data[1], data[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

fs.mkdirSync(path.dirname(out), { recursive: true });
await sharp(src).resize(WIDTH, HEIGHT, { fit: "contain", background }).png().toFile(out);

const meta = await sharp(out).metadata();
console.log(`background: ${hex} (alpha ${background.alpha})`);
console.log(`wrote ${out} at ${meta.width}x${meta.height}`);
if (meta.width !== WIDTH || meta.height !== HEIGHT) {
  console.error(`expected ${WIDTH}x${HEIGHT}`);
  process.exit(1);
}
