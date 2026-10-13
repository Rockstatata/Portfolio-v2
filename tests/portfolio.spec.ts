import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
]) {
  test(`mobile layout and navigation ${viewport.width}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL: "http://localhost:3006",
      viewport,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();
    // Measure the settled layout after the hero's visible entrance.
    await expect.poll(async () => (await page.locator("h1").boundingBox())!.y).toBeLessThan(
      Math.max(170, viewport.height * 0.25),
    );
    await expect(
      page.getByText("Current mission", { exact: true }),
    ).toBeVisible();
    // Next dev compiles these lazy-loaded scenes separately from the page.
    await expect(page.locator("[data-galaxy] canvas")).toHaveCount(1, { timeout: 20000 });
    await expect(page.locator("[data-orbital-core] canvas")).toHaveCount(1, { timeout: 20000 });
    await expect(page.locator(".arrival-screen")).toHaveCount(0);
    await page.screenshot({
      path: `.data/mobile-after-${viewport.width}.png`,
      caret: "initial",
    });
    const menu = page.getByRole("button", { name: "Open menu" });
    const box = (await menu.boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    await menu.click();
    await expect(
      page.getByRole("dialog", { name: "Navigation" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    for (const id of ["about", "projects", "experience", "skills", "contact"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      const sizing = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(
        sizing.scroll,
        `${id}: ${JSON.stringify(sizing)}`,
      ).toBeLessThanOrEqual(viewport.width);
    }
    const layers = page.getByRole("group", { name: "Research map layers" });
    const story = page.locator("#research-map-story");
    for (const [label, heading, href] of [
      ["Build", "Software is the foundation.", "#projects"],
      ["Compute", "Go deeper into the machine.", "#focus"],
      ["Collaborate", "Intelligence has to work together.", "#research"],
      ["Explore", "A direction beyond the horizon.", "#about"],
    ]) {
      const button = layers.getByRole("button", { name: new RegExp(label) });
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(layers.locator('[aria-pressed="true"]')).toHaveCount(1);
      await expect(story.getByRole("heading")).toHaveText(heading);
      await expect(story.getByRole("link")).toHaveAttribute("href", href);
    }
    await page.getByRole("button", { name: "Reset view" }).click();
    await expect(layers.getByRole("button", { name: /Compute/ })).toHaveAttribute("aria-pressed", "true");
    await expect(
      page
        .locator("#top")
        .getByRole("link", { name: "Instagram", exact: true }),
    ).toHaveAttribute("href", "https://www.instagram.com/pianto._/");
    await expect(
      page.locator("#top").getByRole("link", { name: "Facebook", exact: true }),
    ).toHaveAttribute("href", "https://www.facebook.com/Hasan.Sarwad07/");
    await expect(
      page.locator("#top").getByRole("link", { name: "LeetGPU", exact: true }),
    ).toHaveAttribute("href", "https://leetgpu.com/UnbreakableProdigyf0e38");
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("content remains readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    javaScriptEnabled: false,
    baseURL: "http://localhost:3006",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#research-map-story")).toContainText("GPU computing");
  await expect(
    page.getByText("Current mission", { exact: true }),
  ).toBeVisible();
  await context.close();
});

test("scroll entrances repeat and unsupported WebGL stays usable", async ({
  playwright,
}) => {
  const browser = await playwright.chromium.launch({
    channel: "msedge",
    args: ["--disable-webgl"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://localhost:3006", { waitUntil: "networkidle" });
  await expect(page.locator(".arrival-screen")).toHaveCount(0);
  await expect(page.locator(".galaxy-fallback")).toBeVisible();
  await expect(page.locator(".core-fallback")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("button", { name: "Collaborate", exact: true }).click();
  await expect(page.locator("#research-map-story")).toContainText("multi-robot search and rescue");
  const heading = page.locator("#about h2").locator("..");
  const position = await heading.evaluate((element) => ({
    top: element.getBoundingClientRect().top + window.scrollY,
    height: element.getBoundingClientRect().height,
  }));
  const opacity = () =>
    heading.evaluate((element) => Number(getComputedStyle(element).opacity));
  for (let repeat = 0; repeat < 2; repeat++) {
    await page.evaluate(
      ({ top, height }) =>
        window.scrollTo({
          top: top - (window.innerHeight - height) / 2,
          behavior: "instant",
        }),
      position,
    );
    await expect.poll(opacity).toBeGreaterThan(0.95);
    await page.evaluate(
      ({ top, height }) =>
        window.scrollTo({ top: top + height + 100, behavior: "instant" }),
      position,
    );
    await expect.poll(opacity).toBeLessThan(0.85);
  }
  expect(errors).toEqual([]);
  await browser.close();
});

test("blog draft, preview, publish, search, edit and unpublish", async ({
  page,
}) => {
  test.slow();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/admin/login");
  await page.getByLabel(/passphrase/i).fill("portfolio-e2e-only");
  await page.getByRole("button", { name: /sign in|enter|log in/i }).click();
  await page.waitForURL("/admin");
  await page.goto("/admin/posts/new");
  await page.getByLabel("Title", { exact: false }).fill("E2E Research Note");
  await page.getByLabel("URL slug", { exact: false }).fill("e2e-research-note");
  await page
    .getByLabel("Short introduction")
    .fill("A test of the complete writing workflow.");
  await page.getByLabel("Topics").fill("Research, GPU");
  await page
    .getByLabel("Article", { exact: false })
    .fill(
      "## A useful finding\n\nA private draft marker. **Measurable results.**\n\n[Unsafe](javascript:alert(1))\n\n<script>alert(1)</script>",
    );
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A useful finding" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  await page.getByRole("button", { name: "Save post" }).click();
  await page.waitForURL(/\/admin\/posts\?saved/);
  await page.goto("/blog/e2e-research-note");
  await expect(
    page.getByText("A private draft marker.", { exact: false }),
  ).toHaveCount(0);
  await page.goto("/admin/posts");
  await page.getByRole("link", { name: /edit/i }).first().click();
  await page.getByLabel("Publication status").selectOption("published");
  await page.getByRole("button", { name: "Save post" }).click();
  await page.waitForURL(/\/admin\/posts\?saved/);
  await page.goto("/blog");
  await page.getByRole("searchbox", { name: "Search journal" }).fill("E2E");
  await expect(
    page.getByRole("heading", { name: "E2E Research Note" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /E2E Research Note/ }).click();
  await expect(
    page.getByRole("heading", { name: "A useful finding" }),
  ).toBeVisible();
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  await page.goto("/admin/posts");
  await page.getByRole("link", { name: /edit/i }).first().click();
  await page.getByLabel("Publication status").selectOption("draft");
  await page.getByRole("button", { name: "Save post" }).click();
  await page.waitForURL(/\/admin\/posts\?saved/);
  await page.goto("/blog/e2e-research-note");
  await expect(
    page.getByText("A private draft marker.", { exact: false }),
  ).toHaveCount(0);
});
