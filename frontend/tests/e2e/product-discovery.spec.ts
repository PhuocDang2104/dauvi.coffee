import { expect, test } from "@playwright/test";

test("lọc Arabica, chọn Catimor xay pour-over và thêm vào giỏ", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("checkbox", { name: "Arabica" }).click();
  await expect(page).toHaveURL(/species=arabica/);
  await expect(page.getByRole("checkbox", { name: "Arabica" })).toBeChecked();
  await expect(page.getByRole("heading", { name: "Catimor Đà Lạt Washed" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "TR4 Đắk Lắk Traceable Robusta" })).toHaveCount(0);

  await page.getByRole("heading", { name: "Catimor Đà Lạt Washed" }).getByRole("link").click();
  await expect(page).toHaveURL(/catimor-da-lat-washed/);
  await page.getByRole("radio", { name: "Cà phê xay" }).click();
  await page.getByRole("radio", { name: "250 g" }).click();
  await page.getByRole("radio", { name: "Pour-over" }).click();
  await page.getByTestId("add-to-cart").click();

  await expect(page.getByRole("dialog", { name: /Giỏ hàng/ })).toBeVisible();
  await expect(page.getByRole("dialog").getByText("Catimor Đà Lạt Washed", { exact: true })).toBeVisible();
  await expect(page.locator('[data-testid="cart-count"]:visible')).toHaveText("1");
});
