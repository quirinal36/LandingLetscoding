// 12장 슬라이드를 화면과 같은 16:9 비율의 PDF 1개와 장별 PNG(1920×1080)로 내보낸다.
// PW=/path/to/playwright CHROME=/path/to/chrome node output/hackathon-proposal/export-pdf.cjs [출력경로]
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PW || 'playwright');

const W = 1600, H = 900;
const out = process.argv[2] || path.join(__dirname, '../pdf/hackathon-proposal.pdf');
const pngDir = process.argv[3] || path.join(__dirname, '../pdf/hackathon-proposal-png');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME && { executablePath: process.env.CHROME }) });
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1920 / W });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => errors.push(`${r.url()} ${r.failure().errorText}`));
    await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'screen' });
    await page.addStyleTag({ content: `
      @page{size:${W}px ${H}px;margin:0}
      html,body{background:var(--bg)!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}
      .toolbar,.skip,dialog,.error{display:none!important}
      main{display:block!important;padding:0!important;margin:0!important;max-width:none!important;min-height:0!important}
      .slide,.slide[hidden]{display:flex!important;width:${W}px!important;height:${H}px!important;aspect-ratio:auto!important;margin:0!important;break-after:page;break-inside:avoid}
      .slide:last-child{break-after:auto}
    ` });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    });
    const count = await page.locator('.slide').count();
    if (count !== 12) throw new Error(`slide count ${count}`);
    const overflow = await page.$$eval('.slide', s => s.map((n, i) => n.scrollHeight > n.clientHeight + 1 ? i + 1 : 0).filter(Boolean));
    if (overflow.length) console.warn('넘침 의심 슬라이드:', overflow.join(', '));
    if (errors.length) throw new Error(errors.join('\n'));
    await page.pdf({ path: out, width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true });
    console.log(`PDF 저장: ${out} (${count}쪽)`);
    await require('node:fs/promises').mkdir(pngDir, { recursive: true });
    for (let i = 0; i < count; i++) {
      await page.locator('.slide').nth(i).screenshot({ path: path.join(pngDir, `slide-${String(i + 1).padStart(2, '0')}.png`) });
    }
    console.log(`PNG 저장: ${pngDir} (${count}장)`);
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
