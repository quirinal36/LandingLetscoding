// 부스 벽 2장 안(booth-2sheet.html)을 족자봉 인쇄용 RGB PDF로 출력한다. 장당 1,470×2,300mm, 한 파일에 한 장.
// 인포데스크 정면(info-desk.html, 950×660mm)도 ../pdf/expo-info-desk-950x660/에 함께 출력한다.
//   EXPO_PLAYWRIGHT=/path/to/playwright EXPO_CHROME=/path/to/chrome node output/ai-edu-expo/export-banner.cjs
//   이어서 CMYK(PDF/X-4): 파일마다 SRC=… OUT=… TITLE=… sh output/ai-edu-expo/export-cmyk.sh
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.EXPO_PLAYWRIGHT || 'playwright');

const W = 1470, H = 2300;
// 설치 위치: 뒷벽 왼쪽 B2, 오른쪽 B1 / 옆벽 왼쪽 S1, 오른쪽 S2
const SHEETS = [['B2', '1-back-left-B2'], ['B1', '2-back-right-B1'], ['S1', '3-side-left-S1'], ['S2', '4-side-right-S2']];
const html = path.join(__dirname, 'booth-2sheet.html');
const out = path.join(__dirname, '../pdf/expo-banner-147x230');

(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.EXPO_CHROME && { executablePath: process.env.EXPO_CHROME }) });
  try {
    for (const [id, name] of SHEETS) {
      const page = await browser.newPage();
      const errors = [];
      page.on('requestfailed', r => errors.push(r.url()));
      await page.goto(pathToFileURL(html).href + '?panel=' + id);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: 'print' });
      // 글자·카드가 장 안에 있고, 위아래 봉 감김 여백(50mm)에 핵심 요소가 없는지 확인한다.
      const bad = await page.evaluate(([W, H]) => {
        const p = document.querySelector('.panel.on'); const b = p.getBoundingClientRect(); const mm = b.width / W;
        return [...p.querySelectorAll('.t,.card,.point,.brand')].flatMap(e => {
          const r = e.getBoundingClientRect();
          if (r.right <= b.left || r.left >= b.right) return [];
          const top = (r.top - b.top) / mm, bottom = (r.bottom - b.top) / mm;
          return r.left < b.left - 1 || r.right > b.right + 1 || top < 50 || bottom > H - 50 ? [e.textContent.trim().slice(0, 12)] : [];
        });
      }, [W, H]);
      assert.deepEqual(bad, [], `${id}: 장 밖 또는 봉 여백 침범`);
      assert.deepEqual(errors, [], `${id}: 불러오지 못한 파일`);
      const file = path.join(out, `banner-${name}-rgb.pdf`);
      await page.pdf({ path: file, width: `${W}mm`, height: `${H}mm`, printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
      await page.close();
      console.log('OK', path.relative(process.cwd(), file));
    }
    // 인포데스크 정면 950×660mm (info-desk.html의 @media print 사용)
    {
      const page = await browser.newPage();
      const errors = [];
      page.on('requestfailed', r => errors.push(r.url()));
      await page.goto(pathToFileURL(path.join(__dirname, 'info-desk.html')).href);
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: 'print' });
      const bad = await page.evaluate(() => {
        const d = document.querySelector('.desk').getBoundingClientRect(); const mm = d.width / 950;
        return [...document.querySelectorAll('.desk .brand, .desk .headline > *, .desk .footer')].flatMap(e => {
          const r = e.getBoundingClientRect();
          return (r.left - d.left) / mm < 20 || (d.right - r.right) / mm < 20 || (r.top - d.top) / mm < 20 || (d.bottom - r.bottom) / mm < 20 ? [e.textContent.trim().slice(0, 12)] : [];
        });
      });
      assert.deepEqual(bad, [], 'info-desk: 가장자리 20mm 안쪽 침범');
      assert.deepEqual(errors, [], 'info-desk: 불러오지 못한 파일');
      const dir = path.join(__dirname, '../pdf/expo-info-desk-950x660');
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, 'info-desk-950x660-rgb.pdf');
      await page.pdf({ path: file, width: '950mm', height: '660mm', printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
      await page.close();
      console.log('OK', path.relative(process.cwd(), file));
    }
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
