import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("index.html", import.meta.url), "utf8");
assert.equal((source.match(/<section\b/g) || []).length, 12);
const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate IDs can break the cover and body SVG masks");
for (let i = 1; i <= 12; i++) {
  assert.ok(source.includes(`id="slide-${i}"`));
  assert.ok(source.includes(`id="title-${i}"`));
}
assert.doesNotMatch(source, /학원|원생|4주 무료|29,?000원|자동 평가|AI 무제한/);
for (const text of ["infinity-window", "paper-scenes", "studio-workspace.png", "monthly.png", "작품공유", "가상경제", "과제관리", "AI 분석 리포트", "mailto:contact@letscoding.kr"]) assert.ok(source.includes(text), text);
assert.equal((source.match(/class="paper-stage"/g) || []).length, 4);
assert.ok(source.match(/<section[^>]+id="slide-1"[\s\S]*?<\/section>/)?.[0].includes("front-infinity-mask"));
const coreContent = {
  2: ["comparison-state", "Off", "On", "교구 구매 부담 완화", "창의력의 실행 범위 확장", "교사가 이끄는 탐구 활동"],
  11: ["학교 도입 문의", "학년·학생 수·운영 기간", "기기와 인터넷 환경", "작품 공개 범위", "Lite", "Plus", "Pro 5x"],
  3: ["에디터", "라운지", "공동체", "배포·공유", "가상 투자", "작품을 개선", "진행 상황 · 결과물 확인", "AI 활용 지도"],
  4: ["작품이 만들어지는 공간 -", "AI 활용", "studio.letscoding.kr", "studio-workspace.png", "AI와 함께 제작", "AI 사용 관제·감시", "토큰 사용량 기반 요금제"],
  5: ["내 작품을 업로드하는 곳", "내가 만든 작품을 공유하면 주소가 생긴다.", "친구, 가족에게 공유하고 발전시킨다.", "홍보와 판매까지 경험", "필요한 프로그램을 만들어보며<br>향상되는 공감능력", "lounge.letscoding.kr", "ten-pang.webp", "songpyeon.webp", "image-editor.webp", "나나쌤 작품 예시"],
  6: ["만들고 공유하기", "성장하고 기록하기", "paper-scenes"],
  7: ["무한한 실행의 시대로", "infinity-window", "기획과 문제 정의", "AI 활용과 판단"],
  8: ["내 작품의 가치를", "창작", "소개", "반응", "가상경제 참여", "루캣", "배지 시스템", "창작·홍보·피드백·개선"],
  9: ["학생의 관심사와 아이디어", "과제 제시", "진행 확인", "피드백", "과제관리", "완료보고서", "project-report.png", "과제 완료 보상"],
  10: ["학교 제공 환경", "활용 기록", "공개 범위", "개별적으로 유료 AI 서비스를 구독할 필요 없이", "AI 활용 분석 보고서", "어떤 목적으로, 어떻게", "학생의 질문과 문제 해결 과정", "유해 요청", "같은 교육기관 회원"],
};
for (const [page, terms] of Object.entries(coreContent)) {
  const section = source.match(new RegExp(`<section[^>]+id="slide-${page}"[\\s\\S]*?</section>`))?.[0];
  assert.ok(section, `Missing page ${page}`);
  for (const term of terms) assert.ok(section.includes(term), `Core content missing on page ${page}: ${term}`);
}
assert.ok(!source.includes("seminar/inquiry"), "Inquiry destination still contains retired terms");
for (const match of source.matchAll(/(?:src|href)="(\.\.\/[^\"]+)"/g)) {
  assert.ok((await readFile(new URL(match[1], import.meta.url))).length > 0, match[1]);
}
const original = await readFile(new URL("index-original.html", import.meta.url), "utf8");
const paragraphs = JSON.parse(await readFile(new URL("source-text.json", import.meta.url), "utf8"));
for (const paragraph of paragraphs.flat(2)) assert.ok(original.includes(paragraph), paragraph);
if (process.argv[2]) {
  const response = await fetch(process.argv[2]);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.equal((html.match(/<section\b/g) || []).length, 12);
  assert.ok(!html.includes("../../public/") && !html.includes("../../src/assets/") && !html.includes("../../prototypes/"));
  assert.ok(html.includes('src="data:image/svg+xml;base64,'));
}
console.log("PASS: 12 pages with four covers and eight body pages, required visuals, asset files, excluded terms, original preserved" + (process.argv[2] ? ", route response" : ""));
