/**
 * Regenerates public/resume.pdf by printing /resume from headless Chrome.
 *
 * This is the generator that `src/app/globals.css` (the PRINT block, ~line 769)
 * has always described but nobody had written: that @media print block IS this
 * PDF's stylesheet, and there is no other producer. Run this after ANY change
 * to src/app/resume/page.tsx, or the committed PDF silently disagrees with the
 * page it claims to be.
 *
 *   npm run resume:pdf          # against an already-running server
 *   npm run build && npm run resume:pdf
 *
 * Three traps, all documented in globals.css and all asserted below rather
 * than hoped for:
 *
 *   1. `.reveal` is driven by `animation-timeline: view()`. At print time every
 *      element below the first viewport sits at animation progress 0 —
 *      `opacity: 0` — and prints BLANK. The print block cancels the animation;
 *      if that rule is ever lost, the PDF loses most of its content while
 *      still "succeeding". Hence the byte-size floor check.
 *   2. `.grain-overlay` left in produced a 26 MB PDF against 106 KB. It is a
 *      full-viewport SVG fractal-noise data URI re-rasterised at print DPI on
 *      every page. Hence the byte-size ceiling check.
 *   3. The boot overlay (`.z-boot`) is opaque and full-viewport, and dissolves
 *      on a timer — a race that a DOM assertion cannot catch, because the text
 *      underneath exists and is merely occluded. The print block hides it.
 *
 * page.pdf() emulates print media by default in Chromium, which is what makes
 * the @media print block apply. Do not call emulateMedia("screen") here.
 */
import { chromium } from "@playwright/test";
import { writeFileSync, statSync } from "node:fs";

const URL = process.env.RESUME_URL ?? "http://localhost:3013/resume";
const OUT = "public/resume.pdf";

/* Floor: a PDF that lost .reveal content still renders headers and lands
   around 40 KB, so anything under this means the print block regressed.
   Ceiling: the grain-overlay failure mode was 26 MB. */
const MIN_BYTES = 60_000;
const MAX_BYTES = 3_000_000;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(URL, { waitUntil: "networkidle", timeout: 90_000 });
await page.waitForTimeout(2_500); // hydration + the boot overlay's own timer

const buffer = await page.pdf({
  format: "A4",
  printBackground: true, // the dark palette IS the brand; see globals.css
  // Margins live in `@page { margin: 12mm }` so the stylesheet stays the
  // single source of truth. Passing them here too would silently double up.
});

await browser.close();

writeFileSync(OUT, buffer);
const { size } = statSync(OUT);
const kb = (size / 1024).toFixed(0);

if (size < MIN_BYTES) {
  throw new Error(
    `${OUT} is only ${kb} KB. The print block likely stopped cancelling the ` +
      `.reveal animation, so content below the fold printed blank. See globals.css.`,
  );
}
if (size > MAX_BYTES) {
  throw new Error(
    `${OUT} ballooned to ${kb} KB. Something full-viewport is painting at print ` +
      `DPI — look for grain-overlay / ambient field layers first. See globals.css.`,
  );
}

console.log(`${OUT} regenerated from ${URL} — ${kb} KB`);
