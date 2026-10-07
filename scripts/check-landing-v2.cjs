// Run with a dev server: BASE_URL=http://localhost:3002 PLAYWRIGHT_MODULE=/path/to/playwright node scripts/check-landing-v2.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { mkdir } = require('node:fs/promises');

(async () => {
  await mkdir('artifacts/landing-v2', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`${process.env.BASE_URL || 'http://localhost:3002'}/v2`);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.landing-v2 > section').count(), 9);
    assert.equal(await page.locator('.v2-work').count(), 3);
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
    await page.locator('.v2-hero .link-chevron').click();
    assert.equal(new URL(page.url()).hash, '#works');
    await page.locator('.v2-faq summary').nth(1).click();
    assert.equal(await page.locator('.v2-faq details').nth(1).getAttribute('open'), '');
    assert.match(await page.locator('.v2-faq details').nth(1).innerText(), /자체 웹에디터를 제공합니다/);
    await page.locator('.v2-faq summary').nth(1).press('Enter');
    assert.equal(await page.locator('.v2-faq details').nth(1).getAttribute('open'), null);
    for (const image of await page.locator('.landing-v2 img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
    }
    await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}px`);
      await page.locator('.v2-hero').screenshot({ path: `artifacts/landing-v2/hero-${width}.png` });
      await page.screenshot({ path: `artifacts/landing-v2/page-${width}.png`, fullPage: true });
    }
    const brokenImages = await page.locator('.landing-v2 img').evaluateAll(images => images.filter(image => image.complete && !image.naturalWidth).map(image => image.src));
    assert.deepEqual(brokenImages, [], 'no broken images');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.reload();
    await page.locator('.v2-finale').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.v2-finale h2').hasAttribute('data-shown'));
    await page.locator('.v2-finale .control').click();
    await page.waitForURL('**/seminar/inquiry');
    assert.deepEqual(errors, [], 'no browser JavaScript errors');
    console.log('PASS: /v2, 9 sections, work links, anchor, keyboard FAQ, CTA, reduced/normal motion, 1440/768/390/320px; screenshots: artifacts/landing-v2');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
