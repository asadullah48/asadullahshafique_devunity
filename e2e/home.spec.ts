import { test, expect } from "@playwright/test";

test.describe("Portfolio home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-anchor-navigation-ready", "true");
  });

  test("renders hero section", async ({ page }) => {
    await expect(page.locator("h1, [id='home']").first()).toBeVisible();
  });

  test("hero primary CTA leads to the engagements", async ({ page }) => {
    await page.locator("#home").getByRole("link", { name: /hire me or book an audit/i }).click();
    await expect(page).toHaveURL(/#engagements$/);
    const engagements = page.locator("#engagements");
    await expect(engagements).toBeInViewport();
    await expect(engagements.locator("ol > li")).toHaveCount(3);
  });

  test("sections removed in the 2026-10-02 restructure stay removed", async ({ page }) => {
    // Seven sections restated the methodology or listed self-reported skills.
    // If one is restored, restore its nav link and llms.txt entry too.
    for (const id of ["skills", "roadmap", "expertise", "leverage", "industries", "forward-deployed"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(0);
      await expect(page.locator(`a[href="#${id}"]`)).toHaveCount(0);
    }
  });

  test("no unverified client testimonial is published", async ({ page }) => {
    await expect(page.locator('[id="testimonials"]')).toHaveCount(0);
  });

  test("Certifications section is reachable from the navbar", async ({ page }) => {
    const more = page.getByRole("button", { name: "More", exact: true });
    await more.click();
    await expect(more).toHaveAttribute("aria-expanded", "true");
    await page.locator('nav a[href="#certifications"]').first().click();
    await expect(page).toHaveURL(/#certifications$/);
    await expect(more).toHaveAttribute("aria-expanded", "false");
    const section = page.locator("#certifications");
    await expect(section).toBeInViewport();
    await expect(section.getByRole("listitem").first()).toBeVisible();
  });
});
