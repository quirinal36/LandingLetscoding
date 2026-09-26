#!/usr/bin/env node
/*
 * 릴을 파일 하나로 묶는다. 서버 없이 더블클릭으로 열리고, 메일·메신저로 보내도 그대로 재생된다.
 *
 *   - reel.js 를 인라인
 *   - IBM Plex(woff2 4개)를 data URI로
 *   - Pretendard는 92개 서브셋 중 실제로 쓰인 글자가 든 조각만 data URI로
 *
 * 결과
 *   motion/out/letscoding-reel.html           완결된 HTML 문서
 *   motion/out/letscoding-reel.fragment.html  <html>/<head>/<body> 껍데기를 뺀 본문(아티팩트 게시용)
 *
 * 실행: node motion/scripts/bundle.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./serve.mjs";

const REEL = path.join(ROOT, "motion/reel");
const OUT = path.join(ROOT, "motion/out");

const html = await readFile(path.join(REEL, "index.html"), "utf8");
const js = await readFile(path.join(REEL, "reel.js"), "utf8");
const plexCss = await readFile(path.join(REEL, "plex.css"), "utf8");
const pretendardCss = await readFile(path.join(ROOT, "src/app/fonts.css"), "utf8");

const dataUri = async (file) => `data:font/woff2;base64,${(await readFile(file)).toString("base64")}`;

// ── 쓰인 글자 모으기 (주석은 빼고)
const stripped = (html + js)
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "");
const used = new Set();
for (const ch of stripped) used.add(ch.codePointAt(0));

// ── Pretendard: 쓰인 글자가 unicode-range에 걸리는 서브셋만
const faces = [...pretendardCss.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]);
const pretendardFaces = [];
for (const body of faces) {
  const url = body.match(/url\(([^)]+)\)/)[1];
  const rangeText = body.match(/unicode-range:\s*([^;]+);/)[1];
  const ranges = rangeText.split(",").map((r) => {
    const [a, b] = r.trim().replace(/^U\+/i, "").split("-");
    return [parseInt(a, 16), parseInt(b || a, 16)];
  });
  const hit = [...used].some((cp) => ranges.some(([a, b]) => cp >= a && cp <= b));
  if (!hit) continue;
  const file = path.join(ROOT, "public", url.replace(/^\//, ""));
  pretendardFaces.push(
    body.replace(/url\([^)]+\)/, `url(${await dataUri(file)})`),
  );
}

// ── IBM Plex: 네 개 전부
let plexInline = plexCss;
for (const m of plexCss.matchAll(/url\((plex\/[^)]+)\)/g)) {
  plexInline = plexInline.replace(m[0], `url(${await dataUri(path.join(REEL, m[1]))})`);
}

const fontStyle = [
  "<style>",
  "/* Pretendard — SIL OFL 1.1, Copyright (c) 2021 Kil Hyung-jin, with Reserved Font Name 'Pretendard' */",
  ...pretendardFaces.map((b) => `@font-face {${b}}`),
  plexInline,
  "</style>",
].join("\n");

let page = html
  .replace(/<link[^>]*data-bundle="plex"[^>]*>\n?/, "")
  .replace(/<link[^>]*data-bundle="pretendard"[^>]*>/, fontStyle)
  .replace(/<!-- IBM Plex[^>]*-->\n?/, "")
  .replace(/<!-- Pretendard 92개[^>]*-->\n?/, "")
  .replace(/<script src="reel\.js"[^>]*><\/script>/, () => `<script>\n${js.replace(/<\/script/gi, "<\\/script")}\n</script>`);

if (/data-bundle=/.test(page)) throw new Error("인라인하지 못한 자원이 남았습니다.");

// 아티팩트용: 게시할 때 껍데기(doctype·html·head·body·charset·viewport)가 붙으므로 뺀다.
// <title>은 맨 앞으로 — 앞 8KB 안에 있어야 이름으로 잡힌다.
const title = page.match(/<title>[\s\S]*?<\/title>/)[0];
const fragment = [
  title,
  page
    .replace(/<!doctype html>\s*/i, "")
    .replace(/<\/?html[^>]*>\s*/gi, "")
    .replace(/<\/?head>\s*/gi, "")
    .replace(/<\/?body[^>]*>\s*/gi, "")
    .replace(/<meta charset[^>]*>\s*/i, "")
    .replace(/<meta name="viewport"[^>]*>\s*/i, "")
    .replace(title, "")
    .trim(),
].join("\n");

await mkdir(OUT, { recursive: true });
const full = path.join(OUT, "letscoding-reel.html");
const frag = path.join(OUT, "letscoding-reel.fragment.html");
await writeFile(full, page);
await writeFile(frag, fragment + "\n");
const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)}KB`;
console.log(`Pretendard 서브셋 ${pretendardFaces.length}/${faces.length}개 포함`);
console.log(`${full}  ${kb(page)}`);
console.log(`${frag}  ${kb(fragment)}`);
