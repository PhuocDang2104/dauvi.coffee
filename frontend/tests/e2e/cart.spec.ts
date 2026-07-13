import { expect, test } from "@playwright/test";

test("giỏ hàng persist sau reload và cập nhật số lượng", async ({ page }) => {
  await page.goto("/shop/trs1-tay-nguyen-daily-phin");
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByRole("dialog", { name: /Giỏ hàng/ })).toBeVisible();
  await page.getByRole("button", { name: "Đóng giỏ hàng" }).click();

  await page.reload();
  await expect(page.locator('[data-testid="cart-count"]:visible')).toHaveText("1");
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Sản phẩm đã chọn" })).toBeVisible();
  await page.getByRole("button", { name: /Tăng số lượng TRS1/ }).click();
  await expect(page.locator('main output[aria-label="2 sản phẩm"]')).toBeVisible();
  await expect(page.evaluate(() => localStorage.getItem("vtc-cart-v1"))).resolves.toContain('"quantity":2');
});
