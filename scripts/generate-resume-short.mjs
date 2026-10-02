/**
 * Regenerates public/resume.pdf — the 2-page recruiter résumé — by printing
 * scripts/resume/resume.html in headless Chromium.
 *
 *   npm run resume:short
 *
 * resume.html is the single source for this PDF. Edit it, then run this.
 * The long web profile at /resume is a different document with its own
 * generator (`npm run resume:pdf` → public/resume-full.pdf).
 *
 * Reality Rule (CLAUDE.md §0) applies to every line of resume.html: each
 * number must trace to a repository or to backend/knowledge/portfolio.json.
 *
 * Asserted, not hoped for:
 *   - exactly 2 pages (recruiters skim two; a third page means content grew);
 *   - a sane byte size (an empty render is tiny).
 * The PDF is only written once both checks pass.
 */
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, "resume", "resume.html");
const OUT = "public/resume.pdf";
const EXPECTED_PAGES = 2;
const MIN_BYTES = 40_000;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
await page.goto(pathToFileURL(SOURCE).href, { waitUntil: "networkidle" });
const buffer = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();

// Count pages from the PDF's own page objects rather than trusting layout.
const pages = (buffer.toString("latin1").match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
if (pages !== EXPECTED_PAGES) {
  throw new Error(`${OUT} would be ${pages} pages, expected ${EXPECTED_PAGES}. Trim scripts/resume/resume.html.`);
}
if (buffer.length < MIN_BYTES) {
  throw new Error(`${OUT} would be only ${(buffer.length / 1024).toFixed(0)} KB — the page likely rendered empty.`);
}

writeFileSync(OUT, buffer);
console.log(`${OUT} regenerated from ${SOURCE} — ${pages} pages, ${(buffer.length / 1024).toFixed(0)} KB`);
