import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { LoungeModel } from "@/components/landing/lounge-model";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { Container, Eyebrow, reveal } from "@/components/landing/section";

/*
  교육 철학 — docs/lounge_model.md 를 원장님이 읽을 말로 옮긴 것. 도식은 원래 랜딩 4번에 있던 것을 그대로 옮겼다.
  원어 병기 규칙(docs/lounge_model.md 7절): 구성주의는 constructionism 을 붙여 Piaget 의 constructivism 과 구분한다.
*/

export const metadata: Metadata = {
  title: "교육 철학",
  description:
    "렛츠코딩 라운지는 창작에서 출발해 동료의 반응과 공동체 참여로 넓어지는 순환 학습입니다. 구성주의, 사회적 구성주의, 실천공동체 이론으로 설계한 라운지 확장 모델을 소개합니다.",
};

const PRINCIPLES = [
  { t: "창작이 출발점입니다", d: "문법을 먼저 쌓지 않습니다. 만들다가 필요해질 때 끌어옵니다." },
  { t: "작품은 공개될 때 완성됩니다", d: "친구 휴대폰에서 실제로 돌아가야 끝난 것입니다." },
  { t: "동료가 첫 번째 청중입니다", d: "루캣 투자는 서로의 작품을 열어 보게 만드는 학습 장치입니다." },
  { t: "AI가 만들고, 사람이 정합니다", d: "무엇을 만들지, 재미있는지, 무엇을 고칠지는 학생이 판단합니다." },
  { t: "한 바퀴마다 흔적이 남습니다", d: "3주 전과 어제를 나란히 놓고 볼 수 있어야 합니다." },
];

const THEORIES = [
  {
    tier: "나 — 만든다",
    theory: "구성주의(constructionism) · Papert",
    body: "머릿속 생각이 아니라 남에게 보여 줄 수 있는 결과물을 만들 때 학습이 가장 깊어집니다. 그래서 창작은 공개까지 가야 한 단계가 끝납니다.",
  },
  {
    tier: "우리 — 다듬는다",
    theory: "사회적 구성주의(social constructivism) · Vygotsky",
    body: "혼자서는 못 하지만 도움을 받으면 해내는 구간이 있습니다. 동료의 피드백, 코치의 질문, AI 튜터의 첫 응답이 그 구간을 메웁니다. 수정은 혼자 못 한 한 걸음입니다.",
  },
  {
    tier: "공동체 — 자란다",
    theory: "실천공동체(community of practice) · Lave & Wenger",
    body: "갤러리를 구경하는 신입생도 이미 공동체의 구성원입니다. 댓글과 투자로 참여하고, 결국 후배를 돕는 자리로 들어갑니다.",
  },
  {
    tier: "기록 — 다음 작품으로",
    theory: "성찰(reflection) · 포트폴리오",
    body: "개발일지와 포트폴리오에 이 이동이 남습니다. 회차가 거듭될수록 학생은 공동체의 주변에서 중심으로 한 걸음씩 들어갑니다.",
  },
];

export default function Page() {
  return (
    <>
      <RevealObserver />

      <section className="tone-paper pt-24 pb-20 md:pt-36 md:pb-28">
        <Container>
          <Eyebrow>교육 철학</Eyebrow>
          <h1 className="display text-ink-gradient mt-4 max-w-[14ch] text-[2.75rem] md:text-[5.5rem]">AI가 만들고, 사람이 정합니다.</h1>
          <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft md:text-[1.375rem]">
            라운지의 수업은 문법에서 시작하지 않습니다. 만들고 싶은 것에서 시작해, 친구의 반응을 받고, 공동체 안에서 자랍니다.
          </p>

          <ol className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.t} className="rounded-[28px] bg-white p-7 md:p-8" {...reveal(i * 90)}>
                <p className="font-mono text-[0.8125rem] text-accent-ink">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-[1.375rem] font-bold tracking-[-0.025em]">{p.t}</p>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{p.d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="tone-paper pb-28 md:pb-40">
        <Container>
          <div className="mb-12 text-center md:mb-16" {...reveal()}>
            <Eyebrow>라운지 확장 모델</Eyebrow>
            <h2 className="display mx-auto mt-3 max-w-[18ch] text-[2rem] md:text-[3.25rem]">학습은 나에서 우리로, 공동체로 넓어집니다.</h2>
          </div>
          <LoungeModel />

          <ul className="mt-24 grid gap-12 md:mt-32 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
            {THEORIES.map((t) => (
              <li key={t.tier} {...reveal()}>
                <p className="text-[1.5rem] font-bold tracking-[-0.025em] md:text-[1.75rem]">{t.tier}</p>
                <p className="mt-1 text-[0.9375rem] text-ink-faint">{t.theory}</p>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{t.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-24 rounded-[28px] bg-white p-7 md:mt-32 md:p-10" {...reveal()}>
            <p className="text-[1.375rem] font-bold tracking-[-0.025em]">블룸의 분류체계는 측정에 씁니다</p>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              블룸의 2001년 개정 분류체계는 한 사람의 인지를 봅니다. 공유와 동료 피드백, 수정하고 다음 회차로 가는 순환은 담기 어렵습니다. 그래서 모델은 위 세 이론으로 설명하고, 블룸은 회차마다 보고서와 루브릭으로 분석·평가·창안 수준의 사고가 실제로 일어났는지 확인하는 데 씁니다.
            </p>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3" {...reveal()}>
            <ButtonLink href="/seminar/inquiry" tone="accent" size="lg" className="pill">
              4주 무료 파일럿 신청
            </ButtonLink>
            <Link href="/blog/why-we-teach" className="link-chevron text-[1.0625rem]">
              교육 사명 선언서 읽기
            </Link>
            <Link href="/about" className="link-chevron text-[1.0625rem]">
              브랜드 스토리
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
