// 500×500 정사각 표지(cover-square.html)를 PNG로 내보낸다. 원본 크기 1장과 선명한 2배(1000×1000) 1장.
// PW=/path/to/playwright CHROME=/path/to/chrome node output/hackathon-proposal/export-square.cjs [출력폴더]
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PW || 'playwright');

const outDir = process.argv[2] || path.join(__dirname, '../pdf');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME && { executablePath: process.env.CHROME }) });
  try {
    for (const [scale, name] of [[1, 'hackathon-cover-square-500.png'], [2, 'hackathon-cover-square-1000.png']]) {
      const page = await browser.newPage({ viewport: { width: 500, height: 500 }, deviceScaleFactor: scale });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => errors.push(`${r.url()} ${r.failure().errorText}`));
      await page.goto(pathToFileURL(path.join(__dirname, 'cover-square.html')).href, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
      });
      const overflow = await page.$eval('.text', el => el.scrollHeight > el.clientHeight + 1);
      if (overflow) console.warn('왼쪽 글 영역이 넘칩니다');
      if (errors.length) throw new Error(errors.join('\n'));
      const file = path.join(outDir, name);
      await page.locator('#cover-square').screenshot({ path: file });
      console.log(`PNG 저장: ${file}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
