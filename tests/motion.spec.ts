import { expect, test } from "@playwright/test";

test("motion preferences hydrate cleanly and update while the page is open", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (/hydrated|hydration|didn't match/i.test(message.text())) hydrationErrors.push(message.text().split("\n")[0]);
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".arrival-screen")).toHaveCount(0);
  const entrance = page.locator("#about h2").locator("..");
  await expect(entrance).toHaveCSS("opacity", "1");
  expect(hydrationErrors).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect.poll(() => entrance.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(entrance).toHaveCSS("transform", "none");
  await context.close();
});

test("desktop wheel and anchor scrolling advance across animation frames", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".arrival-screen")).toHaveCount(0);
  await page.mouse.wheel(0, 500);
  const positions = await page.evaluate(async () => {
    const samples: number[] = [];
    for (let i = 0; i < 12; i++) {
      await new Promise(requestAnimationFrame);
      samples.push(Math.round(window.scrollY));
    }
    return samples;
  });
  expect(new Set(positions).size).toBeGreaterThan(3);
  expect(positions.at(-1)).toBeGreaterThan(positions[0]);
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About", exact: true }).click();
  await expect.poll(() => page.locator("#about").evaluate(element => Math.abs(element.getBoundingClientRect().top - 96))).toBeLessThan(8);
});
