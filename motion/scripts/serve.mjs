#!/usr/bin/env node
/*
 * 릴 미리보기 서버. 의존성 없음.
 *
 *   /            → motion/reel/index.html
 *   /reel.js     → motion/reel/reel.js
 *   /fonts.css   → src/app/fonts.css      (Pretendard 92개 동적 서브셋 선언 — 사이트와 같은 파일)
 *   /fonts/*     → public/fonts/*          (폰트 파일도 사이트 것을 그대로 쓴다)
 *
 * 실행: node motion/scripts/serve.mjs  → http://localhost:4173
 */
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, "../..");
const REEL = path.join(ROOT, "motion/reel");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function inside(base, urlPath) {
  const full = path.join(base, path.normalize(urlPath));
  return full.startsWith(base + path.sep) ? full : null;
}

export function resolveUrl(url) {
  const p = decodeURIComponent(new URL(url, "http://x").pathname);
  if (p === "/") return path.join(REEL, "index.html");
  if (p === "/fonts.css") return path.join(ROOT, "src/app/fonts.css");
  if (p.startsWith("/fonts/")) return inside(path.join(ROOT, "public"), p);
  return inside(REEL, p);
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const file = resolveUrl(req.url);
    if (!file) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": TYPES[path.extname(file)] || "application/octet-stream",
        "cache-control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 4173;
  createServer().listen(port, () => {
    console.log(`렛츠코딩 릴 미리보기 → http://localhost:${port}`);
  });
}
