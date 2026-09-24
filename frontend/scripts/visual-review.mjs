import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const baseURL = process.env.REVIEW_URL || 'http://localhost:3000';
const output = 'playwright-report/visual-review';
const routes = ['/', '/shop', '/shop/trs1-tay-nguyen-daily-phin', '/shop/tr4-dak-lak-traceable-robusta', '/shop/tr9-large-bean-fine-robusta', '/shop/xanh-lun-ts5-bao-lam-honey', '/shop/catimor-da-lat-washed', '/shop/bourbon-langbiang-honey', '/traceability', '/traceability/TR4-DLK-26-N02', '/advisor', '/story', '/brew-guide', '/cart', '/checkout', '/login', '/register'];
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [375, 768, 1280, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    let errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    for (const route of routes) {
      errors = [];
      const response = await page.goto(baseURL + route, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(async () => {
        // Visit the entire page so lazy-loaded images are actually reviewed.
        for (let y = 0; y < document.body.scrollHeight; y += 650) {
          window.scrollTo(0, y);
          await new Promise(resolve => setTimeout(resolve, 60));
        }
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(150);
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.getAttribute('src')),
        h1: document.querySelector('main h1')?.textContent,
        visibleErrors: document.body.innerText.includes('Trang này chưa thể hiển thị trọn vẹn.'),
      }));
      const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '_');
      await page.screenshot({ path: `${output}/${width}-${name}.png`, fullPage: true });
      const entry = { width, route, status: response.status(), ...metrics, errors: [...errors] };
      results.push(entry);
      console.log(JSON.stringify(entry));
    }
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${output}/results.json`, JSON.stringify({ baseURL, results }, null, 2));
}
if (results.some(r => r.status !== 200 || r.overflow || r.brokenImages.length || r.errors.length || r.visibleErrors)) process.exitCode = 1;
