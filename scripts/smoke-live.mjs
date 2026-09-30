#!/usr/bin/env node
/**
 * Live smoke test: "the portfolio does not fail at any point".
 *
 *   SITE=https://asadullahshafique-devunity.vercel.app node scripts/smoke-live.mjs
 *
 * Run by .github/workflows/site-smoke.yml after every production deploy and on
 * a schedule. Exits 1 on any failure and prints (and, in Actions, writes to the
 * step summary) exactly what failed. Checks:
 *
 *   1. Every sitemap URL plus the legacy routes: HTTP 200, no uncaught page
 *      error, no same-origin request answering >= 400, no horizontal overflow
 *      at 390px.
 *   2. Unknown URLs (EN and AR): HTTP 404 with no page error — an AR 404 once
 *      threw React hydration error #418.
 *   3. Every same-origin link found on those pages resolves (< 400).
 *   4. APIs: health 200; admin 401 without a token (it once leaked the contact
 *      inbox); contact validates; the chat stream answers about a flagship
 *      system (Gemini or the offline fallback — either must name it).
 *
 * External links are deliberately not checked: LinkedIn, Instagram and Medium
 * answer bots with 999/429/403, so they would make this red for nothing.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const SITE = (process.env.SITE || "https://asadullahshafique-devunity.vercel.app").replace(/\/$/, "");
const origin = new URL(SITE).origin;
const proxy = process.env.SMOKE_PROXY ? { server: process.env.SMOKE_PROXY } : undefined;

const LEGACY = ["/about", "/admin", "/ai-tools", "/backendless", "/blogs", "/community", "/dashboard",
  "/explore", "/login", "/privacy", "/question", "/question/1", "/signup", "/videos"];
const MISSING = ["/this-page-does-not-exist", "/blog/not-a-real-post", "/systems/not-a-system",
  "/ar/blog/not-a-real-post", "/ar/not-a-real-page"];
// Third-party noise that is not the site failing.
const IGNORE_URL = /\/_vercel\/|vercel-insights|vitals\.vercel|googletagmanager|google-analytics/;

const failures = [];
const fail = (where, what) => failures.push(`${where}: ${what}`);

async function fetchText(path, init) {
  const r = await fetch(origin + path, { redirect: "follow", ...init, signal: AbortSignal.timeout(45_000) });
  return { status: r.status, text: await r.text() };
}

// ---- 1-3: pages -------------------------------------------------------------
const sitemap = await fetchText("/sitemap.xml");
if (sitemap.status !== 200) fail("/sitemap.xml", `status ${sitemap.status}`);
const fromSitemap = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i);
if (fromSitemap.length < 5) fail("/sitemap.xml", `only ${fromSitemap.length} URLs`);
const pages = [...new Set([...fromSitemap, ...LEGACY])];

const browser = await chromium.launch({
  ...(proxy ? { proxy } : {}),
  // Optional: a preinstalled Chromium when the bundled build is not downloaded.
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const links = new Map(); // path -> first page it was seen on

async function visit(ctx, path, expectStatus, collectLinks, label) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`page error: ${e.message.slice(0, 160)}`));
  page.on("response", (r) => {
    const u = r.url();
    if (r.status() >= 400 && u.startsWith(origin) && !IGNORE_URL.test(u) && new URL(u).pathname !== path) {
      errors.push(`${r.status()} ${u.slice(origin.length, origin.length + 120)}`);
    }
  });
  try {
    const resp = await page.goto(origin + path, { waitUntil: "load", timeout: 60_000 });
    const status = resp?.status() ?? 0;
    if (status !== expectStatus) errors.push(`status ${status}, expected ${expectStatus}`);
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 2) errors.push(`horizontal overflow ${overflow}px`);
    if (collectLinks) {
      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.href));
      for (const h of hrefs) {
        const u = new URL(h);
        if (u.origin === origin && !links.has(u.pathname)) links.set(u.pathname, path);
      }
    }
  } catch (e) {
    errors.push(`load failed: ${e.message.slice(0, 120)}`);
  }
  for (const e of new Set(errors)) fail(`${label} ${path}`, e);
  await page.close();
}

for (const [viewport, label] of [[{ width: 1366, height: 900 }, "desktop"], [{ width: 390, height: 844 }, "mobile"]]) {
  const ctx = await browser.newContext({ viewport });
  for (const p of pages) await visit(ctx, p, 200, label === "desktop", label);
  for (const p of MISSING) await visit(ctx, p, 404, false, label);
  await ctx.close();
}
await browser.close();

for (const [path, seenOn] of links) {
  if (pages.includes(path)) continue; // already loaded in a browser
  try {
    const r = await fetch(origin + path, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
    if (r.status >= 400) fail(`link ${path}`, `status ${r.status} (linked from ${seenOn})`);
  } catch (e) {
    fail(`link ${path}`, `${e.message} (linked from ${seenOn})`);
  }
}

// ---- 4: APIs ----------------------------------------------------------------
const health = await fetchText("/api/health");
if (health.status !== 200) fail("/api/health", `status ${health.status}`);

const admin = await fetchText("/api/admin/messages");
if (admin.status !== 401 && admin.status !== 503) fail("/api/admin/messages", `status ${admin.status} without a token (must be 401)`);

const contact = await fetchText("/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
});
if (contact.status !== 400) fail("/api/contact", `empty body gave ${contact.status}, expected 400`);

const chat = await fetchText("/api/agent/chat/stream", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "What is OrchestratorX?", mode: "general" }),
});
const tokens = [...chat.text.matchAll(/^data: (.+)$/gm)]
  .map((m) => { try { return JSON.parse(m[1]).token ?? ""; } catch { return ""; } }).join("");
if (chat.status !== 200) fail("/api/agent/chat/stream", `status ${chat.status}`);
else if (!/orchestratorx/i.test(tokens)) fail("/api/agent/chat/stream", `answer did not mention OrchestratorX: "${tokens.slice(0, 160)}"`);

// ---- report -----------------------------------------------------------------
const checked = `${pages.length} pages + ${MISSING.length} 404s × 2 viewports, ${links.size} internal links, 4 APIs`;
const report = failures.length
  ? `## ❌ Site smoke failed (${failures.length})\n\n${checked}\n\n${failures.map((f) => `- ${f}`).join("\n")}\n`
  : `## ✅ Site smoke passed\n\n${checked} — ${SITE}\n`;
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
process.exit(failures.length ? 1 : 0);
