// BASE_URL=http://localhost:3002 PLAYWRIGHT_MODULE=/path/to/playwright node scripts/check-landing-integrated.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { mkdir } = require('node:fs/promises');

(async () => {
  await mkdir('artifacts/landing-integrated', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    assert.equal((await page.goto(process.env.BASE_URL || 'http://localhost:3002')).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.locator('h1').innerText(), /학생 한 명이,[\s\S]*스타트업이 됩니다/);
    const headings = await page.locator('h2').allTextContents();
    let previous = -1;
    for (const text of ['만들고 공유하기', '공동체가 함께', '다음 달 수업,', '선생님의 역할은', '이번 달에', '지금 이순간도', '반 하나면', '궁금한 것부터', '다음 스타트업']) {
      const index = headings.findIndex(heading => heading.includes(text));
      assert.ok(index > previous, `section order: ${text}`);
      previous = index;
    }
    assert.equal(await page.locator('#classroom video').count(), 1);
    assert.ok((await page.locator('.v2-workshop').getAttribute('src')).includes('workshop-generated.webp'));
    assert.ok((await page.locator('.landing-v2 .v2-kicker').allTextContents()).every(text => !/^\d{2}\s*—/.test(text)), 'no numbered English eyebrows');
    assert.equal(await page.locator('[data-count]').count(), 4);
    assert.equal(await page.locator('#start .v2-offer').count(), 3);
    assert.equal(await page.locator('#start .v2-offer-featured.tone-dark').count(), 1);
    assert.match(await page.locator('#start').innerText(), /29,000원/);
    assert.match(await page.locator('#start').innerText(), /290,000원/);
    assert.match(await page.locator('#start').innerText(), /AI LLM 토큰 비용/);
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(schema['@graph'].find(item => item['@type'] === 'Service').offers[1].priceSpecification.price, 29000);
    const editorBenefits = await page.locator('.v2-tool-strip').innerText();
    assert.match(editorBenefits, /유해 요청을 제한하고 사용 결과를 로그로/);
    assert.match(editorBenefits, /AI 분석 리포트/);
    assert.match(editorBenefits, /같은 라운지 작품에 업데이트/);
    assert.match(editorBenefits, /코드와 AI 대화, 프로젝트 문서/);
    assert.equal(await page.locator('#start .control').getAttribute('href'), '/seminar/inquiry');
    assert.equal(await page.locator('.v2-weeks li').count(), 4);
    await page.locator('.v2-faq summary').nth(1).click();
    assert.equal(await page.locator('.v2-faq details').nth(1).getAttribute('open'), '');
    await page.locator('.v2-faq summary').nth(1).press('Enter');
    assert.equal(await page.locator('.v2-faq details').nth(1).getAttribute('open'), null);
    for (const image of await page.locator('.landing-v2 img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
    }
    await page.addStyleTag({ content: 'nextjs-portal { display: none; } header { visibility: hidden; }' });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `no overflow at ${width}px`);
      for (const [index, section] of (await page.locator('.landing-v2 > section').all()).entries()) {
        await section.screenshot({ path: `artifacts/landing-integrated/section-${index + 7}-${width}.png` });
      }
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.reload();
    await page.locator('.v2-faq').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.v2-faq-grid h2').closest('[data-reveal]').hasAttribute('data-shown'));
    await page.locator('a', { hasText: '우리 반 수업 상담하기' }).click();
    await page.waitForURL('**/seminar/inquiry');
    assert.deepEqual(errors, [], 'no JavaScript errors');
    console.log('PASS: original hero, section order, video, counters, FAQ keyboard, CTA, motion settings and 1440/768/390/320px layouts');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
