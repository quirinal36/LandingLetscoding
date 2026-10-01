// Run against `npm run dev`; optionally point PLAYWRIGHT_MODULE at a bundled runtime.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { mkdir } = require('node:fs/promises');

(async () => {
  await mkdir('artifacts/lounge', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto('http://127.0.0.1:3000/solutions/lounge');
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
    await page.locator('.ls-month-picker button').nth(1).click();
    await page.waitForFunction(() => document.querySelector('.ls-project-heading').textContent.startsWith('다음 달'));
    await page.locator('.ls-stage-picker button').nth(3).click();
    assert.match(await page.locator('#project-stage').innerText(), /경험이 다음 수업으로/);
    await page.locator('.ls-next').click();
    assert.match(await page.locator('.ls-project-heading').innerText(), /그다음 달/);
    assert.match(await page.locator('#project-stage').innerText(), /생각이 작품으로/);
    await page.locator('.ls-stage-picker button').nth(3).click();
    await page.locator('.ls-next').click();
    assert.match(await page.locator('.ls-project-heading').innerText(), /이번 달/);
    await page.locator('.ls-feature-list summary').first().click();
    assert.equal(await page.locator('.ls-feature-list details').first().getAttribute('open'), '');
    await page.locator('.ls-feature-list summary').first().click();
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      await page.evaluate(() => window.scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}px`);
      await page.screenshot({ path: `artifacts/lounge/page-${width}.png`, fullPage: true });
      if (width !== 320) {
        await page.locator('.ls-hero').screenshot({ path: `artifacts/lounge/hero-${width}.png` });
        await page.locator('.ls-blue').screenshot({ path: `artifacts/lounge/monthly-${width}.png` });
        await page.locator('#projects').screenshot({ path: `artifacts/lounge/projects-${width}.png` });
      }
    }
    assert.deepEqual(errors, [], 'no browser JavaScript errors');
    console.log('PASS: live page, month/stage selection, rollover, details, 1440/390/320px layouts; screenshots in artifacts/lounge');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
