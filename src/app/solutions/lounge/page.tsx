import type { Metadata } from "next";
import { Faq, OfferCards, Section, Steps, type Qa } from "@/components/product";
import { ButtonLink } from "@/components/ui";
import { PROOF, PROOF_ASOF } from "@/lib/offer";
import { ProjectMonths } from "./project-months";
import "./lounge.css";

/* 사실 출처: yudanah/letscoding_lounge 저장소와 운영 DB(2026.9.28 anon 집계). 코드에 없는 기능·효과는 쓰지 않는다. */

export const metadata: Metadata = {
  title: "렛츠코딩 라운지 · 코딩학원 학생 작품 플랫폼",
  description:
    "렛츠코딩 라운지는 학생이 만든 웹 게임·웹사이트·로블록스·블록 코딩 작품을 링크로 공개하고 쌓아 두는 코딩학원용 플랫폼입니다. 4주 무료 파일럿, 학생 1명 월 29,000원(AI LLM 토큰 비용 포함).",
};

const LOUNGE = "https://lounge.letscoding.kr";

const FEATURES = [
  {
    t: "작품이 링크 하나로 남습니다",
    d: [
      "HTML·ZIP 파일을 올리거나, 다른 곳에 있는 작품 링크를 연결합니다.",
      "작품마다 공개 주소가 생기고 학생 프로필에 모입니다.",
      "보는 사람은 앱 설치나 회원가입 없이 휴대폰에서 바로 실행합니다.",
      "공개·비공개는 학생이 정하고, 부적절한 작품은 관리자가 숨길 수 있습니다.",
    ],
  },
  {
    t: "다음 달 수업 거리가 준비돼 있습니다",
    d: [
      "이달의 문제가 매달 5개씩 올라옵니다. 2026년 4월부터 10월까지 35개입니다.",
      "학습과제 193개: 컴퓨터 과학 77, 웹 58, 로블록스 37, 파이썬 21.",
      "선생님이 과제를 골라 반 학생들에게 배정하거나, 학생이 직접 골라 시작합니다.",
      "컴퓨터 과학 과제는 확인 문제 3개를 모두 맞혀야 제출됩니다.",
    ],
  },
  {
    t: "만든 과정까지 남깁니다",
    d: [
      "프로젝트 5단계: 아이디어 구상 → 개발일지(문제와 해결 정리) → 제작 완료 → 라운지 게시 → 가이드 영상.",
      "끝나면 완료 보고서 8문항을 씁니다. 그중 하나가 “AI를 어떤 방식으로 활용했나요”입니다.",
      "선생님이 확인한 개발일지는 공개 페이지에 올라갑니다. 지금까지 121건이 승인됐습니다.",
    ],
  },
  {
    t: "서로의 작품을 열어 보게 합니다",
    d: [
      "댓글·좋아요·팔로우와 작품별 점수 순위표가 있습니다.",
      "뱃지 72개: 8개 분야가 각각 9단계이고, 조건을 채우면 자동으로 받습니다.",
      "학원 화폐 루캣으로 스티커를 사거나 친구 작품에 투자합니다.",
      "루캣은 현금으로 충전할 수도, 현금으로 바꿀 수도 없습니다.",
    ],
  },
  {
    t: "원장님 화면",
    d: [
      "수강생 현황, 이용권, 반 배정, 작품, 방문 통계를 한 곳에서 봅니다.",
      "검토하지 않은 댓글과 제출 대기 과제를 확인하고, 학원 소식을 보냅니다.",
    ],
  },
  {
    t: "선생님 화면",
    d: [
      "과제를 내고 제출물을 검토하며 개발일지를 승인합니다.",
      "비공개 작품을 열람하고 신고를 처리합니다.",
      "메뉴를 찾아 주는 AI 도우미가 있습니다.",
    ],
  },
];

const STEPS = [
  { t: "상담", d: "우리 학원에 맞는지부터 같이 봅니다." },
  { t: "기관 개설", d: "신청하시면 운영자가 확인한 뒤 학원 공간을 열어 드립니다. 학원설립·운영등록증이 필요합니다." },
  { t: "4주 무료 파일럿", d: "첫 반 하나로 시작합니다. 첫 수업은 렛츠코딩 팀이 함께 코칭합니다." },
  { t: "계속 쓸지 결정", d: "4주 동안 학생과 학부모 반응을 보고 정하시면 됩니다." },
];

const FAQ: Qa[] = [
  {
    q: "학생 작품이 아무 데나 공개되나요?",
    a: "공개 여부는 작품마다 학생이 정합니다. 관리자는 부적절한 작품을 숨길 수 있고, 선생님과 관리자가 신고를 처리합니다. 실명과 학년은 공개 화면에 나오지 않습니다.",
  },
  {
    q: "어떤 작품을 올릴 수 있나요?",
    a: "웹 게임, 웹사이트, 로블록스, 블록 코딩 네 종류입니다. 웹 작품은 HTML 파일이나 ZIP(30MB 이하, 안에 index.html 필수)으로 올리거나 링크로 연결합니다. 점수 순위표는 파일로 올린 작품에만 붙습니다.",
  },
  {
    q: "몇 학년까지 쓸 수 있나요?",
    a: "초등 1학년부터 고등 3학년까지 학년을 고를 수 있습니다. 학생 가입 때 생년월일은 받지 않고 학년만 받습니다.",
  },
  {
    q: "루캣 투자는 실제 돈과 관련이 있나요?",
    a: "없습니다. 루캣은 라운지 안에서만 쓰는 숫자이고, 현금으로 충전하거나 바꿀 수 없습니다. 투자 기능은 아이들이 서로의 작품을 열어 보게 하려고 넣었습니다.",
  },
  {
    q: "선생님이 따로 준비해야 하는 게 많나요?",
    a: "이달의 문제(매달 5개)와 학습과제 193개가 이미 올라와 있습니다. 선생님은 과제를 골라 반에 배정하고, 제출물을 확인하고, 개발일지를 승인합니다.",
  },
  {
    q: "파일럿이 끝나면 자동으로 결제되나요?",
    a: "아닙니다. 무료 기간에는 결제 정보를 받지 않습니다. 파일럿 동안 학생이 만든 작품과 기록은 그대로 남습니다.",
  },
  {
    q: "요금은 어떻게 계산하나요?",
    a: "수강 중인 학생 1명당 월 29,000원(AI LLM 토큰 비용·부가세 포함)입니다. 원장님과 선생님 계정에는 이용권이 필요 없습니다.",
  },
];

export default function Page() {
  return (
    <div className="lounge-solution">
      {/* C안: 매달 이어지는 수업. 각 장면은 하나의 메시지만 다룬다. */}
      <section className="ls-scene ls-hero" aria-labelledby="lounge-title">
        <div className="ls-container">
          <p className="ls-kicker">렛츠코딩 라운지 · 코딩학원을 위한 솔루션</p>
          <h1 id="lounge-title">다음 달도,<br />그다음 달도.<br /><em>이어지는<br className="ls-mobile-break" /> 프로젝트 수업.</em></h1>
          <p className="ls-lead">지금 가르치는 코딩을 출발점으로.<br />새로운 주제와 만드는 경험이<br className="ls-mobile-break" /> 우리 학원의 다음 수업이 됩니다.</p>
          <a className="ls-text-link" href="#learning">수업이 이어지는 흐름 살펴보기 <span aria-hidden="true">↓</span></a>
          <div className="ls-month-line" aria-label="이번 달에서 다음 달, 그다음 달로 이어지는 프로젝트 수업"><span>이번 달</span><i aria-hidden="true" /><span>다음 달</span><i aria-hidden="true" /><span>그다음 달</span><b aria-hidden="true">→</b></div>
        </div>
      </section>

      <section id="learning" className="ls-scene ls-white" aria-labelledby="learning-title">
        <div className="ls-container ls-split">
          <div><p className="ls-kicker">01 · 지금의 교육에서 출발</p><h2 id="learning-title">무엇을 배웠든,<br />어떤 교구를 쓰든.<br /><em>그다음이 있습니다.</em></h2><p className="ls-lead">지금까지 배운 것을 활용해<br />학생이 만들고 싶은 프로젝트로 이어갑니다.</p></div>
          <div className="ls-learning-list">
            <div><span>로블록스 · Lua</span><p>모델링과 코딩에서, 나만의 게임으로.</p></div>
            <div><span>파이썬 · 알고리즘</span><p>문법과 문제 풀이에서, 직접 쓰는 프로그램으로.</p></div>
            <div><span>웹 개발</span><p>따라 만드는 실습에서, 나만의 웹 작품으로.</p></div>
            <div><span>다양한 코딩교육 · 교구</span><p>익숙한 배움을 새로운 아이디어의 출발점으로.</p></div>
            <p className="ls-learning-result">배운 코딩 <b aria-hidden="true">＋</b> AI · 바이브코딩 <b aria-hidden="true">→</b><strong>나만의 작품</strong></p>
          </div>
        </div>
      </section>

      <section className="ls-scene" aria-labelledby="ideas-title">
        <div className="ls-container"><p className="ls-kicker">02 · 계속 생기는 프로젝트 주제</p><h2 id="ideas-title">다음 프로젝트는<br /><em>가까운 곳에 있습니다.</em></h2><p className="ls-lead">학생이 만들고 싶은 재미도,<br />우리 동네의 작은 불편도 수업의 주제가 됩니다.</p>
          <div className="ls-source-grid">
            <article><span className="ls-source-number" aria-hidden="true">01</span><h3>학생의 아이디어와 열정</h3><p>직접 만들고 싶은 것.<br />친구와 함께 즐기고 싶은 것.<br />더 재미있게 바꿔 보고 싶은 것.</p><strong>“이런 것도 만들 수 있어요?”</strong></article>
            <article><span className="ls-source-number" aria-hidden="true">02</span><h3>지역사회의 불편과 문제</h3><p>학교와 동네에서 마주친 불편.<br />주변 사람을 돕고 싶은 마음.<br />코딩으로 해결해 보고 싶은 일.</p><strong>“이걸 바꾸면 더 편하지 않을까요?”</strong></article>
          </div>
        </div>
      </section>

      <section className="ls-scene ls-blue" aria-labelledby="monthly-title">
        <div className="ls-container">
          <p className="ls-kicker">03 · 라운지가 매달 제공하는 주제</p>
          <div className="ls-monthly-hero"><div><h2 id="monthly-title">아이디어가 막히면,<br />이달의 문제에서<br />시작하세요.</h2><p className="ls-lead">매달 새로운 5개의 문제.<br />주제를 고르고, 우리 반의 프로젝트로 이어갑니다.</p></div><div className="ls-five"><span>이달의 문제, 매달</span><strong>5<small>개</small></strong></div></div>
          <div className="ls-five-problems" aria-label="매달 제공되는 다섯 개 이달의 문제">{[1, 2, 3, 4, 5].map((number) => <div key={number}><span>이달의 문제</span><b>0{number}</b></div>)}</div>
          <p className="ls-monthly-note">다음 달에도, 새로운 문제 5개가 찾아옵니다. <span aria-hidden="true">→</span></p>
        </div>
      </section>

      <section id="projects" className="ls-scene ls-white" aria-labelledby="projects-title">
        <div className="ls-container"><p className="ls-kicker">04 · 우리 학원의 프로젝트 수업</p><h2 id="projects-title">만들고, 함께 즐기고.<br /><em>그 경험으로 다시 도전합니다.</em></h2><p className="ls-lead">AI와 바이브코딩으로 로블록스 게임부터 웹게임,<br />웹사이트와 다양한 인터랙티브 작품까지.</p><ProjectMonths /></div>
      </section>

      <section className="ls-scene" aria-labelledby="records-title">
        <div className="ls-container ls-split">
          <div><p className="ls-kicker">05 · 과정이 쌓이는 수업</p><h2 id="records-title">완성한 작품만큼,<br /><em>만들어 온 과정도<br />남습니다.</em></h2><p className="ls-lead">어떤 아이디어로 시작했는지,<br />무엇이 막혔고 어떻게 해결했는지.<br />개발일지와 결과물 기록으로 경험이 쌓입니다.</p></div>
          <ol className="ls-records"><li><span>아이디어</span><strong>무엇을 만들고 싶은가?</strong></li><li><span>개발일지</span><strong>어떤 문제를 어떻게 해결했나?</strong></li><li><span>작품 공개</span><strong>누가 즐겼고, 어떤 반응이 있었나?</strong></li><li><span>다음 프로젝트</span><strong>이번 경험으로 무엇을 더 해 볼까?</strong></li></ol>
        </div>
      </section>

      <section className="ls-scene ls-white" aria-labelledby="proof-title">
        <div className="ls-container"><p className="ls-kicker">라운지에서 이어지고 있는 활동</p><h2 id="proof-title">작품을 만들고,<br /><em>서로의 작품을 만나고 있습니다.</em></h2>
          <dl className="ls-proof">{PROOF.map((p) => <div key={p.label}><dd>{p.value.toLocaleString("ko-KR")}<span>{p.unit}</span></dd><dt>{p.label}</dt></div>)}</dl><p className="ls-proof-date">{PROOF_ASOF}</p><a className="ls-text-link" href={`${LOUNGE}/works`} target="_blank" rel="noopener">실제 라운지 작품 둘러보기 <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <div className="ls-scene ls-operations"><div className="ls-container"><p className="ls-kicker">학원 운영을 위한 기능</p><h2>수업을 이어가는 도구도,<br /><em>함께 준비되어 있습니다.</em></h2><div className="ls-feature-list">{FEATURES.map((feature) => <details key={feature.t}><summary>{feature.t}<span aria-hidden="true">＋</span></summary><ul>{feature.d.map((line) => <li key={line}>{line}</li>)}</ul></details>)}</div></div></div>

      <section className="ls-scene ls-white ls-start" aria-labelledby="start-title"><div className="ls-container"><p className="ls-kicker">우리 학원에서 시작하기</p><h2 id="start-title">다음 수업의 가능성,<br /><em>반 하나로 시작하세요.</em></h2><p className="ls-lead">4주 동안 학생이 만든 작품과 기록을 보며<br />우리 학원에 맞는지 확인해 보세요.</p><div className="ls-cta-row"><ButtonLink href="/seminar/inquiry" tone="accent" size="lg">4주 무료 파일럿 신청</ButtonLink><a className="ls-text-link" href={`${LOUNGE}/works`} target="_blank" rel="noopener">라운지 둘러보기 ↗</a></div><Section title="도입 조건"><OfferCards /></Section><Section title="도입 절차"><Steps items={STEPS} /></Section></div></section>
      <div className="ls-scene ls-questions"><div className="ls-container"><Faq items={FAQ} /></div></div>
    </div>
  );
}
