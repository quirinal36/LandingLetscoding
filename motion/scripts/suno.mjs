#!/usr/bin/env node
/*
 * kie.ai의 Suno API로 릴 배경음악을 만든다. 수노는 한 번에 두 곡(변주)을 준다.
 *
 *   node motion/scripts/suno.mjs
 *   node motion/scripts/suno.mjs --style "..." --title "..." --model V5
 *
 * 키: 환경변수 KIE_API_KEY, 없으면 저장소 루트 .env.local 의 KIE_API_KEY (.env*는 git에 안 올라간다)
 * 결과: motion/out/music/<taskId>-1.mp3, -2.mp3 와 응답 전문(<taskId>.json)
 * 다음 단계: python3 motion/scripts/fit_music.py <mp3>  → 128 BPM 8마디(15초)로 잘라 reel/music.m4a
 *
 * 프록시 뒤에서 돌릴 때(Node 22.21+): NODE_USE_ENV_PROXY=1 node motion/scripts/suno.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./serve.mjs";

const API = "https://api.kie.ai/api/v1";

// 릴이 128 BPM · 8마디 구조라 템포를 스타일에 박아 둔다. 보컬 없이, 밝고 가볍게.
const DEFAULT_STYLE = [
  "upbeat future house",
  "128 BPM",
  "four-on-the-floor kick",
  "crisp claps and hats",
  "bright synth plucks",
  "warm round bass",
  "optimistic, light, playful",
  "clean modern tech commercial",
  "instrumental, no vocals",
].join(", ");
const DEFAULT_TITLE = "Let's Coding Lounge";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const style = opt("style", DEFAULT_STYLE);
const title = opt("title", DEFAULT_TITLE);
const model = opt("model", "V5");
const timeoutMin = Number(opt("timeout", "10"));

async function apiKey() {
  if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY.trim();
  try {
    const env = await readFile(path.join(ROOT, ".env.local"), "utf8");
    const m = env.match(/^\s*KIE_API_KEY\s*=\s*["']?([^"'\s#]+)/m);
    if (m) return m[1];
  } catch {
    // .env.local 이 없으면 아래에서 안내한다
  }
  throw new Error("KIE_API_KEY가 없습니다. 환경변수로 넘기거나 저장소 루트 .env.local 에 KIE_API_KEY=... 로 적어 주세요.");
}

const KEY = await apiKey();

async function call(route, init = {}) {
  let res;
  try {
    res = await fetch(API + route, {
      ...init,
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    });
  } catch (err) {
    throw new Error(`api.kie.ai에 연결하지 못했습니다(${err.cause?.code || err.message}). 네트워크나 프록시 설정을 확인해 주세요.`);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.code !== 200) {
    throw new Error(`kie.ai ${route} → HTTP ${res.status} ${JSON.stringify(body)}`);
  }
  return body.data;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --task <id>: 이미 만든 곡을 다시 내려받기만 한다(크레딧을 쓰지 않는다)
let taskId = opt("task", null);
const resume = Boolean(taskId);
if (resume) {
  console.log(`작업 ${taskId} — 이미 만든 곡을 내려받습니다`);
} else {
  console.log(`모델 ${model} · "${title}"\n스타일: ${style}`);
  ({ taskId } = await call("/generate", {
    method: "POST",
    body: JSON.stringify({
      customMode: true,
      instrumental: true,
      model,
      style,
      title,
      // 콜백은 받지 않고 아래에서 상태를 물어본다. 필수 항목이라 문서용 주소를 넣는다.
      callBackUrl: "https://example.com/kie-callback",
    }),
  }));
  console.log(`작업 ${taskId} — 생성 중…`);
}

const FAILED = /FAIL|ERROR|EXCEPTION/;
const deadline = Date.now() + timeoutMin * 60_000;
let detail;
for (let first = true; ; first = false) {
  if (!(resume && first)) await sleep(10_000);
  detail = await call(`/generate/record-info?taskId=${encodeURIComponent(taskId)}`);
  const status = detail?.status || "UNKNOWN";
  process.stdout.write(`\r상태: ${status}            `);
  if (status === "SUCCESS") break;
  if (FAILED.test(status)) throw new Error(`\n생성 실패: ${status} ${detail.errorMessage || ""}`);
  if (Date.now() > deadline) throw new Error(`\n${timeoutMin}분 안에 끝나지 않았습니다. 작업 ${taskId}`);
}
process.stdout.write("\n");

const outDir = path.join(ROOT, "motion/out/music");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, `${taskId}.json`), JSON.stringify(detail, null, 2));
const tracks = detail?.response?.sunoData || [];
if (!tracks.length) throw new Error(`응답에 곡이 없습니다: ${JSON.stringify(detail)}`);
// 완성본(audioUrl)이 먼저, 막히면 스트리밍 사본으로. 음원은 kie.ai가 아닌 파일 도메인에 있다
const failures = [];
for (const [i, track] of tracks.entries()) {
  const file = path.join(outDir, `${taskId}-${i + 1}.mp3`);
  const urls = [track.audioUrl, track.sourceAudioUrl, track.streamAudioUrl, track.sourceStreamAudioUrl].filter(Boolean);
  let saved = false;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(file, Buffer.from(await res.arrayBuffer()));
      console.log(`${file}  ${Math.round(track.duration || 0)}초  (${new URL(url).host})`);
      saved = true;
      break;
    } catch (err) {
      failures.push(`${new URL(url).host}: ${err.cause?.cause?.message || err.cause?.message || err.message}`);
    }
  }
  if (!saved) {
    throw new Error(
      `${i + 1}번 곡을 내려받지 못했습니다.\n  ${[...new Set(failures)].join("\n  ")}\n` +
        `이 도메인들을 네트워크에서 허용한 뒤 다시 받기: node scripts/suno.mjs --task ${taskId}`,
    );
  }
}
