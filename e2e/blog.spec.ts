import { test, expect, type Page } from "@playwright/test";

/**
 * Knowledge hub (/blog) and every article it links to.
 *
 * Article routes are discovered FROM the hub rather than hardcoded, so a new
 * markdown file is covered by this spec the moment it is published — and an
 * article the hub fails to list is caught by the count assertion.
 *
 * Selectors use [id="…"] rather than #… because heading anchors are derived
 * from heading text, and a heading that starts with a digit produces an id
 * that is not a valid CSS #selector.
 */

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
}

test.describe("Knowledge hub", () => {
  test("hub renders one H1, a featured article and only non-empty topics", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Knowledge Hub");
    await expect(page.getByRole("region", { name: "Featured article" })).toBeVisible();

    const topics = page.getByRole("navigation", { name: "Topics" }).getByRole("link");
    const count = await topics.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await topics.nth(i).getAttribute("href");
      const id = href!.slice(1);
      await expect(page.locator(`[id="${id}"] article`).first(), href!).toBeAttached();
    }
  });

  test("legacy /blogs forwards to the hub", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page).toHaveURL(/\/blog$/);
  });

  test("every article: one H1, canonical, JSON-LD, resolvable TOC, no overflow at 320px", async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/blog");
    expect(await horizontalOverflow(page), "/blog").toBeLessThanOrEqual(0);

    const hrefs = [
      ...new Set(
        await page
          .locator('main a[href^="/blog/"]')
          .evaluateAll((els) => els.map((e) => e.getAttribute("href")!.split("#")[0]))
      ),
    ];
    expect(hrefs.length).toBeGreaterThanOrEqual(12);

    for (const href of hrefs) {
      await page.goto(href);

      await expect(page.locator("h1"), href).toHaveCount(1);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, href).toMatch(new RegExp(`${href}$`));

      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(jsonLd.some((t) => t.includes('"BlogPosting"')), href).toBe(true);

      const targets = await page
        .locator("a[data-toc-link]")
        .evaluateAll((els) => els.map((e) => e.getAttribute("href")!.slice(1)));
      for (const id of new Set(targets)) {
        await expect(page.locator(`[id="${id}"]`), `${href} → #${id}`).toHaveCount(1);
      }

      expect(await horizontalOverflow(page), href).toBeLessThanOrEqual(0);
    }
  });
});
