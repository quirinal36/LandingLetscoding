import type { Metadata } from "next";
import { Faq, Features, Section, Steps, type Qa } from "@/components/product";
import { ButtonLink } from "@/components/ui";

/* 사실 출처: yudanah/python-algorithm-ver2 저장소와 운영 DB(2026.9.28 anon 집계). 가격·성과 수치는 싣지 않는다. */

export const metadata: Metadata = {
  title: "렛츠코딩 파이썬 · 자동 채점 파이썬 학원 수업 플랫폼",
  description:
    "렛츠코딩 파이썬은 print부터 그래프 탐색까지 자동 채점되는 파이썬 문제 1,080개를 학원 수업에 쓰는 웹 플랫폼입니다. 개념 영상, AI 튜터, 반별 진도 관리, 학부모 피드백을 제공합니다.",
};

const PYTHON = "https://python.letscoding.kr";

const BASICS = [
  { unit: "시작하기와 입출력", concepts: 13 },
  { unit: "변수와 산술 연산", concepts: 13 },
  { unit: "문자열", concepts: 9 },
  { unit: "리스트, 튜플", concepts: 23 },
  { unit: "딕셔너리와 집합", concepts: 10 },
  { unit: "조건문", concepts: 13 },
  { unit: "반복문", concepts: 9 },
  { unit: "함수", concepts: 6 },
];

const ALGORITHM_UNITS = [
  "수학과 연산", "배열 탐색", "문자열 처리", "정렬", "딕셔너리와 집합", "함수와 재귀",
  "2차원 리스트", "스택과 큐", "탐색과 투 포인터", "그리디와 완전탐색", "그래프 탐색", "동적 프로그래밍",
];

const FEATURES = [
  {
    t: "설치 없이 바로 채점",
    d: [
      "웹에서 코드를 쓰면 서버에서 실행하고 테스트케이스로 자동 채점합니다.",
      "대부분의 문제에 시작 코드가 채워져 있어 첫 줄에서 헤매지 않습니다.",
      "쓴 코드는 문제마다 저장됩니다.",
    ],
  },
  {
    t: "막히면 AI 튜터 “나나”",
    d: ["힌트, 코드 리뷰, 에러 설명, 개념 설명, 질문 채팅을 제공합니다.", "하루 사용 횟수 제한이 있고, 학생별로 켜고 끌 수 있습니다."],
  },
  {
    t: "선생님 화면",
    d: [
      "반별 학생 카드와 진행률, 문제별 오답 통계를 봅니다.",
      "학생마다 풀이 기록, 작성한 코드, AI 사용 내역을 확인합니다.",
      "학생 모드로 바꾸면 학생 화면을 그대로 볼 수 있습니다.",
    ],
  },
  {
    t: "학부모 피드백",
    d: ["AI가 학습 피드백 초안을 만들고 선생님이 다듬어 링크로 보냅니다.", "학부모는 로그인 없이 전화번호 뒷자리로 인증하고 봅니다."],
  },
  {
    t: "원장님 관리 화면",
    d: [
      "반은 20개까지 만들 수 있습니다.",
      "선생님 배정, 학생 이동, 이용 기간 연장·종료를 한 곳에서 처리합니다.",
      "관리 활동은 감사 로그에 남습니다.",
    ],
  },
  {
    t: "만 14세 미만 학생",
    d: ["등록할 때 만 14세 미만 여부와 법정대리인 동의를 함께 확인합니다."],
  },
];

const STEPS = [
  { t: "도입 문의", d: "전화나 이메일로 연락 주시면 요금과 진행 방식을 안내해 드립니다." },
  { t: "기관 계정 개설", d: "렛츠코딩이 기관 계정을 만들어 드립니다. 기관 관리자 계정과 임시 비밀번호가 발급됩니다." },
  { t: "반과 학생 등록", d: "원장님이 반을 만들고 선생님과 학생을 등록합니다. 학생은 기관명·이름·비밀번호로 로그인합니다." },
  { t: "수업 시작", d: "선생님이 반별로 공개할 단원을 정하고 수업을 시작합니다." },
];

const FAQ: Qa[] = [
  { q: "학생 컴퓨터에 파이썬을 설치해야 하나요?", a: "아니요. 웹에서 코드를 쓰면 서버에서 실행하고 채점합니다." },
  { q: "파이썬을 처음 배우는 학생도 할 수 있나요?", a: "네. 첫 문제가 print(\"Hello, World!\") 출력이고, 입출력과 변수부터 순서대로 올라갑니다." },
  { q: "선생님이 채점을 따로 해야 하나요?", a: "아니요. 테스트케이스로 자동 채점되고, 선생님은 진행률과 오답 통계로 누가 어디서 막혔는지 확인합니다." },
  { q: "학생마다 진도를 다르게 줄 수 있나요?", a: "네. 반 단위로도, 학생 한 명 단위로도 공개할 단원을 정할 수 있습니다." },
  { q: "학생이 AI에만 의존하지 않을까요?", a: "AI 사용은 하루 횟수 제한이 있고, 원장님이 학생별로 끌 수 있습니다. 선생님은 학생마다 AI를 어떻게 썼는지 볼 수 있습니다." },
  { q: "학부모에게 학습 상황을 어떻게 알리나요?", a: "선생님이 만든 피드백을 링크로 보내면 학부모가 로그인 없이 전화번호 뒷자리로 인증하고 봅니다." },
  { q: "무료로 써 볼 수 있나요?", a: "네. 14일 무료체험이 있습니다. 도입 문의로 신청하시면 됩니다." },
  { q: "요금은 얼마인가요?", a: "학생 수에 따라 달라서 상담 때 안내해 드립니다." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <p className="text-sm font-semibold text-accent-ink">솔루션</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">렛츠코딩 파이썬</h1>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
        print부터 그래프 탐색까지, 자동 채점되는 파이썬 문제 1,080개를 학원 수업에 쓰는 웹 플랫폼입니다. 학생은 개념 영상을 보고
        코드를 써서 바로 채점받고, 선생님은 반별 진도와 막힌 문제를 한 화면에서 봅니다.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href="/seminar/inquiry" tone="accent" className="pill">
          14일 무료체험 문의
        </ButtonLink>
        <a href={PYTHON} target="_blank" rel="noopener" className="link-chevron">
          렛츠코딩 파이썬 사이트
        </a>
      </div>

      <Section title="커리큘럼">
        <p className="leading-relaxed text-ink-soft">학원에 열리는 과정은 두 단계입니다. 선생님이 반이나 학생마다 공개할 단원을 고릅니다.</p>

        <h3 className="mt-8 font-semibold">1단계 · 파이썬 시작하기 — 8단원, 개념 96개, 연습 문제 960개</h3>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">개념마다 연습 문제 10개가 붙어 있고, 96개 중 95개에는 짧은 개념 영상이 있습니다.</p>
        <div className="card mt-4 overflow-x-auto p-2">
          <table className="w-full text-left text-[0.9375rem]">
            <thead className="text-ink-soft">
              <tr>
                <th className="px-3 py-2 font-medium">단원</th>
                <th className="px-3 py-2 text-right font-medium">개념</th>
                <th className="px-3 py-2 text-right font-medium">연습 문제</th>
              </tr>
            </thead>
            <tbody>
              {BASICS.map((b) => (
                <tr key={b.unit} className="border-t border-black/5">
                  <td className="px-3 py-2">{b.unit}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{b.concepts}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{b.concepts * 10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-10 font-semibold">2단계 · 알고리즘 — 12단원 120문제와 모의고사</h3>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">단원마다 10문제이고, 모의고사 8세트(80문제)가 따로 있습니다.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {ALGORITHM_UNITS.map((u) => (
            <li key={u} className="card px-3 py-1.5 text-[0.9375rem]">
              {u}
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-semibold">함께 · 모두의 문제 — 학생이 낸 문제 254개</h3>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">
          학생이 직접 문제와 테스트케이스를 만들어 올립니다. AI 검수를 통과해야 등록되고, 난이도는 10단계로 나뉩니다.
        </p>
      </Section>

      <Section title="무엇을 하나요">
        <Features items={FEATURES} />
      </Section>

      <Section title="도입 절차">
        <Steps items={STEPS} />
        <p className="mt-4 text-[0.9375rem] text-ink-soft">요금은 학생 수에 따라 달라서 상담 때 안내해 드립니다. 14일 무료체험이 있습니다.</p>
      </Section>

      <Faq items={FAQ} />
    </div>
  );
}
