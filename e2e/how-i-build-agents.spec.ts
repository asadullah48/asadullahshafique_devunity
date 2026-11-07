import { test, expect } from "@playwright/test";

const mapping = [
  "Harness → GuardrailAI + ProtoBridge",
  "Loop → evals/cases + per-repo test suites",
  "Graph → OrchestratorX",
];

for (const mobile of [false, true]) {
  test(`agent methodology: ${mobile ? "mobile menu" : "desktop More menu"} opens the evidence page`, async ({ page }) => {
    await page.setViewportSize(mobile ? { width: 375, height: 812 } : { width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-anchor-navigation-ready", "true");
    const toggle = page.getByRole("button", { name: mobile ? "Toggle menu" : "More", exact: true });
    await toggle.click();
    const link = page.locator('nav a[href="/how-i-build-agents"]:visible');
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(/\/how-i-build-agents$/);
    await expect(page.getByRole("heading", { level: 1, name: "How I build agents" })).toBeVisible();
    await toggle.click();
    await expect(link).toHaveAttribute("aria-current", "true");
    await toggle.click();
    for (const name of mapping) {
      await expect(page.getByRole("heading", { level: 2, name })).toHaveCount(1);
    }
    const harness = page.getByRole("region", { name: mapping[0] });
    await expect(harness).toContainText("deterministic pre-model checks");
    await expect(harness).toContainText("protocol-level tool access");
    await expect(harness.getByRole("link", { name: "GuardrailAI" })).toHaveAttribute("href", "https://github.com/asadullah48/guardrailai/tree/69dd5d9");
    const loop = page.getByRole("region", { name: mapping[1] });
    await expect(loop).toContainText("trace-checked evals");
    for (const result of ["41 tests · 1ca950a", "42 tests · 69dd5d9", "74 tests · verified 3 Nov 2026 · 69cd28a", "49 tests"]) {
      await expect(loop).toContainText(result);
    }
    const graph = page.getByRole("region", { name: mapping[2] });
    await expect(graph.getByRole("link", { name: "OrchestratorX" })).toBeVisible();
    await expect(page.locator("main")).toContainText("synthetic data");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("homepage Agent Engineering links to the same methodology and evidence", async ({ page }) => {
  await page.goto("/#agent-engineering");
  const homeSection = page.locator("#agent-engineering");
  await expect(homeSection).toContainText("synthetic data");
  const labels = [...mapping, "Per-repo test suites"];
  const homeEvidence: string[] = [];
  for (const name of labels) {
    const evidence = homeSection.getByRole("list", { name, exact: true });
    await evidence.scrollIntoViewIfNeeded();
    await expect(evidence).toHaveText(/\S/, { useInnerText: true });
    homeEvidence.push(await evidence.innerText());
  }
  await homeSection.getByRole("link", { name: "Read how I build agents →" }).click();
  await expect(page).toHaveURL(/\/how-i-build-agents$/);
  for (const [index, name] of labels.entries()) {
    await expect(page.getByRole("list", { name, exact: true })).toHaveText(homeEvidence[index], { useInnerText: true });
  }
});
