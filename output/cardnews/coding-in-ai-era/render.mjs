// 사용법: node output/cardnews/coding-in-ai-era/render.mjs [cards.html 경로] [출력 폴더]
// 기본값: 이 폴더의 cards.html → 이 폴더의 png/, cardnews.zip, preview.png
// Playwright·JSZip은 ../letscoding_lounge/node_modules 것을 절대 경로로 빌려 쓴다(이 저장소에 설치하지 않음).
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const LOUNGE_MODULES = '/Users/letscoding/Documents/workspace/github/letscoding_lounge/node_modules';
const require = createRequire(path.join(LOUNGE_MODULES, 'x.js'));
const { chromium } = require('playwright');
const JSZip = require('jszip');

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(process.argv[2] ?? path.join(here, 'cards.html'));
const outDir = path.resolve(process.argv[3] ?? path.dirname(htmlPath));
const pngDir = path.join(outDir, 'png');
await mkdir(pngDir, { recursive: true });

// 원고 검증(선택): 같은 폴더의 manuscript.json이 있으면 각 카드 텍스트가 모두 들어갔는지 확인
let manuscript = null;
try { manuscript = JSON.parse(await readFile(path.join(path.dirname(htmlPath), 'manuscript.json'), 'utf8')); } catch {}
const normalize = text => text.replace(/[\s ]/g, '').replace(/[“”"‘’'·…—–\-]/g, '');

const browser = await chromium.launch();
const zip = new JSZip();
const problems = [];
try {
  const page = await browser.newPage({ viewport: { width: 2300, height: 1500 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => problems.push('pageerror: ' + e.message));
  page.on('requestfailed', r => problems.push('requestfailed: ' + r.url()));
  page.on('console', m => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  await page.goto(pathToFileURL(htmlPath).href);
  await page.evaluate(() => document.fonts.ready);
  const fontsLoaded = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight));
  const count = await page.locator('.card').count();
  assert.ok(count > 0, 'no .card elements');
  const names = [];
  for (let i = 0; i < count; i++) {
    const card = page.locator('.card').nth(i);
    const box = await card.boundingBox();
    if (Math.round(box.width) !== 1080 || Math.round(box.height) !== 1350) problems.push(`card ${i + 1}: size ${Math.round(box.width)}×${Math.round(box.height)} (expected 1080×1350)`);
    // 글자 요소가 자신의 부모 영역이나 카드 밖으로 나가는지, 가로 스크롤이 생기는지 검사
    const outside = await card.evaluate(el => {
      const cardBox = el.getBoundingClientRect();
      const out = [];
      for (const child of el.querySelectorAll('h1,h2,h3,p,li,span,small,strong,em,blockquote,figcaption')) {
        if (!child.textContent.trim()) continue;
        const b = child.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) continue;
        const pb = child.parentElement.getBoundingClientRect();
        const reasons = [];
        if (b.left < cardBox.left - 1 || b.right > cardBox.right + 1 || b.top < cardBox.top - 1 || b.bottom > cardBox.bottom + 1) reasons.push('outside card');
        const ps = getComputedStyle(child.parentElement);
        if (ps.overflow !== 'visible' && (b.left < pb.left - 1 || b.right > pb.right + 1 || b.top < pb.top - 1 || b.bottom > pb.bottom + 1)) reasons.push('clipped by parent');
        if (child.scrollWidth > child.clientWidth + 2 && getComputedStyle(child).overflowX !== 'visible') reasons.push('horizontal overflow');
        if (reasons.length) out.push(reasons.join('+') + ': ' + child.textContent.trim().slice(0, 40));
      }
      // 카드 자체의 내용 높이가 1350을 넘는지
      if (el.scrollHeight > el.clientHeight + 1) out.push(`card content taller than card (${el.scrollHeight})`);
      return out;
    });
    for (const o of outside) problems.push(`card ${i + 1}: ${o}`);
    // 최소 글자 크기 검사: 카드 안 보이는 텍스트 노드의 font-size가 32px 미만이면 경고
    const tooSmall = await card.evaluate(el => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const found = new Set();
      let n;
      while ((n = walker.nextNode())) {
        if (!n.textContent.trim()) continue;
        const fs = parseFloat(getComputedStyle(n.parentElement).fontSize);
        if (fs < 32) found.add(`${Math.round(fs)}px: ${n.textContent.trim().slice(0, 30)}`);
      }
      return [...found];
    });
    for (const t of tooSmall) problems.push(`card ${i + 1}: font smaller than 32px → ${t}`);
    if (manuscript?.cards?.[i]) {
      const actual = normalize(await card.innerText());
      const m = manuscript.cards[i];
      for (const field of ['headline', 'body', 'note', 'label', 'kicker']) {
        const v = m[field];
        if (!v) continue;
        const parts = Array.isArray(v) ? v : [v];
        for (const p of parts) if (p && !actual.includes(normalize(String(p)))) problems.push(`card ${i + 1}: manuscript ${field} text missing → ${String(p).slice(0, 40)}`);
      }
    }
    const filename = `${String(i + 1).padStart(2, '0')}.png`;
    const png = await card.screenshot({ path: path.join(pngDir, filename) });
    zip.file(filename, png);
    names.push(filename);
  }
  await writeFile(path.join(outDir, 'cardnews.zip'), await zip.generateAsync({ type: 'nodebuffer' }));
  const gallery = names.map((n, i) => `<a href="png/${n}"><img src="png/${n}" alt="${i + 1}장"></a>`).join('');
  const previewPath = path.join(outDir, 'preview.html');
  await writeFile(previewPath, `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>카드뉴스 미리보기</title><style>body{margin:0;padding:28px;background:#ddd;color:#222;font-family:Arial,sans-serif}h1{font-size:24px;margin:0 0 16px}main{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:18px}img{width:100%;display:block}@media(max-width:900px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}</style><h1>${path.basename(outDir)} · ${count}장 · 1080×1350</h1><main>${gallery}</main></html>`);
  await page.setViewportSize({ width: 1800, height: 900 });
  await page.goto(pathToFileURL(previewPath).href);
  await page.locator('img').evaluateAll(imgs => Promise.all(imgs.map(im => im.decode())));
  await page.screenshot({ path: path.join(outDir, 'preview.png'), fullPage: true });
  console.log(`fonts loaded: ${fontsLoaded.join(', ') || '(none)'}`);
  console.log(`rendered ${count} cards → ${pngDir}`);
  if (problems.length) {
    console.log('PROBLEMS (' + problems.length + '):');
    for (const p of problems) console.log(' - ' + p);
    process.exitCode = 1;
  } else {
    console.log('PASS: all cards 1080×1350, no text overflow, no font under 32px, assets loaded' + (manuscript ? ', manuscript text complete' : ''));
  }
} finally {
  await browser.close();
}
