import { test, expect } from "@playwright/test";

for (const mobile of [false, true]) {
  test(`agent methodology: ${mobile ? "mobile menu" : "desktop More menu"} opens the evidence page`, async ({ page }) => {
    await page.setViewportSize(mobile ? { width: 375, height: 812 } : { width: 1280, height: 900 });
    await page.goto("/how-i-build-agents", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-anchor-navigation-ready", "true");
    await page.getByRole("button", { name: mobile ? "Toggle menu" : "More", exact: true }).click();
    const link = page.locator('nav a[href="/how-i-build-agents"]:visible');
    await expect(link).toHaveAttribute("aria-current", "true");
    await link.click();
    await expect(page.getByRole("heading", { level: 1, name: "How I build agents" })).toBeVisible();
    for (const name of ["Harness → GuardrailAI", "Loop → Test suites and evals", "Graph → OrchestratorX and ProtoBridge"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
    }
    const harness = page.getByRole("region", { name: "Harness → GuardrailAI" });
    await expect(harness).toContainText("53 tests passed on 30 Oct 2026");
    await expect(harness.getByRole("link", { name: "GuardrailAI repository" })).toHaveAttribute("href", "https://github.com/asadullah48/guardrailai");
    const loop = page.getByRole("region", { name: "Loop → Test suites and evals" });
    await expect(loop).toContainText("65 passing, verified 30 Oct 2026");
    const graph = page.getByRole("region", { name: "Graph → OrchestratorX and ProtoBridge" });
    await expect(graph).toContainText("74 tests passing, verified 3 Nov 2026");
    await expect(graph.getByRole("link", { name: "ProtoBridge repository" })).toHaveAttribute("href", "https://github.com/asadullah48/protobridge");
    await expect(page.locator("main")).toContainText("synthetic data");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}