import { expect, test } from '@playwright/test';

test('CTA nền xanh giữ màu chữ trắng, không bị reset CSS ghi đè', async ({ page }) => {
  await page.goto('/cart');
  const action = page.getByRole('main').getByRole('link', { name: 'Khám phá bộ sưu tập' });
  await expect(action).toBeVisible();
  await expect(action).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('lọc nhanh theo dụng cụ và điều hướng desktop', async ({ page }) => {
  await page.goto('/shop');
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính', exact: true }).getByRole('link', { name: 'Bộ sưu tập' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('navigation', { name: 'Chọn nhanh cách pha' }).getByRole('button', { name: 'Drip bag', exact: true }).click();
  await expect(page).toHaveURL(/format=drip-bag/);
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card')).toContainText('Catimor');
});

test('carousel có thể dừng và điều khiển bằng bàn phím', async ({ page }) => {
  await page.goto('/');
  const pause = page.getByRole('button', { name: 'Tạm dừng chuyển lô tự động' });
  await pause.click();
  await expect(page.getByRole('button', { name: 'Bật chuyển lô tự động' })).toBeVisible();
  const next = page.getByRole('button', { name: 'Xem lô tiếp theo' });
  await next.focus();
  const before = await page.getByRole('region', { name: 'Các hồ sơ truy xuất nổi bật' }).innerText();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('region', { name: 'Các hồ sơ truy xuất nổi bật' })).not.toHaveText(before);
});

test('ảnh hướng dẫn dẫn đến nội dung drip bag thật', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Hướng dẫn pha Drip bag', exact: true }).click();
  await expect(page).toHaveURL(/brew-guide#drip-bag/);
  await expect(page.locator('#drip-bag')).toContainText('1 gói × 12 g');
});

test('chatbot không che sticky add-to-cart trên mobile và tự cuộn', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/shop/trs1-tay-nguyen-daily-phin');
  const trigger = page.getByRole('button', { name: 'Mở trợ lý cà phê DẤU VỊ' });
  const add = page.getByRole('button', { name: /Thêm TRS1.*vào giỏ/ });
  const chatBox = await trigger.boundingBox();
  const addBox = await add.boundingBox();
  expect(chatBox!.y + chatBox!.height).toBeLessThan(addBox!.y);
  await trigger.click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Tìm cà phê pha phin' }).click();
    await expect(page.getByRole('dialog').getByRole('status')).toHaveCount(0);
  }
  const log = page.getByRole('log');
  await expect.poll(() => log.evaluate(el => el.scrollHeight - el.scrollTop - el.clientHeight)).toBeLessThan(5);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
