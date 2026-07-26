import { expect, test } from "@playwright/test";

test("homepage dùng banner, bốn card và flavor map tương tác", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("img", { name: "Bản đồ địa hình Việt Nam giữa hoa và quả cà phê" })).toBeVisible();
  await expect(page.getByText("06 dòng cà phê")).toHaveCount(0);
  await expect(page.getByText("05 vùng trồng")).toHaveCount(0);
  await expect(page.getByText("06 hồ sơ lô demo")).toHaveCount(0);

  for (const title of ["Chọn theo gu", "Coffee Advisor", "Vùng trồng", "Best sellers"]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }

  const pathwayCards = page.locator("#collection-overview .home-pathway-card");
  await expect(pathwayCards).toHaveCount(4);
  await pathwayCards.first().hover();
  await page.waitForTimeout(650);
  const activeCard = await pathwayCards.nth(0).boundingBox();
  const restingCard = await pathwayCards.nth(1).boundingBox();
  expect(activeCard?.width ?? 0).toBeGreaterThan((restingCard?.width ?? 0) + 70);
  await expect(pathwayCards.first().getByText("Độ đậm", { exact: true })).toBeVisible();

  const langbiangMarker = page.getByRole("button", { name: "Langbiang, Arabica, 1.500–1.700 m" });
  await langbiangMarker.scrollIntoViewIfNeeded();
  await langbiangMarker.hover();
  await expect(page.locator("#vietnam-flavor-map").getByRole("heading", { name: "Langbiang", exact: true }).first()).toBeVisible();
  await expect(page.locator("#vietnam-flavor-map").getByRole("link", { name: "Bourbon Langbiang Honey" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Gói cà phê Bourbon Honey từ Langbiang" })).toBeVisible();
});

test("chatbot nổi trả gợi ý local mà không gọi backend", async ({ page }) => {
  await page.goto("/");
  const before = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    headingLeft: document.querySelector("h1")?.getBoundingClientRect().left,
  }));
  await page.getByRole("button", { name: "Mở trợ lý cà phê DẤU VỊ" }).click();
  await expect(page.getByRole("dialog", { name: "DẤU VỊ Coffee Assistant" })).toBeVisible();
  const after = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    headingLeft: document.querySelector("h1")?.getBoundingClientRect().left,
  }));
  expect(after).toEqual(before);
  await page.getByRole("button", { name: "Tìm cà phê pha phin" }).click();
  await expect(page.getByText(/TRS1 dễ tiếp cận/)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "DẤU VỊ Coffee Assistant" }).getByRole("link", { name: "Xem TR4", exact: true })).toBeVisible();
});

test("login và register validate trước khi nối auth backend", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /Đăng nhập/ }).click();
  await expect(page.getByText("Email chưa đúng định dạng.")).toBeVisible();
  await expect(page.getByText("Mật khẩu cần ít nhất 8 ký tự.")).toBeVisible();

  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Bắt đầu hành trình vị giác" })).toBeVisible();
  await page.getByRole("button", { name: /Tạo tài khoản/ }).click();
  await expect(page.getByText("Vui lòng nhập họ và tên.")).toBeVisible();
  await expect(page.getByText("Bạn cần đồng ý điều khoản để tiếp tục.")).toBeVisible();
});
