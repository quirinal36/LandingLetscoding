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
// 설치 위치: 뒷벽 왼쪽 B1, 오른쪽 B2 / 옆벽 왼쪽 S1, 오른쪽 S2 (2026-11-18 뒷벽 번호를 설치 순서대로 바꿨다)
const SHEETS = [['B1', '1-back-left-B1'], ['B2', '2-back-right-B2'], ['S1', '3-side-left-S1'], ['S2', '4-side-right-S2']];
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
        return [...p.querySelectorAll('.wall-copy,.wall-copy li,.projects figure')].flatMap(e => {
          const r = e.getBoundingClientRect();
          if (r.right <= b.left || r.left >= b.right) return [];
          const top = (r.top - b.top) / mm, bottom = (r.bottom - b.top) / mm;
          return r.left < b.left - 1 || r.right > b.right + 1 || top < 50 || bottom > H - 50 ? [e.textContent.trim().slice(0, 12)] : [];
        });
      }, [W, H]);
      assert.deepEqual(bad, [], `${id}: 장 밖 또는 봉 여백 침범`);
      assert.deepEqual(errors, [], `${id}: 불러오지 못한 파일`);
      const file = path.join(out, `banner-${name}-rgb.pdf`);
      if (id.startsWith('S')) await page.addStyleTag({ content: 'body.single,.side .scene{background:transparent}' });
      await page.pdf({ path: file, omitBackground: id.startsWith('S'), width: `${W}mm`, height: `${H}mm`, printBackground: true, preferCSSPageSize: true, pageRanges: '1' });
      if (id.startsWith('S')) require('node:child_process').execFileSync('python3', [path.join(__dirname, 'export-side-background.py'), id, file]);
      await page.close();
      console.log('OK', path.relative(process.cwd(), file));
    }
    const sign = await browser.newPage();
    await sign.goto(pathToFileURL(path.join(__dirname, 'signboard-dark-print.html')).href);
    await sign.evaluate(() => document.fonts.ready);
    const signDir = path.join(out, '../expo-signboard-2930x1000');
    await fs.mkdir(signDir, { recursive: true });
    await sign.pdf({path: path.join(signDir, 'signboard-2930x1000-rgb.pdf'), printBackground: true, preferCSSPageSize: true});
    await sign.close();
    require('node:child_process').execFileSync('python3', [path.join(__dirname, 'export-info-desk.py')], { stdio: 'inherit' });
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
