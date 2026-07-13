import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/shop",
  "/shop/trs1-tay-nguyen-daily-phin",
  "/shop/tr4-dak-lak-traceable-robusta",
  "/shop/tr9-large-bean-fine-robusta",
  "/shop/xanh-lun-ts5-bao-lam-honey",
  "/shop/catimor-da-lat-washed",
  "/shop/bourbon-langbiang-honey",
  "/traceability",
  "/traceability/TR4-DLK-26-N02",
  "/advisor",
  "/story",
  "/brew-guide",
  "/cart",
  "/checkout",
];

test("mọi route phản hồi không có console/page/network error", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") failures.push(`console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`${response.status()}: ${response.url()}`);
  });

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.ok(), route).toBeTruthy();
    await expect(page.locator("main#main-content").last(), route).toBeVisible();
  }
  expect(failures).toEqual([]);
});

for (const viewport of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 },
]) {
  test(`không overflow ngang tại ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of ["/", "/shop", "/shop/catimor-da-lat-washed", "/traceability", "/advisor"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
      expect(dimensions.width, `${route} overflow at ${viewport.width}`).toBeLessThanOrEqual(dimensions.viewport + 1);
    }
  });
}
