import { test, expect } from "@playwright/test";

test.describe("Portfolio home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders hero section", async ({ page }) => {
    await expect(page.locator("h1, [id='home']").first()).toBeVisible();
  });

  test("renders Skills section", async ({ page }) => {
    await page.evaluate(() => document.querySelector("#skills")?.scrollIntoView());
    await expect(page.locator("#skills")).toBeVisible();
  });

  test("renders Roadmap section with 6 cards", async ({ page }) => {
    await page.evaluate(() => document.querySelector("#roadmap")?.scrollIntoView());
    const section = page.locator("#roadmap");
    await expect(section).toBeVisible();
    // 6 module cards (one per learning track)
    await expect(section.locator(".rounded-2xl")).toHaveCount(6);
  });

  test("Roadmap section shows Python Foundations card", async ({ page }) => {
    await page.evaluate(() => document.querySelector("#roadmap")?.scrollIntoView());
    await expect(page.getByText("Python Foundations")).toBeVisible();
  });

  test("Roadmap section shows all 5 module subtitles", async ({ page }) => {
    await page.evaluate(() => document.querySelector("#roadmap")?.scrollIntoView());
    for (const label of ["Module 01", "Module 02", "Module 03", "Module 04", "Module 05"]) {
      await expect(page.getByText(label)).toBeVisible();
    }
  });

  test("Navbar contains Roadmap link", async ({ page }) => {
    // Desktop nav + footer both contain the link — scope to the nav element
    const link = page.locator('nav a[href="#roadmap"]').first();
    await expect(link).toBeVisible();
  });
});
