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

  test("Roadmap section shows Python card", async ({ page }) => {
    await page.evaluate(() => document.querySelector("#roadmap")?.scrollIntoView());
    const roadmap = page.locator("#roadmap");
    await expect(roadmap.getByRole("heading", { name: "Python", exact: true })).toBeVisible();
    await expect(roadmap.getByText("Core Language", { exact: true })).toBeVisible();
  });

  test("Roadmap section shows all domain subtitle labels", async ({ page }) => {
    await page.evaluate(() => document.querySelector("#roadmap")?.scrollIntoView());
    const roadmap = page.locator("#roadmap");
    for (const label of ["Containerization", "Caching & Queuing", "Distributed Systems", "DevOps & Cloud", "AI Engineering"]) {
      await expect(roadmap.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("Navbar contains Roadmap link", async ({ page }) => {
    // Roadmap is a secondary section, so it lives in the "More" dropdown,
    // which renders its links only while open.
    await page.getByRole("button", { name: /more/i }).first().click();
    const link = page.locator('nav a[href="#roadmap"]').first();
    await expect(link).toBeVisible();
  });

  test("Certifications section is reachable from the navbar", async ({ page }) => {
    await page.getByRole("button", { name: /more/i }).first().click();
    await page.locator('nav a[href="#certifications"]').first().click();
    const section = page.locator("#certifications");
    await expect(section).toBeInViewport();
    await expect(section.getByRole("listitem").first()).toBeVisible();
  });
});
