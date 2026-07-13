import { expect, test } from "@playwright/test";

test("Advisor ưu tiên Catimor hoặc Bourbon cho pour-over ít đắng", async ({ page }) => {
  await page.goto("/advisor");
  await page.getByText("Cân bằng", { exact: true }).click();
  await page.getByText("Ít đắng", { exact: true }).click();
  await page.getByText("Một chút cân bằng", { exact: true }).click();
  await page.getByText("Pour-over", { exact: true }).click();
  await page.getByText("Mức vừa", { exact: true }).click();
  await page.getByText("Trải nghiệm premium", { exact: true }).click();

  await expect(page.getByRole("heading", { name: /dấu vị.*khẩu vị|Những dấu vị/i })).toBeVisible({ timeout: 5_000 });
  const recommendationText = await page.locator("main").innerText();
  expect(recommendationText).toMatch(/Catimor Đà Lạt Washed|Bourbon Langbiang Honey/);
  await expect(page.getByText(/bộ quy tắc từ dữ liệu sản phẩm/i)).toBeVisible();
});
