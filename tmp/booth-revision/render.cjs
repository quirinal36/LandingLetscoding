const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('/Users/letscoding/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('sharp');

(async () => {
  const root = process.cwd();
  const source = pathToFileURL(path.join(root, 'output/ai-edu-expo/booth-2sheet.html')).href;
  const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 2862, height: 2380 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure().errorText}`));
    await page.goto(source);
    await page.addStyleTag({ content: 'body{padding:0}.note,h2.wall-title,.side-wall{display:none}.back-wall{width:2862px;max-width:none;margin:0;box-shadow:none}' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.decode()));
    });
    assert.deepEqual(await page.locator('.back-panel .tag').allTextContents(), ['B2', 'B1']);
    assert.deepEqual(await page.locator('.side .tag').allTextContents(), ['S1', 'S2']);
    const geometry = await page.locator('.back-panel').evaluateAll(panels => panels.map(panel => {
      const p = panel.getBoundingClientRect();
      const nodes = [...panel.querySelectorAll('.head,.lead,.label,.card,.point,.brand,.url,.piece,.rule')]
        .filter(node => { const r = node.getBoundingClientRect(); return r.right > p.left && r.left < p.right; });
      const defects = [];
      for (const node of nodes) {
        const r = node.getBoundingClientRect();
        if (r.left < p.left - 1 || r.right > p.right + 1 || r.top < p.top || r.bottom > p.bottom) defects.push(`clipped ${node.className}`);
        if (node.matches('.head,.lead,.label,.card,.point') && r.bottom > p.top + p.height * 1730 / 2380) defects.push(`floor zone ${node.className}`);
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const textBox = node.matches('.card,.point') ? r : p;
        while (walker.nextNode()) {
          const text = walker.currentNode;
          if (!text.textContent.trim()) continue;
          const range = document.createRange(); range.selectNodeContents(text);
          if ([...range.getClientRects()].some(t => t.left < textBox.left - 1 || t.right > textBox.right + 1 || t.bottom > textBox.bottom + 1)) defects.push(`overflow ${text.textContent}`);
        }
      }
      return { id: panel.querySelector('.tag').textContent, defects, cards: nodes.filter(n => n.matches('.card')).map(n => {
        const r = n.getBoundingClientRect(); return { x: r.x - p.x, y: r.y - p.y, width: r.width, height: r.height, caption: n.querySelector('figcaption').textContent };
      }) };
    }));
    for (const panel of geometry) assert.deepEqual(panel.defects, [], panel.id);
    const cards = geometry[0].cards;
    assert.equal(cards.length, 4);
    assert.equal(geometry[1].cards.length, 0);
    assert.equal(new Set(cards.map(c => c.x)).size, 2);
    assert.equal(new Set(cards.map(c => c.y)).size, 2);
    assert.ok(cards[0].x + cards[0].width < cards[1].x);
    assert.ok(cards[0].y + cards[0].height < cards[2].y);
    await page.locator('.back-wall').screenshot({ path: path.join(__dirname, 'wall-back.png') });
    for (const [index, id] of ['B2', 'B1'].entries()) {
      await page.locator('.back-panel').nth(index).screenshot({ path: path.join(__dirname, `back-${id}.png`) });
    }
    for (const id of ['B1', 'B2']) {
      await page.setViewportSize({ width: 1425, height: 2380 });
      await page.goto(`${source}?panel=${id}`);
      assert.equal(await page.locator('.panel:visible').count(), 1);
      assert.equal(await page.locator('.panel.on .tag').textContent(), id);
    }
    assert.deepEqual(errors, []);
    for (const filename of ['back-B1.png', 'back-B2.png', 'wall-back.png']) {
      const metadata = await sharp(path.join(__dirname, filename)).metadata();
      assert.equal(metadata.format, 'png');
      assert.equal(metadata.width, filename === 'wall-back.png' ? 5724 : 2850);
      assert.equal(metadata.height, 4760);
      await fs.copyFile(path.join(__dirname, filename), path.join(root, 'output/ai-edu-expo/booth-png-2sheet', filename));
    }
    await sharp(path.join(__dirname, 'wall-back.png')).resize({ width: 1500 }).png().toFile(path.join(__dirname, 'wall-back-after.png'));
    console.log('PASS: B2 left / B1 right; four cards in a clear 2×2 grid; no clipping or floor-zone collisions; both single-panel URLs; PNG dimensions and local assets.');
    console.log(JSON.stringify(geometry, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
