// BROCHURE_PLAYWRIGHT=/path/to/playwright node prototypes/brochure/check.cjs
// Exports the 10-page PDF; fails on changed source facts, missing assets or clipped print content.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.BROCHURE_PLAYWRIGHT || 'playwright');

(async () => {
  const root = path.resolve(__dirname, '../..');
  const previews = path.join(__dirname, 'previews/final');
  const output = path.join(root, 'output/pdf');
  await fs.mkdir(previews, { recursive: true });
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROCHURE_CHROME && { executablePath: process.env.BROCHURE_CHROME }) });
  try {
    const page = await browser.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure().errorText}`));
    await page.goto(process.env.BROCHURE_URL || pathToFileURL(path.join(__dirname, 'brochure.html')).href);
    await page.evaluate(() => document.fonts.ready);
    if (process.env.BROCHURE_URL) {
      await page.evaluate(() => { window.print = () => { window.printRequested = true; }; });
      await page.locator('#print-brochure').click();
      await page.waitForFunction(() => window.printRequested === true);
      const pdf = await page.request.get(new URL('/brochure/pdf', process.env.BROCHURE_URL).href);
      assert.equal(pdf.status(), 200);
      assert.match(pdf.headers()['content-type'], /application\/pdf/);
      assert.equal((await pdf.body()).subarray(0, 4).toString(), '%PDF');
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'live brochure must fit viewport');
      }
    }
    assert.equal(await page.locator('.sheet').count(), 10, 'must have ten sheets');
    assert.deepEqual(await page.locator('.sheet').evaluateAll(sheets => sheets.map(sheet => sheet.dataset.page)), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    assert.match(await page.locator('#cover').innerText(), /렛츠코딩라운지/);
    assert.match(await page.locator('#cover h1').innerText(), /학생의 아이디어가,/);
    assert.match(await page.locator('#page3 .record-scope').innerText(), /같은 교육기관 회원/);
    assert.match(await page.locator('#page5').innerText(), /이어지는 프로젝트 수업/);
    assert.match(await page.locator('#page5').innerText(), /자체 웹에디터에서 제작부터 배포까지/);
    assert.match(await page.locator('#page5').innerText(), /같은 작품에 업데이트/);
    assert.match(await page.locator('#page5').innerText(), /유해 요청을 제한/);
    assert.match(await page.locator('#page5').innerText(), /AI 분석 리포트/);
    assert.match(await page.locator('#page3').innerText(), /프로젝트별 코드·AI 대화·문서/);
    assert.doesNotMatch(await page.locator('body').innerText(), /7년차 코딩학원|AI 편집기를 제공하지|11,000원|원장님/);
    assert.match(await page.locator('#page10').innerText(), /자동 결제되지 않으며/);
    assert.match(await page.locator('#page10').innerText(), /매달 1회/);
    assert.match(await page.locator('#page6').innerText(), /5개 \/ 매달/);
    assert.match(await page.locator('#page7').innerText(), /작품공유/);
    assert.match(await page.locator('#page8').innerText(), /하나의 제작 환경에서/);
    assert.match(await page.locator('#page8').innerText(), /같은 작품에 업데이트/);
    assert.match(await page.locator('#page9').innerText(), /유해 요청 사용 제한/);
    assert.match(await page.locator('#page9').innerText(), /로그와 AI 분석 리포트/);
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).length), 0, 'missing image');
    const offer = await fs.readFile(path.join(root, 'src/lib/offer.ts'), 'utf8');
    for (const match of offer.matchAll(/value: (\d+), unit: "([^"]+)", label: "([^"]+)"/g)) {
      const stat = page.locator('.proof > div').filter({ hasText: match[3] });
      assert.equal((await stat.locator('dd').innerText()).replace(/[,\s]/g, ''), match[1] + match[2], 'proof must match source');
    }
    assert.equal(await page.locator('.proof-source').innerText(), offer.match(/PROOF_ASOF = "([^"]+)"/)[1]);
    const page10 = await page.locator('#page10').innerText();
    for (const text of ['4주 무료', '월 29,000원', 'AI LLM 토큰 비용·부가세 포함', 'contact@letscoding.kr', '010-5679-0072']) {
      assert(offer.includes(text) && page10.includes(text), `offer must match source: ${text}`);
    }
    assert.deepEqual(await page.locator('.qr-block > a').evaluateAll(links => links.map(link => link.href)), ['https://www.letscoding.kr/seminar/inquiry', 'https://lounge.letscoding.kr/works']);
    await page.emulateMedia({ media: 'print' });
    const defects = await page.locator('.sheet').evaluateAll(sheets => sheets.flatMap((sheet, index) => {
      const box = sheet.getBoundingClientRect();
      const failures = [];
      const safe = 12 * 96 / 25.4;
      if (Math.abs(box.width - 1122.52) > 1 || Math.abs(box.height - 793.7) > 1) failures.push(`page ${index + 1}: wrong A4 dimensions`);
      for (const node of sheet.querySelectorAll('*')) {
        const style = getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const bounds = node.getBoundingClientRect();
        if (bounds.width && bounds.height && (bounds.left < box.left - 1 || bounds.right > box.right + 1 || bounds.top < box.top - 1 || bounds.bottom > box.bottom + 1)) failures.push(`page ${index + 1}: outside page: ${node.className || node.tagName}`);
        for (const child of node.childNodes) {
          if (child.nodeType !== Node.TEXT_NODE || !child.textContent.trim()) continue;
          if (parseFloat(style.fontSize) < 12) failures.push(`page ${index + 1}: small text: ${child.textContent.trim()}`);
          const range = document.createRange();
          range.selectNodeContents(child);
          for (const rect of range.getClientRects()) if (rect.left < box.left + safe - 1 || rect.right > box.right - safe + 1 || rect.top < box.top + safe - 1 || rect.bottom > box.bottom - safe + 1) failures.push(`page ${index + 1}: outside safe area: ${child.textContent.trim()}`);
        }
      }
      return failures;
    }));
    assert.deepEqual(defects, [], 'print layout defects');
    for (let index = 0; index < 10; index++) await page.locator('.sheet').nth(index).screenshot({ path: path.join(previews, `page-${index + 1}.png`) });
    await page.pdf({ path: path.join(output, 'letscoding-lounge-brochure.pdf'), printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false, tagged: true });
    await page.emulateMedia({ media: 'screen' });
    await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.pages img').count(), 10);
    assert.equal(await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || !image.naturalWidth).length), 0, 'missing preview');
    await page.setViewportSize({ width: 1440, height: 1100 });
    assert.ok(await page.locator('.pages figure').evaluateAll(figures => figures.every((figure, index) => !index || Math.abs(figure.getBoundingClientRect().top - figures[index - 1].getBoundingClientRect().bottom) < 1)), 'preview pages must connect in one column');
    await page.locator('.pages').screenshot({ path: path.join(previews, 'overview.png') });
    await page.locator('.pages').screenshot({ path: path.join(previews, 'continuous.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'mobile preview must fit viewport');
    assert.deepEqual(errors, [], 'browser errors');
    console.log('PASS: ten A4 pages, source facts, QR links, 12mm safe area, assets and mobile preview. PDF exported.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
