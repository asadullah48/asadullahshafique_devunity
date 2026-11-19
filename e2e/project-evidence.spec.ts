import { test, expect } from "@playwright/test";
import { TARGET_ROLE_URL } from "../src/lib/target-role";

for (const locale of ["en", "ar"] as const) {
  test(`${locale}: both offline evaluation project cards render`, async ({ page }) => {
    await page.goto(locale === "ar" ? "/ar" : "/");
    await expect(page.locator("html")).toHaveAttribute("data-anchor-navigation-ready", "true");
    const targetRole = page.locator("#delivery-evidence").getByRole("link", { name: /Forward Deployed Engineer · Anthropic/ });
    await expect(targetRole).toHaveAttribute("href", TARGET_ROLE_URL);
    await expect(targetRole).not.toContainText("UAE");
    await page.locator('nav a[href="#projects"]').click();
    const projects = page.locator("#projects");
    await expect(projects.getByRole("heading", { name: /Agent Failure Atlas:/ })).toBeVisible();
    await expect(projects.getByRole("heading", { name: /Agent Rehearsal:/ })).toBeVisible();
    await expect(projects.locator('a[href="https://asadullah48.github.io/agent-failure-atlas/"]')).toHaveCount(1);
    await expect(projects.locator('a[href="https://asadullah48.github.io/agent-rehearsal/"]')).toHaveCount(1);
  });
}
