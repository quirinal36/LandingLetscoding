// DETAIL_PLAYWRIGHT=/path/to/playwright DETAIL_CHROME=/path/to/chrome node prototypes/lounge-detail/export.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.DETAIL_PLAYWRIGHT || 'playwright');

const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'output/lounge-detail');
const parts = path.join(output, 'sections');
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

function inline(file) {
  assert(mime[path.extname(file)], `unsupported asset: ${file}`);
  return `data:${mime[path.extname(file)]};base64,${fs.readFileSync(file).toString('base64')}`;
}

(async () => {
  fs.mkdirSync(parts, { recursive: true });
  const fontsFile = path.join(root, 'prototypes/brochure/fonts.css');
  const fonts = fs.readFileSync(fontsFile, 'utf8').replace(/url\(([^)]+)\)/g, (_, asset) => `url(${inline(path.resolve(path.dirname(fontsFile), asset))})`);
  const source = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const html = source.replace('<link rel="stylesheet" href="../brochure/fonts.css">', `<style>${fonts}</style>`)
    .replace(/src="([^"]+)"/g, (_, asset) => `src="${inline(path.resolve(__dirname, asset))}"`)
    .replace(/(<image\s+)href="([^"]+)"/g, (_, tag, asset) => `${tag}href="${inline(path.resolve(__dirname, asset))}"`);
  const htmlPath = path.join(output, 'letscoding-lounge-detail.html');
  fs.writeFileSync(htmlPath, html);
  fs.copyFileSync(path.join(root, 'public/fonts/pretendard/OFL.txt'), path.join(output, 'OFL.txt'));
  const browser = await chromium.launch({ headless: true, ...(process.env.DETAIL_CHROME && { executablePath: process.env.DETAIL_CHROME }) });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure().errorText}`));
    await page.goto(pathToFileURL(htmlPath).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.decode()));
    });
    const text = await page.locator('body').innerText();
    assert.doesNotMatch(text, /학원|원장|원생|4주|무료|29,?000|파일럿|자동 결제|첫 수업 코칭|재원율/);
    for (const term of ['학교', '작품공유', '가상경제', '과제관리', '포트폴리오', '루캣', 'AI 분석 리포트', '나나쌤', '기능 검증용 시험 프로젝트']) assert(text.includes(term), `missing content: ${term}`);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('section').count(), 10);
    assert.equal(await page.locator('.feature-cards article').count(), 3);
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(image => !image.naturalWidth || (!image.alt && image.getAttribute('aria-hidden') !== 'true')).length), 0);
    assert.match(await page.locator('.hero h1').innerText(), /학생 한 명이,[\s\S]*스타트업이 됩니다/);
    assert.equal(await page.locator('.hero-river .river-row').count(), 3);
    assert.equal(await page.locator('.infinity-window image[href^="data:"]').count(), 1);
    assert.equal(await page.locator('.paper-stage').count(), 4);
    assert.deepEqual(await page.locator('main > section').evaluateAll(sections => sections.slice(0, 3).map(section => section.getAttribute('aria-labelledby'))), ['hero-title', 'era-title', 'journey-title']);
    assert.equal(await page.locator('.paper-layer').evaluateAll(layers => layers.filter(layer => getComputedStyle(layer).opacity !== '1').length), 0, 'static export must show every paper layer');
    assert.equal(await page.locator('a').getAttribute('href'), 'https://lounge.letscoding.kr/works');
    assert.equal(await page.locator('link[rel="stylesheet"], script, img:not([src^="data:"])').count(), 0, 'standalone artifact must be self-contained');

    for (const width of [1440, 1200, 900, 768, 600, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await page.evaluate(() => {
        const main = document.querySelector('main').getBoundingClientRect();
        const overflow = [];
        for (const node of document.querySelectorAll('main *')) {
          // The landing hero intentionally crops the tilted artwork rows inside this mask.
          if (node.closest('svg') || node.closest('.river-tilt') || !node.getClientRects().length) continue;
          const box = node.getBoundingClientRect();
          if (box.left < main.left - 1 || box.right > main.right + 1) overflow.push(node.className || node.tagName);
          for (const child of node.childNodes) {
            if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(child);
            if ([...range.getClientRects()].some(rect => rect.left < main.left - 1 || rect.right > main.right + 1)) overflow.push(child.textContent);
          }
        }
        return { width: main.width, scrollWidth: document.documentElement.scrollWidth, overflow };
      });
      assert.equal(layout.width, Math.min(width, 1200), `maximum width at ${width}`);
      assert(layout.scrollWidth <= width, `horizontal scroll at ${width}`);
      assert.deepEqual(layout.overflow, [], `content overflow at ${width}`);
      if (width === 390) {
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.screenshot({ path: path.join(output, 'mobile-preview.png'), fullPage: true, clip: { x: 0, y: 0, width, height } });
      }
    }
    await page.setViewportSize({ width: 1200, height: 900 });
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    // Explicit bounds avoid repeated viewport tiles in Chrome's full-page capture.
    await page.screenshot({ path: path.join(output, 'letscoding-lounge-detail-1200.png'), fullPage: true, clip: { x: 0, y: 0, width: 1200, height } });
    const sections = await page.locator('main > section, main > footer').all();
    const sizes = [];
    for (let i = 0; i < sections.length; i++) {
      const bounds = await sections[i].boundingBox();
      const top = i === 0 ? 0 : Math.round(bounds.y);
      const bottom = Math.round(bounds.y + bounds.height);
      const name = `${String(i + 1).padStart(2, '0')}.png`;
      await page.screenshot({ path: path.join(parts, name), fullPage: true, clip: { x: 0, y: top, width: 1200, height: bottom - top } });
      sizes.push({ file: `sections/${name}`, width: 1200, height: bottom - top });
    }
    assert.deepEqual(errors, [], 'browser errors');
    assert.equal(sizes.reduce((sum, section) => sum + section.height, 0), height, 'image sections must join without gaps');
    fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify({ width: 1200, height, sections: sizes }, null, 2) + '\n');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    assert(await page.evaluate(() => CSS.supports('animation-timeline', 'view()')), 'browser must support paper scroll animation for this check');
    const layer = page.locator('.paper-layer').first();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.paper-layer')).opacity === '0');
    await page.locator('.paper-stage').first().evaluate(stage => window.scrollTo(0, stage.getBoundingClientRect().top + window.scrollY - 100));
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.paper-layer')).opacity === '1');
    assert.equal(await layer.evaluate(node => node.getAnimations().length), 1, 'paper layer must animate with scrolling');
    assert.deepEqual(errors, [], 'browser errors');
    console.log(`PASS: landing hero + infinity + four paper scenes; paper scroll animation; standalone HTML; excluded copy; seven viewport widths. Exported 1200 × ${height} PNG and ${sizes.length} continuous sections.`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
