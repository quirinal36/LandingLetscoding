#!/usr/bin/env node
/*
 * 유튜브 썸네일을 뽑는다(1280×720). 문구는 motion/reel/thumbnail.html 맨 위 T 객체에 있다.
 *
 *   node motion/scripts/thumbnail.mjs
 *   → motion/out/youtube-thumbnail.jpg (업로드용, 2MB 이하) · youtube-thumbnail.png
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer, ROOT } from "./serve.mjs";

const outDir = path.join(ROOT, "motion/out");
await mkdir(outDir, { recursive: true });
const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on("pageerror", (err) => console.error("[page]", err.message));
  await page.goto(`http://127.0.0.1:${port}/thumbnail.html`);
  await page.waitForFunction(() => window.THUMB && window.THUMB.ready === true, null, { timeout: 60_000 });
  const { fonts } = await page.evaluate(() => window.THUMB);
  const missing = Object.entries(fonts).filter(([, ok]) => !ok).map(([name]) => name);
  if (missing.length) throw new Error(`글꼴을 불러오지 못했습니다: ${missing.join(", ")}`);

  for (const [ext, type, quality] of [["png", "image/png"], ["jpg", "image/jpeg", 0.92]]) {
    const url = await page.evaluate(([t, q]) => document.getElementById("thumb").toDataURL(t, q), [type, quality]);
    const buf = Buffer.from(url.slice(url.indexOf(",") + 1), "base64");
    const file = path.join(outDir, `youtube-thumbnail.${ext}`);
    await writeFile(file, buf);
    const mb = buf.length / 1024 / 1024;
    console.log(`${file}  ${mb.toFixed(2)}MB${mb > 2 ? "  ← 유튜브 한도(2MB) 초과" : ""}`);
  }
} finally {
  await browser.close();
  server.close();
}
