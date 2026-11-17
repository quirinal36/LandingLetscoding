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
for (const text of ["paper-scenes", "studio-workspace.png", "monthly.png", "작품공유", "가상경제", "과제관리", "AI 분석 리포트", "mailto:contact@letscoding.kr"]) assert.ok(source.includes(text), text);
assert.equal((source.match(/class="paper-stage"/g) || []).length, 4);
assert.ok(source.match(/<section[^>]+id="slide-1"[\s\S]*?<\/section>/)?.[0].includes('src="../../public/hackathon/lounge-studio-cross.png"'));
assert.ok(!source.includes("front-infinity-mask"));
assert.ok(!source.includes("cover-card-") && !source.includes("cover-project-flow"));
const coreContent = {
  1: ["체험을 넘어, 내 작품으로", "렛츠코딩", "라운지&amp;스튜디오", "학생의 아이디어를", "공유와 피드백으로 발전시키는 수업.", "학생은 만들고,", "선생님은 배움을 이끕니다.", "기획 → AI로 제작 → 공유 → 개선"],
  2: ["comparison-state", "Off", "On", "교구 구매 부담 완화", "창의력의 실행 범위 확장", "<h3>학생 주도 프로젝트</h3>", "자신만의 스토리와 기획력을 바탕으로 스스로 탐구하며 진행하는 프로젝트형 수업"],
  16: ["학교 도입 문의", "학년·학생 수·운영 기간", "기기와 인터넷 환경", "작품 공개 범위", "Free", "Lounge", "Studio", "Studio 사용 불가", "이미지 인식·생성·DB 연동", "잔여량 30% 이하", "이용기간은 연장되지 않습니다"],
  3: ["Step 01.", "Step 02.", "Step 03.", "<h3>스튜디오</h3><strong>AI 활용 바이브코딩</strong>", "<h3>라운지</h3><strong>내 작품을 업로드하는 곳</strong>", "<h3>공동체</h3><strong>함께 플레이하고 피드백하며 성장하는 곳</strong>", "배포·공유", "가상 투자", "작품을 개선", "진행 상황 · 결과물 확인", "AI 활용 지도"],
  4: ["Step 01. 스튜디오 - AI 활용 바이브코딩", "lounge.letscoding.kr/studio", "기관에 소속된 유료 계정만 이용", "studio-workspace.png", "학생별 AI 활용 과정 확인", "ChatGPT, Claude 최신 모델", "이미지 생성 및 코드작업을 위해 활용", "학습 특화 코딩 에디터", "음원, 데이터베이스 등이 제공되며, 학습에 적합한 API리스트가 제공된다."],
  5: ["Step 02. 라운지 - 내 작품을 업로드하는 곳", "내가 만든 작품을 공유하면 주소가 생긴다.", "친구, 가족에게 공유하고 발전시킨다.", "홍보와 판매까지 경험", "필요한 프로그램을 만들어보며<br>향상되는 공감능력", "lounge.letscoding.kr", "englsihword.webp", "bezierider.webp", "storygame.webp", "<strong>영어의 전설</strong>", "베지에 라이더", "태안: 서해안의 기적", "https://lounge.letscoding.kr/works/gihoham/englsihword", "https://lounge.letscoding.kr/works/hso/bezierider", "https://lounge.letscoding.kr/works/adam5102/storygame", "라운지에 공개된 작품 예시"],
  6: ["Step 03. 공동체 - 함께 플레이하고<br>피드백하며 성장하는 곳", "paper-scenes"],
  7: ["<span>활용 01</span><strong>교육청 · 대학</strong>", "DAY 03", "서로가 첫 사용자", "배점과 집계 방식은 주최 기관과 정합니다."],
  8: ["<span>활용 02</span><strong>학교</strong>", "landing/school-attendance.png", "landing/school-library-app.png", "활용 예시 이미지"],
  9: ["<span>활용 03</span><strong>학원</strong>", "landing/academy-projects-round-table.png", "한 교실, 서로 다른 프로젝트", "지속가능한 수업운영", "학생 한 명의 컨텐츠가 곧 수업 커리큘럼입니다.", "수업준비 시간 단축", "학생들과 마주보며 함께 작품을 만드는 시간에 집중하세요.", "상담과 홍보", "가치있는 수업은 학부모님들이 먼저 알아보고 다가와 주십니다."],
  10: ["<span>활용 04</span><strong>강사 에이전시", "2 · 3교시", "단기 수업 요금은 시간과 사용량을 고려하여 협의합니다."],
  11: ["도입 안내", "구매 경로", "에듀집, 학교장터", "202611169836156", "edzip-qr.png", "4학년 이상", "2시간~8시간", "기관별 접속코드", "교사 바이브코딩 연수", "29,000원", "단기 사용은 시간과 사용량을 고려하여 협의"],
  12: ["pf.kakao.com/_BpVxiX", "카카오톡 채널", "Zoom 1:1", "도입 단계를 도와드립니다", "학교 도입 문의", "landing/brochure-infinity-static.png"],
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
