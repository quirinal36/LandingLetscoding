/** 홈과 도입문의가 같이 쓰는 연락처와 도입 조건. 여기만 고치면 두 페이지와 JSON-LD가 같이 바뀐다. */
export const CONTACT = {
  email: "contact@letscoding.kr",
  tel: "010-5679-0072",
  kakao: "https://pf.kakao.com/_BpVxiX/chat",
};

export const START = [
  { kicker: "파일럿", title: "4주 무료", body: "인원 수와 관계없이 첫 반 하나로 먼저 써 보세요." },
  { kicker: "가격", title: "학생 1명\n월 29,000원", body: "AI LLM 토큰 비용·부가세 포함. 학생 수에 맞춰 이용권을 구매합니다." },
  { kicker: "코칭", title: "첫 수업은\n함께", body: "렛츠코딩 팀이 바이브코딩 수업 진행을 코칭합니다." },
];

/** 라운지 운영 실측. anon으로 보이는 공개 작품 기준이라 학원별로 나누지 않는다. 바꾸면 public/llms.txt도 같이 고친다. */
export const PROOF = [
  { value: 224, unit: "건", label: "공개된 학생 작품" },
  { value: 45, unit: "명", label: "작품을 올린 사람" },
  { value: 8689, unit: "회", label: "작품 조회" },
  { value: 419, unit: "개", label: "작품에 달린 댓글" },
];
export const PROOF_ASOF = "렛츠코딩 라운지 전체 공개 작품 · 2026.4.6 – 9.25 등록분 · 2026.9.28 집계";
