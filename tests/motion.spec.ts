import { expect, test } from "@playwright/test";

test("hero and scroll animations stay active even when the OS requests reduced motion", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const motionWindow = window as typeof window & { __shsMotionFrames: number };
    motionWindow.__shsMotionFrames = 0;
    for (const proto of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const original = proto.drawElements;
      proto.drawElements = function (this: WebGLRenderingContext, mode, count, type, offset) {
        if (this.canvas instanceof HTMLCanvasElement && this.canvas.closest("[data-orbital-core]")) motionWindow.__shsMotionFrames++;
        return original.call(this, mode, count, type, offset);
      };
    }
  });
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (/hydrated|hydration|didn't match/i.test(message.text())) hydrationErrors.push(message.text().split("\n")[0]);
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".arrival-screen")).toHaveCount(0);
  await expect(page.locator('[data-orbital-core] canvas')).toHaveCount(1, { timeout: 20000 });
  const before = await page.evaluate(() => (window as typeof window & { __shsMotionFrames: number }).__shsMotionFrames);
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => (window as typeof window & { __shsMotionFrames: number }).__shsMotionFrames);
  expect(after - before, "The visible 3D hero must redraw continuously").toBeGreaterThan(4);
  await expect(page.locator(".scroll-wheel span").first()).toHaveCSS("animation-name", "scroll-wheel");
  const entrance = page.locator("#about h2").locator("..");
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(entrance).toHaveCSS("opacity", "1");
  expect(hydrationErrors).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect.poll(() => entrance.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".scroll-wheel span").first()).toHaveCSS("animation-name", "scroll-wheel");
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
