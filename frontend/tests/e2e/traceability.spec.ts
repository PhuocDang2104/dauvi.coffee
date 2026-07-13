import { expect, test } from "@playwright/test";

test("tra mã TR4 và hiển thị passport demo sáu bước", async ({ page }) => {
  await page.goto("/traceability");
  const input = page.getByLabel("Mã lô trên nhãn");
  await input.pressSequentially("tr4-dlk-26-n02");
  await expect(input).toHaveValue("TR4-DLK-26-N02");
  await page.getByRole("button", { name: /Tra cứu lô/ }).click();

  await expect(page).toHaveURL(/traceability\/TR4-DLK-26-N02/);
  await expect(page.getByRole("heading", { name: "TR4-DLK-26-N02" })).toBeVisible();
  await expect(page.getByText(/^Demo Data: Dữ liệu lô và đơn vị sản xuất đang được mô phỏng/)).toBeVisible();
  await expect(page.getByRole("list", { name: "Hành trình truy xuất sáu bước" }).getByRole("listitem")).toHaveCount(6);
  await expect(page.getByRole("heading", { name: "TR4 Đắk Lắk Traceable Robusta" })).toBeVisible();
});
