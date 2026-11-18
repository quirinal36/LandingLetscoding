import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("index.html", import.meta.url), "utf8");
assert.equal((source.match(/<section\b/g) || []).length, 16);
assert.deepEqual([...source.matchAll(/<section[^>]+id="slide-(\d+)" hidden/g)].map(m => Number(m[1])), [13, 14, 15, 16]);
assert.ok(!source.includes('class="chapter"'));
assert.ok(!source.includes("studio.letscoding.kr"));
assert.ok(source.includes('aria-label="학교의 수업 전환"'));
assert.equal((source.match(/<div class="brand"><span>렛츠코딩 라운지<\/span><\/div>/g) || []).length, 16);
const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate IDs can break the cover and body SVG masks");
for (let i = 1; i <= 16; i++) {
  assert.ok(source.includes(`id="slide-${i}"`));
  if (i !== 2) assert.ok(source.includes(`id="title-${i}"`));
}
assert.doesNotMatch(source, /원생|4주 무료|자동 평가|AI 무제한/);
for (const text of ["studio-graphic", "monthly.png", "작품공유", "가상경제", "과제관리", "AI 분석 리포트", "mailto:contact@letscoding.kr"]) assert.ok(source.includes(text), text);
assert.ok(source.match(/<section[^>]+id="slide-1"[\s\S]*?<\/section>/)?.[0].includes('src="../../public/hackathon/lounge-studio-cross.png"'));
assert.ok(!source.includes("front-infinity-mask"));
assert.ok(!source.includes("cover-card-") && !source.includes("cover-project-flow"));
const coreContent = {
  1: ["체험을 넘어, 내 작품으로", "렛츠코딩", "라운지&amp;스튜디오", "학생의 아이디어를", "공유와 피드백으로 발전시키는 수업.", "학생은 만들고,", "선생님은 배움을 이끕니다.", "기획 → AI로 제작 → 공유 → 개선"],
  2: ["comparison-state", "Off", "On", "교구 구매 부담 완화", "창의력의 실행 범위 확장", "<h3>학생 주도 프로젝트</h3>", "자신만의 스토리와 기획력을 바탕으로 스스로 탐구하며 진행하는 프로젝트형 수업"],
  16: ["학교 도입 문의", "학년·학생 수·운영 기간", "기기와 인터넷 환경", "작품 공개 범위", "Free", "Lounge", "Studio", "Studio 사용 불가", "이미지 인식·생성·DB 연동", "잔여량 30% 이하", "이용기간은 연장되지 않습니다"],
  3: ["Step 01.", "Step 02.", "Step 03.", "<h3>스튜디오</h3><strong>AI 활용 바이브코딩</strong>", "<h3>라운지</h3><strong>내 작품을 업로드하는 곳</strong>", "<h3>공동체</h3><strong>함께 플레이하고 피드백하며 성장하는 곳</strong>", "작품을 개선", "진행 상황 · 결과물 확인", "AI 활용 지도"],
  4: ["Step 01. 내 생각을 작품으로", "렛츠코딩 스튜디오를 사용해", "lounge.letscoding.kr/studio", "studio-graphic", "설치 없는 웹 기반 실습", "다양한 기능과 콘텐츠 연동", "안전한 교육용 AI 환경"],
  5: ["Step 02. 내 작품을 친구들에게", "렛츠코딩 라운지에 게시해 친구들에게 공개합니다.", "lounge.letscoding.kr", "englsihword.webp", "bezierider.webp", "storygame.webp", "<strong>영어의 전설</strong>", "베지에 라이더", "태안: 서해안의 기적", "https://lounge.letscoding.kr/works/gihoham/englsihword", "https://lounge.letscoding.kr/works/hso/bezierider", "https://lounge.letscoding.kr/works/adam5102/storygame", "라운지에 공개된 작품 예시"],
  6: ["Step 03. 친구의 의견을 새 아이디어로", "서로 피드백하도록 지도합니다.", "TYPE STORM", "몬스터 알 연구소"],
  7: ["<span>활용 01</span><strong>교육청 · 대학</strong>", "STEP 3", "서로가 첫 사용자가 됩니다.", "모의투자", "배점과 집계 방식은 주최 기관과 함께 정합니다."],
  8: ["<span>활용 02</span><strong>학교</strong>", "선생님과 학생이 함께 쓰는 출석부", "주사위 확률 실험", "활용 예시"],
  9: ["<span>활용 03</span><strong>학원</strong>", "academy-works", "저격! 발사!", "키캡캐슬", "6.25 전쟁 RTS 게임", "당신만 읽을 수 있는 편지", "학생의 관심사가 곧 커리큘럼이 됩니다."],
  10: ["<span>활용 04</span><strong>강사 에이전시", "outreach-cards", "바이브코딩 강사 양성 수업"],
  11: ["도입 안내", "구매 경로", "에듀집, 학교장터", "202611169836156", "edzip-qr.png", "초등학교 1학년 이상", "기관별 접속코드", "바이브코딩 연수", "안전 및 개인정보", "유해 요청 제한", "학생 규모와 총 수업 시간"],
  12: ["pf.kakao.com/_BpVxiX", "카카오톡 채널", "Zoom 1:1", "도입 단계를 도와드립니다", "https://book.letscoding.kr", "학교 도입 문의", "landing/brochure-infinity-static.png"],
  13: ["내 작품의 가치를", "창작", "소개", "반응", "가상경제 참여", "루캣", "배지 시스템", "창작·홍보·피드백·개선"],
  14: ["학생의 관심사와 아이디어", "과제 제시", "진행 확인", "피드백", "과제관리", "완료보고서", "project-report.png", "과제 완료 보상"],
  15: ["학교 제공 환경", "활용 기록", "공개 범위", "개별적으로 유료 AI 서비스를 구독할 필요 없이", "AI 활용 분석 보고서", "어떤 목적으로, 어떻게", "학생의 질문과 문제 해결 과정", "유해 요청", "같은 교육기관 회원"],
};
for (const [page, terms] of Object.entries(coreContent)) {
  const section = source.match(new RegExp(`<section[^>]+id="slide-${page}"[\\s\\S]*?</section>`))?.[0];
  assert.ok(section, `Missing page ${page}`);
  for (const term of terms) assert.ok(section.includes(term), `Core content missing on page ${page}: ${term}`);
}
const backCover = source.match(/<section[^>]+id="slide-12"[\s\S]*?<\/section>/)?.[0];
assert.doesNotMatch(backCover, /<mask\b|<animate\b/, "Back cover must not depend on SVG masking or animation for printing");
assert.doesNotMatch(source, /<strong>(?:Basic|Lite|Plus|Pro 5x)<\/strong>/);
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
  assert.equal((html.match(/<section\b/g) || []).length, 16);
  assert.ok(!html.includes("../../public/") && !html.includes("../../src/assets/") && !html.includes("../../prototypes/"));
  assert.ok(html.includes('src="data:image/svg+xml;base64,'));
}
console.log("PASS: 16 source pages with pages 13–16 hidden, required visuals, asset files, excluded terms, original preserved" + (process.argv[2] ? ", route response" : ""));
