import { test, expect } from "@playwright/test";

test("reading list section renders its three groups", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#reading");
  await expect(section.getByRole("heading", { level: 2, name: "What shaped how I build agents", exact: true })).toBeVisible();
  for (const name of ["Guides", "Research papers", "Reading next"]) {
    await expect(section.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  }
});
