import type { Metadata } from "next";
import { Faq, Features, OfferCards, Section, Steps, type Qa } from "@/components/product";
import { ButtonLink } from "@/components/ui";
import { PROOF, PROOF_ASOF } from "@/lib/offer";

/* 사실 출처: yudanah/letscoding_lounge 저장소와 운영 DB(2026.9.28 anon 집계). 코드에 없는 기능·효과는 쓰지 않는다. */

export const metadata: Metadata = {
  title: "렛츠코딩 라운지 · 코딩학원 학생 작품 플랫폼",
  description:
    "렛츠코딩 라운지는 학생이 만든 웹 게임·웹사이트·로블록스·블록 코딩 작품을 링크로 공개하고 쌓아 두는 코딩학원용 플랫폼입니다. 4주 무료 파일럿, 학생 1명 월 11,000원.",
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
    a: "수강 중인 학생 1명당 월 11,000원(부가세 포함)입니다. 원장님과 선생님 계정에는 이용권이 필요 없습니다.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-sm font-semibold text-accent-ink">솔루션</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">렛츠코딩 라운지</h1>
      <div className="mt-6 space-y-4 leading-relaxed">
        <h2 className="text-2xl font-semibold tracking-[-0.025em] md:text-3xl">배운 것을, 나만의 작품으로 만들 시간.</h2>
        <p>렛츠코딩 라운지는 지금 사용하고 계신 교구나 교재를 대체하려는 것이 아닙니다. 기존 수업에서 배운 내용을 학생 자신의 아이디어로 이어가는 공간입니다.</p>
        <p>파이썬 알고리즘 자격증을 준비하며 익힌 문법으로 나만의 프로그램을 만들 때, 로블록스 스튜디오 교재와 실습을 마치고 나만의 게임을 만드는 프로젝트 수업을 시작할 때.</p>
        <p className="font-semibold">배운 대로 따라 만드는 것을 넘어, 학생 스스로 상상하고 구현해 볼 때가 렛츠코딩 라운지를 시작하기 가장 좋은 순간입니다.</p>
      </div>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
        학생 작품을 링크로 공개하고 쌓아 두는 코딩학원용 플랫폼입니다. 수업에서 만든 웹 게임, 웹사이트, 로블록스, 블록 코딩 작품을
        올리면 공개 주소가 생기고, 친구와 학부모가 휴대폰에서 바로 실행해 봅니다.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href="/seminar/inquiry" tone="accent" className="pill">
          4주 무료 파일럿 신청
        </ButtonLink>
        <a href={`${LOUNGE}/works`} target="_blank" rel="noopener" className="link-chevron">
          실제 라운지 둘러보기
        </a>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PROOF.map((p) => (
          <div key={p.label} className="card p-5">
            <dd className="text-2xl font-semibold tabular-nums">
              {p.value.toLocaleString("ko-KR")}
              <span className="ml-0.5 text-base text-ink-soft">{p.unit}</span>
            </dd>
            <dt className="mt-1 text-sm text-ink-soft">{p.label}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[0.8125rem] text-ink-faint">{PROOF_ASOF}</p>

      <Section title="무엇을 하나요">
        <Features items={FEATURES} />
      </Section>

      <Section title="도입 절차">
        <Steps items={STEPS} />
      </Section>

      <Section title="도입 조건">
        <OfferCards />
      </Section>

      <Faq items={FAQ} />
    </div>
  );
}
