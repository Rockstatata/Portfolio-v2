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
    expect((await page.locator("h1").boundingBox())!.y).toBeLessThan(
      Math.max(170, viewport.height * 0.25),
    );
    await expect(
      page.getByText("Current mission", { exact: true }),
    ).toBeVisible();
    expect(await page.locator("#top canvas").count()).toBe(0);
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
    await page
      .getByRole("button", { name: "Robotics", exact: true })
      .first()
      .click();
    await expect(
      page.getByText("From language to action in the physical world."),
    ).toBeVisible();
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("reduced motion and content without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    javaScriptEnabled: false,
    baseURL: "http://localhost:3006",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.getByText("Current mission", { exact: true }),
  ).toBeVisible();
  await context.close();
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
