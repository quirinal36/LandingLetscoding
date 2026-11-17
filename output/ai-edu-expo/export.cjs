// EXPO_PLAYWRIGHT=/path/to/playwright EXPO_CHROME=/path/to/chrome node output/ai-edu-expo/export.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.EXPO_PLAYWRIGHT || 'playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.EXPO_CHROME && { executablePath: process.env.EXPO_CHROME }) });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.failure().errorText));
    await page.goto(process.env.EXPO_URL || pathToFileURL(path.join(__dirname, 'index.html')).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.decode()));
    });
    assert.equal(await page.locator('.sheet').count(), 16);
    assert.equal(await page.locator('.paper-stage').count(), 4);
    assert.equal(await page.locator('h1').count(), 1);
    assert.deepEqual(await page.locator('.sheet').evaluateAll(s => s.map(n => n.id)), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 12].map(i => `slide-${i}`));
    const visibleIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => `slide-${i}`);
    assert.deepEqual(await page.locator('.sheet:visible').evaluateAll(s => s.map(n => n.id)), visibleIds);
    assert.deepEqual(await page.locator('.toolbar a[href^="#slide-"]').evaluateAll(s => s.map(n => n.hash.slice(1))), visibleIds);
    const text = await page.locator('main').innerText();
    assert.doesNotMatch(text, /원생|4주 무료|자동 평가|AI 무제한/);
    if (process.env.EXPO_URL) {
      await page.evaluate(() => { window.print = () => { window.printRequested = true; }; });
      await page.locator('#print-brochure').click();
      await page.waitForFunction(() => window.printRequested === true);
      const pdf = await page.request.get(new URL('/ai-edu-expo/pdf', process.env.EXPO_URL).href);
      assert.equal(pdf.status(), 200);
      assert.match(pdf.headers()['content-type'], /application\/pdf/);
      assert.equal((await pdf.body()).subarray(0, 4).toString(), '%PDF');
    }
    const previews = path.join(process.env.TMPDIR || '/tmp', 'ai-edu-expo-revised');
    await fs.mkdir(previews, { recursive: true });
    for (const width of [1440, 1200, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `horizontal overflow at ${width}`);
      assert.ok(await page.locator('.sheet').evaluateAll(s => s.every(n => n.getBoundingClientRect().width <= 1200)), 'maximum width');
      if (width === 390) {
        await page.locator('#slide-1').screenshot({ path: path.join(previews, 'cover-mobile.png') });
        await page.locator('#slide-12').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(previews, 'mobile.png') });
      }
    }
    await page.setViewportSize({ width: 1123, height: 900 });
    await page.emulateMedia({ media: 'print' });
    assert.deepEqual(await page.locator('.sheet:visible').evaluateAll(s => s.map(n => n.id)), visibleIds);
    assert.deepEqual(await page.locator('.sheet:visible .page-foot span:last-child').allTextContents(), Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')} / 12`));
    const cover = await page.locator('#slide-1').boundingBox();
    const coverImage = await page.locator('#slide-1 .cover-emblem').boundingBox();
    const coverCopy = await page.locator('#slide-1 .outer-front').boundingBox();
    assert.ok(coverCopy.x + coverCopy.width <= coverImage.x - 16, 'cover copy has space before image');
    assert.ok(Math.abs(coverImage.y - cover.y) < 1 && Math.abs(coverImage.height - cover.height) < 1, 'cover image fills page height');
    assert.ok(Math.abs(coverImage.x + coverImage.width - cover.x - cover.width) < 1, 'cover image reaches right edge');
    const overflow = await page.locator('.sheet:visible').evaluateAll(sheets => sheets.flatMap(sheet => {
      const box = sheet.getBoundingClientRect();
      const defects = [];
      const footer = sheet.querySelector('.page-foot').getBoundingClientRect();
      for (const child of sheet.children) {
        if (child.classList.contains('page-foot') || !child.getClientRects().length) continue;
        // The cover image intentionally fills the page beside the left-column footer.
        if (sheet.id === 'slide-1' && child.classList.contains('cover-emblem')) continue;
        if (child.getBoundingClientRect().bottom > footer.top - 8) defects.push(`${sheet.id}: footer collision ${child.className || child.tagName}`);
      }
      for (const node of sheet.querySelectorAll('*')) {
        if (node.closest('svg') || !node.getClientRects().length) continue;
        // Product captures and paper layers are intentionally cropped by their frames.
        if (node.closest('.projects-crop') || node.closest('.paper-stage')) continue;
        const r = node.getBoundingClientRect();
        if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) defects.push(`${sheet.id}: ${node.className || node.tagName}`);
        for (const child of node.childNodes) {
          if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) continue;
          const range = document.createRange(); range.selectNodeContents(child);
          if ([...range.getClientRects()].some(r => r.bottom > box.bottom - 15 || r.right > box.right + 1)) defects.push(`${sheet.id}: text ${child.textContent}`);
        }
      }
      return defects;
    }));
    assert.deepEqual(overflow, [], 'print content overflow');
    for (let i = 0; i < 12; i++) await page.locator('.sheet:visible').nth(i).screenshot({ path: path.join(previews, `page-${i + 1}.png`) });
    const withBleed = process.env.EXPO_BLEED === '3';
    if (withBleed) await page.addScriptTag({ path: path.join(__dirname, 'prepare-bleed.js') });
    const output = path.resolve(__dirname, withBleed
      ? '../../tmp/pdfs/letscoding-school-brochure-bleed-rgb.pdf'
      : '../pdf/letscoding-school-brochure.pdf');
    await fs.mkdir(path.dirname(output), { recursive: true });
    await page.pdf({ path: output, printBackground: true, preferCSSPageSize: true, tagged: true });
    await page.emulateMedia({ media: 'screen', reducedMotion: 'no-preference' });
    if (await page.evaluate(() => CSS.supports('animation-timeline', 'view()'))) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.paper-layer')).opacity === '0');
      await page.locator('.paper-stage').first().evaluate(stage => window.scrollTo(0, stage.getBoundingClientRect().top + scrollY - 100));
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.paper-layer')).opacity === '1');
    }
    assert.deepEqual(errors, [], 'browser errors');
    console.log(`PASS: 12 visible pages (16 preserved); five viewport widths; images; print layout. PDF: ${output}. Previews: ${previews}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
