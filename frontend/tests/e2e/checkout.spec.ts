import { expect, test } from "@playwright/test";

test("checkout validate field bắt buộc và tạo xác nhận demo", async ({ page }) => {
  await page.goto("/shop/tr4-dak-lak-traceable-robusta");
  await page.getByTestId("add-to-cart").click();
  await page.getByRole("button", { name: "Đóng giỏ hàng" }).click();
  await page.goto("/checkout");

  await page.getByRole("button", { name: "Tạo đơn demo" }).click();
  await expect(page.getByText("Vui lòng nhập họ và tên người nhận.")).toBeVisible();
  await expect(page.getByText("Vui lòng nhập số điện thoại.")).toBeVisible();

  await page.getByLabel("Họ và tên").fill("Nguyễn Minh Anh");
  await page.getByLabel("Số điện thoại").fill("0912345678");
  await page.locator("#email").fill("minhanh@example.com");
  await page.getByLabel("Tỉnh / thành phố").fill("TP. Hồ Chí Minh");
  await page.getByLabel("Quận / huyện").fill("Quận 3");
  await page.getByLabel("Phường / xã").fill("Phường 6");
  await page.getByLabel("Số nhà, tên đường").fill("12 Nguyễn Đình Chiểu");
  await page.getByRole("checkbox", { name: /Tôi hiểu đây là đơn trình diễn/ }).check();
  await page.getByRole("button", { name: "Tạo đơn demo" }).click();

  await expect(page.getByRole("heading", { name: "Đơn demo đã được tạo" })).toBeVisible();
  await expect(page.getByText("Đây là luồng trình diễn frontend; chưa có giao dịch hoặc đơn hàng thật.")).toBeVisible();
});
