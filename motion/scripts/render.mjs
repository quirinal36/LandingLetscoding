#!/usr/bin/env node
/*
 * 릴을 MP4로 뽑는다. 헤드리스 크로미움에서 프레임 번호마다 render(i/60)을 부르고
 * PNG를 ffmpeg로 흘려 H.264로 묶는다. 실시간 녹화가 아니라서 프레임이 빠지지 않는다.
 *
 *   node motion/scripts/render.mjs                    # 16:9 1920×1080
 *   node motion/scripts/render.mjs --format 9x16      # 릴스·쇼츠용 1080×1920
 *   node motion/scripts/render.mjs --frames 0,120,300 # 특정 프레임만 PNG로 (확인용)
 *
 * 필요한 것: playwright(npm i) + 크로미움(npx playwright install chromium), ffmpeg
 * ffmpeg 경로가 PATH에 없으면 FFMPEG=/path/to/ffmpeg 로 지정한다.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer, ROOT } from "./serve.mjs";

// 레이아웃은 가로(16:9)와 세로(9:16) 두 구도로 짜여 있다. 정사각형은 씬 6이 겹치므로 아직 없다.
const FORMATS = { "16x9": [1920, 1080], "9x16": [1080, 1920] };

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const format = opt("format", "16x9");
if (!FORMATS[format]) {
  console.error(`--format 은 ${Object.keys(FORMATS).join(", ")} 중 하나여야 합니다.`);
  process.exit(1);
}
const [W, H] = FORMATS[format];
const outDir = path.join(ROOT, "motion/out");
const out = path.resolve(opt("out", path.join(outDir, `letscoding-reel-${format}.mp4`)));
const stills = opt("frames", null);
const crf = opt("crf", "16");

await mkdir(path.dirname(out), { recursive: true });
const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on("pageerror", (err) => console.error("[page]", err.message));
  await page.goto(`http://127.0.0.1:${port}/?export&w=${W}&h=${H}`);
  await page.waitForFunction(() => window.REEL && window.REEL.ready === true, null, { timeout: 60_000 });
  const fonts = await page.evaluate(() => window.REEL.fonts);
  const missing = Object.entries(fonts).filter(([, ok]) => !ok).map(([name]) => name);
  if (missing.length) throw new Error(`글꼴을 불러오지 못했습니다: ${missing.join(", ")} — 대체 글꼴로 뽑히지 않도록 멈춥니다.`);
  const frames = await page.evaluate(() => window.REEL.frames);
  const grab = async (i) => {
    const url = await page.evaluate((n) => window.REEL.capture(n), i);
    return Buffer.from(url.slice(url.indexOf(",") + 1), "base64");
  };

  if (stills) {
    const list = stills.split(",").map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n >= 0 && n < frames);
    const dir = path.join(outDir, `frames-${format}`);
    await mkdir(dir, { recursive: true });
    for (const i of list) {
      const file = path.join(dir, `f${String(i).padStart(4, "0")}.png`);
      await writeFile(file, await grab(i));
      console.log(file);
    }
  } else {
    const ffmpeg = spawn(
      process.env.FFMPEG || "ffmpeg",
      [
        "-y", "-loglevel", "error",
        "-f", "image2pipe", "-framerate", "60", "-c:v", "png", "-i", "-",
        // RGB → BT.709로 변환해야 브랜드 파랑이 플레이어마다 틀어지지 않는다
        "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-profile:v", "high", "-level", "4.2",
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
        "-movflags", "+faststart", "-r", "60",
        out,
      ],
      { stdio: ["pipe", "inherit", "inherit"] },
    );
    const started = Date.now();
    for (let i = 0; i < frames; i++) {
      if (!ffmpeg.stdin.write(await grab(i))) await once(ffmpeg.stdin, "drain");
      if ((i + 1) % 60 === 0 || i === frames - 1) {
        const sec = ((Date.now() - started) / 1000).toFixed(0);
        process.stdout.write(`\r${format}  ${i + 1}/${frames} 프레임  ${sec}s`);
      }
    }
    ffmpeg.stdin.end();
    const [code] = await once(ffmpeg, "close");
    process.stdout.write("\n");
    if (code !== 0) throw new Error(`ffmpeg 종료 코드 ${code}`);
    console.log(out);
  }
} finally {
  await browser.close();
  server.close();
}
