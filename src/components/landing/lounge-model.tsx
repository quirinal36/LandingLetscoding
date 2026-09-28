import type { CSSProperties, ReactNode } from "react";
import { LoungeModelScrub } from "@/components/landing/lounge-model-scrub";

/*
  라운지 확장 모델 — lounge_model.jpg 를 HTML·CSS 로 다시 짠 도식. (내용: lounge_model.md 4절)

    ① 나 — 만든다        구성주의(constructionism), Papert          창작 → 공개
    ② 우리 — 다듬는다    사회적 구성주의(social constructivism), Vygotsky   피드백 → 수정
    ③ 공동체 — 자란다    실천공동체(community of practice), Lave & Wenger   구경 → 참여 → 기여
    ④ 기록               성찰(reflection) · 포트폴리오               개발일기 · 포트폴리오

  왼쪽 축: 학습의 범위 확장(개인 → 공동체). 좁은 화면에서는 축을 걷는다.
  원본 이미지의 오른쪽 순환 점선과 [그림 1] 설명은 넣지 않는다(스크롤 끝에서야 보여 흐름을 끊었다).
  스크롤로 재생한다(lounge-model-scrub.tsx). 칸이 화면을 올라오는 동안 1번부터 4번까지 차례로 떠오르고,
  칸 안의 단계 상자가 하나씩 들어오며, 왼쪽 축이 그어진다.
*/

type Step = { name: string; sub: string; icon: ReactNode };
type Tier = { n: number; title: string; theory: string; tone: string; steps: Step[]; note?: string; wide?: boolean };

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const I = {
  bulb: (
    <Icon>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
    </Icon>
  ),
  link: (
    <Icon>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </Icon>
  ),
  chat: (
    <Icon>
      <path d="M4 5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-4-3h-3" />
    </Icon>
  ),
  pencil: (
    <Icon>
      <path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" />
    </Icon>
  ),
  people: (
    <Icon>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16 14.2c2.8.3 5 2.7 5 5.8" />
    </Icon>
  ),
  heart: (
    <Icon>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </Icon>
  ),
  sprout: (
    <Icon>
      <path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6ZM12 14c0-3-2.4-5-6-5 0 3 2.4 5 6 5Z" />
      <path d="M7 21h10" />
    </Icon>
  ),
  book: (
    <Icon>
      <path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M8 3v18M11 8h4M11 12h4" />
    </Icon>
  ),
};

const TIERS: Tier[] = [
  {
    n: 1,
    title: "나 — 만든다",
    theory: "구성주의 (constructionism), Papert",
    tone: "blue",
    steps: [
      { name: "창작", sub: "바이브코딩", icon: I.bulb },
      { name: "공개", sub: "링크 배포", icon: I.link },
    ],
  },
  {
    n: 2,
    title: "우리 — 다듬는다",
    theory: "사회적 구성주의 (social constructivism), Vygotsky",
    tone: "green",
    steps: [
      { name: "피드백", sub: "동료 · 코치 · AI", icon: I.chat },
      { name: "수정", sub: "선별 반영", icon: I.pencil },
    ],
  },
  {
    n: 3,
    title: "공동체 — 자란다",
    theory: "실천공동체 (community of practice), Lave & Wenger",
    tone: "orange",
    steps: [
      { name: "구경", sub: "갤러리", icon: I.people },
      { name: "참여", sub: "댓글 · 투자", icon: I.heart },
      { name: "기여", sub: "후배 돕기", icon: I.sprout },
    ],
    note: "주변 → 중심 (정당한 주변적 참여)",
  },
  {
    n: 4,
    title: "기록",
    theory: "성찰 (reflection) · 포트폴리오",
    tone: "purple",
    steps: [{ name: "개발일기 · 포트폴리오", sub: "", icon: I.book }],
    wide: true,
  },
];

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function DownArrow() {
  return (
    <div className="lm-down grid place-items-center py-2" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d="M9 3h6v9h4.5L12 20.5 4.5 12H9Z" />
      </svg>
    </div>
  );
}

export function LoungeModel() {
  return (
    <figure className="lounge-model mx-auto max-w-[52rem]">
      <LoungeModelScrub />
      <div className="relative md:px-[5.5rem]">
        {/* 왼쪽 축: 학습의 범위 확장 */}
        <div className="lm-axis absolute top-0 bottom-0 left-0 hidden w-[4.5rem] flex-col items-center text-center md:flex" aria-hidden="true">
          <span className="text-[0.8125rem] leading-snug text-ink-soft">
            개인
            <br />
            (창작)
          </span>
          <span className="lm-axis-line mt-3 w-1 flex-1 rounded-full" />
          <span className="my-3 text-[1.0625rem] leading-snug font-bold">
            학습의
            <br />
            범위 확장
          </span>
          <span className="lm-axis-line w-1 flex-1 rounded-full" />
          <svg viewBox="0 0 24 24" className="lm-axis-head -mt-1 size-5" fill="currentColor">
            <path d="M4 8h16l-8 10Z" />
          </svg>
          <span className="mt-2 text-[0.8125rem] leading-snug text-ink-soft">
            공동체
            <br />
            (확장)
          </span>
        </div>

        <ol className="relative">
          {TIERS.map((t, i) => (
            <li key={t.n} data-lm-tier="">
              {i > 0 && <DownArrow />}
              <section className={`lm-tier lm-${t.tone} rounded-[24px] p-5 md:p-7`} aria-labelledby={`lm-t${t.n}`}>
                <div className="flex items-center gap-4">
                  <span className="lm-badge grid size-11 shrink-0 place-items-center rounded-full text-xl font-bold text-white md:size-12">{t.n}</span>
                  <div>
                    <h3 id={`lm-t${t.n}`} className="text-[1.5rem] font-extrabold tracking-[-0.03em] md:text-[1.875rem]">
                      {t.title}
                    </h3>
                    <p className="text-[0.9375rem] text-ink-soft md:text-base">{t.theory}</p>
                  </div>
                </div>

                <ul className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
                  {t.steps.map((s, j) => (
                    <li key={s.name} className="lm-step-item flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center md:gap-3" style={idx(j)}>
                      {j > 0 && <Arrow className="lm-step-arrow mx-auto rotate-90 md:mx-0 md:rotate-0" />}
                      <div className={`lm-step flex flex-1 items-center gap-3.5 rounded-2xl px-4 py-3.5 ${t.wide ? "justify-center" : ""}`}>
                        <span className="lm-step-icon grid size-11 shrink-0 place-items-center rounded-xl">{s.icon}</span>
                        <span>
                          <span className="block text-[1.125rem] font-bold tracking-[-0.02em]">{s.name}</span>
                          {s.sub && <span className="block text-[0.9375rem] text-ink-soft">{s.sub}</span>}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {t.note && (
                  <p className="lm-step-item mt-3 text-right text-[0.875rem] text-ink-soft" style={idx(t.steps.length)}>
                    {t.note}
                  </p>
                )}
              </section>
            </li>
          ))}
        </ol>

      </div>

    </figure>
  );
}
