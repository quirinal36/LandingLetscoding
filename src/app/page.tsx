import { ButtonLink } from "@/components/ui";

/*
  문구의 출처는 렛츠코딩 라운지 저장소(yudanah/letscoding_lounge)다.
  - 고민과 답: docs/39-lounge-guidance.md
  - 과제 5단계 · 스킬스택: docs/46-lounge-learning-design-analysis.md, src/lib/skill-stack.ts
  - 운영 수치: docs/37-partner-academy-speech-deck.md 「확인된 운영 수치」 (2026-08-24 프로덕션 스냅샷)
  - 파일럿 조건 · 연락처: docs/37 단일 CTA
  매출·상담·재등록 같은 효과 수치는 쓰지 않는다. 개발 중·로드맵 기능은 현재 제공처럼 말하지 않는다.
*/

const LOUNGE_URL = "https://lounge.letscoding.kr/works";
const CONTACT = { email: "contact@letscoding.kr", tel: "010-5679-0072" };

/** 상담실에서 원장님이 받는 질문. */
const WORRIES = [
  {
    quote: "이제 AI가 코딩 다 해주는데, 코딩을 왜 배워요?",
    body: "“그래도 기초는 중요합니다”라고 답하면 학부모님은 압니다. 학원이 자기 사업을 지키려는 말이라는 걸. 벽돌깨기는 AI에게 부탁하면 30초 만에 나옵니다.",
  },
  {
    quote: "그럼 코딩 수업은 어떻게 하나요?",
    body: "조건문과 반복문을 석 달에 걸쳐 가르치던 커리큘럼은 설득력을 잃었습니다. 그렇다고 무엇을 어떤 순서로 시켜야 할지 정해 둔 곳도 없습니다.",
  },
  {
    quote: "이번 달엔 아이들에게 뭘 만들게 하지?",
    body: "매달 새 과제를 고민하고, 누가 어디까지 했는지 확인하고, 잘한 걸 칭찬해 주는 일이 전부 원장님 몫으로 남습니다.",
  },
];

/** AI가 대신해 주지 않는 순환. */
const CYCLE = ["만들고 싶은 걸 정하고", "만들고", "세상에 내놓고", "반응을 보고", "고칩니다"];

/** 라운지 공식 작품 목록에 2026년 9월 올라온 추천 과제. */
const MONTHLY = [
  "음력 날짜에 따라 달의 모양이 바뀌는 시뮬레이션",
  "확률 실험을 반복하고 결과를 비교하는 프로그램",
  "전통놀이를 재해석한 게임",
  "내가 만든 수식이 시각적인 패턴이 되는 프로그램",
  "색상값을 활용한 프로그램",
];

/** 프로젝트 과제 5단계. 만들고 끝나지 않고, 보여 주고 설명하는 데까지 간다. */
const STEPS = [
  { title: "아이디어 구상", note: "무엇을 왜 만들지 정한다" },
  { title: "문제와 해결 정리", note: "막힌 곳과 푼 방법을 개발일지에" },
  { title: "제작 완료", note: "돌아가는 결과물" },
  { title: "라운지 게시", note: "작품이 주소를 갖는다" },
  { title: "가이드 영상", note: "자기 작품을 직접 설명한다" },
];

const SKILL_TRACKS = [
  { name: "컴퓨터 과학", count: 77 },
  { name: "웹", count: 58 },
  { name: "로블록스", count: 37 },
  { name: "파이썬", count: 21 },
];

/** 렛츠코딩앤플레이 운영 실측. 2026-04-06 ~ 2026-08-22, 2026-08-24 집계. */
const PROOF = [
  { value: "196", unit: "건", label: "등록된 학생 작품" },
  { value: "44", unit: "명", label: "작품을 올린 학생" },
  { value: "6,093", unit: "회", label: "작품 조회" },
  { value: "342", unit: "개", label: "작품에 달린 댓글" },
];

function SectionHeading({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <header className="max-w-[40rem]">
      <p className="text-sm font-medium text-ink-faint">{kicker}</p>
      <h2 className="mt-2 text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.03em] text-balance md:text-[2.125rem]">
        {title}
      </h2>
      {lead && <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{lead}</p>}
    </header>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6">
      {/* ── 히어로 ─────────────────────────────────────────────── */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <p className="text-[0.9375rem] font-medium text-ink-soft">
          코딩학원 · 공부방 · 교습소를 위한 AI 시대 커리큘럼
        </p>
        <h1 className="mt-4 max-w-[17ch] text-[2.5rem] leading-[1.15] font-semibold tracking-[-0.04em] text-balance md:text-[3.75rem]">
          AI 시대의 코딩 커리큘럼, 원장님 혼자 고민하지 마세요
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft md:text-xl">
          7년차 코딩학원이 직접 만들어 매일 수업에 쓰는 커리큘럼과 운영 시스템을 그대로
          드립니다. 문법 진도표 대신, 학생이 스스로 정하고 만들고 설명하는 수업입니다.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/seminar/inquiry" tone="accent" size="lg">
            4주 무료 파일럿 상담
          </ButtonLink>
          <ButtonLink href={LOUNGE_URL} target="_blank" rel="noopener" size="lg">
            실제 운영 중인 라운지 보기
          </ButtonLink>
        </div>
      </section>

      {/* ── 고민 ───────────────────────────────────────────────── */}
      <section className="hairline border-t py-16 md:py-24">
        <SectionHeading
          kicker="상담실에서 받는 질문"
          title="AI가 등장한 뒤, 코딩학원이 받는 질문이 달라졌습니다"
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {WORRIES.map((w) => (
            <li key={w.quote} className="card flex flex-col p-6 md:p-7">
              <p className="text-[1.1875rem] leading-snug font-semibold tracking-[-0.02em]">
                &ldquo;{w.quote}&rdquo;
              </p>
              <p className="hairline mt-5 border-t pt-5 leading-relaxed text-ink-soft">{w.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 답 ─────────────────────────────────────────────────── */}
      <section className="hairline border-t py-16 md:py-24">
        <SectionHeading
          kicker="렛츠코딩의 답"
          title="AI가 대신 못 하는 것을 시킵니다"
          lead="가장 크게는, 무슨 문제를 풀지 스스로 정하는 능력입니다. 교실에 열 명이 있으면 프로젝트도 열 개입니다. 선생님은 같은 강의를 반복하는 대신 방향을 잡아 주고, 막힌 곳을 뚫어 주고, 더 나은 제안을 하는 코치가 됩니다."
        />
        <ol className="track mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 p-2">
          {CYCLE.map((c, i) => (
            <li key={c} className="flex items-center gap-2">
              <span className="card px-4 py-2.5 text-[0.9375rem] font-medium">{c}</span>
              {i < CYCLE.length - 1 && (
                <span className="text-ink-faint" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
          AI는 이 순환을 대신해 주지 않습니다. 상담에서 하는 말도 &ldquo;파이썬 기초부터
          차근차근&rdquo;에서 &ldquo;AI가 대신 못 하는 것을 시킵니다&rdquo;로 바뀝니다.
        </p>
      </section>

      {/* ── 커리큘럼 ───────────────────────────────────────────── */}
      <section className="hairline border-t py-16 md:py-24">
        <SectionHeading
          kicker="학원에 드리는 커리큘럼"
          title="무엇을, 어떤 순서로, 어디까지 시킬지 정해져 있습니다"
          lead="원장님이 매달 새로 짜던 것을 라운지가 준비합니다. 세 가지가 겹쳐 하나의 수업이 됩니다."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {/* 월별 추천 과제 */}
          <article className="card flex flex-col p-7 md:p-8">
            <p className="font-mono text-[0.75rem] text-ink-faint">01</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">매달 새로 열리는 추천 과제</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              한 달에 다섯 개씩 프로젝트 주제가 올라옵니다. 학생이 &lsquo;시작하기&rsquo;를
              누르면 자기 과제 목록에 담깁니다.
            </p>
            <p className="mt-6 text-[0.8125rem] font-medium text-ink-faint">2026년 9월의 과제</p>
            <ul className="hairline mt-2 divide-y divide-[var(--color-separator)] border-y">
              {MONTHLY.map((m) => (
                <li key={m} className="py-2.5 text-[0.9375rem]">
                  {m}
                </li>
              ))}
            </ul>
          </article>

          {/* 스킬스택 */}
          <article className="card flex flex-col p-7 md:p-8">
            <p className="font-mono text-[0.75rem] text-ink-faint">02</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">193개 능력 단위 체크리스트</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              진도표가 아니라, 할 줄 알아야 하는 것의 목록입니다. 학생이 필요한 항목을 골라
              시작하고, 항목마다 통과 기준이 적혀 있습니다.
            </p>
            <ul className="mt-6 grid flex-1 content-end gap-2">
              {SKILL_TRACKS.map((t) => (
                <li key={t.name} className="track flex items-baseline justify-between px-4 py-3">
                  <span className="text-[0.9375rem] font-medium">{t.name}</span>
                  <span className="font-mono text-[0.875rem] text-ink-soft">{t.count}문항</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* 프로젝트 5단계 */}
        <article className="card mt-4 p-7 md:p-8">
          <p className="font-mono text-[0.75rem] text-ink-faint">03</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
            한 작품을 끝까지 — 프로젝트 5단계
          </h3>
          <p className="mt-3 max-w-[56ch] leading-relaxed text-ink-soft">
            &lsquo;제작 완료&rsquo;는 3단계입니다. 남에게 보여 주고 자기 작품을 설명하는 데까지
            가야 과제가 끝납니다. 단계마다 체크되니 선생님은 누가 어디까지 왔는지 한눈에 봅니다.
          </p>
          <ol className="mt-7 grid gap-2 sm:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="track p-4">
                <span className="font-mono text-[0.75rem] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1.5 font-semibold tracking-[-0.01em]">{s.title}</p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">{s.note}</p>
              </li>
            ))}
          </ol>
        </article>
      </section>

      {/* ── 라운지 ─────────────────────────────────────────────── */}
      <section className="hairline border-t py-16 md:py-24">
        <SectionHeading
          kicker="수업이 끝나도 남는 것"
          title="학생 작품이 사라지지 않는 학원"
          lead="링크 하나면 친구 휴대폰에서 바로 실행됩니다. 작품은 주소를 갖고, 학생 프로필에 쌓여 진도표 대신 성장을 보여 줍니다. 조회·댓글·좋아요와 학원 안의 가상 화폐 루캣, 활동 뱃지가 학생에게 다시 들어올 이유를 만듭니다."
        />

        <div className="mt-10 card p-7 md:p-9">
          <p className="text-[0.8125rem] font-medium text-ink-faint">
            렛츠코딩앤플레이에서 라운지를 연 뒤 4개월 반 동안
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-4">
            {PROOF.map((p) => (
              <div key={p.label}>
                <dt className="text-[0.875rem] text-ink-soft">{p.label}</dt>
                <dd className="mt-1 text-[2.25rem] leading-none font-semibold tracking-[-0.035em] tabular-nums">
                  {p.value}
                  <span className="ml-0.5 text-lg font-medium text-ink-soft">{p.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="hairline mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.75rem] leading-relaxed text-ink-faint">
              2026.4.6 – 8.22 등록분 · 2026.8.24 운영 DB 집계
            </p>
            <ButtonLink href={LOUNGE_URL} target="_blank" rel="noopener" size="sm">
              학생 작품 둘러보기
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── 솔루션 ─────────────────────────────────────────────── */}
      <section className="hairline border-t py-16 md:py-24">
        <SectionHeading kicker="솔루션" title="렛츠코딩이 만드는 것" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          <li className="card flex flex-col p-7 md:p-9">
            <p className="text-[0.8125rem] font-medium text-ink-faint">커리큘럼 · 작품 · 운영</p>
            <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.025em]">렛츠코딩 라운지</h3>
            <p className="mt-4 max-w-[38ch] flex-1 leading-relaxed text-ink-soft">
              월별 과제와 프로젝트 5단계, 스킬스택, 작품 전시와 포트폴리오까지 — 이 페이지에서
              소개한 수업이 돌아가는 곳입니다. 과제·반·개인정보는 학원별로 분리됩니다.
            </p>
            <div className="mt-7">
              <ButtonLink href="/solutions/lounge" size="sm">
                자세히 보기
              </ButtonLink>
            </div>
          </li>
          <li className="card flex flex-col p-7 md:p-9">
            <p className="text-[0.8125rem] font-medium text-ink-faint">파이썬 · 알고리즘 · AI</p>
            <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.025em]">렛츠코딩 파이썬</h3>
            <p className="mt-4 max-w-[38ch] flex-1 leading-relaxed text-ink-soft">
              파이썬과 알고리즘, AI를 단계별로 익히는 학습 플랫폼입니다.
            </p>
            <div className="mt-7">
              <ButtonLink href="/solutions/python" size="sm">
                자세히 보기
              </ButtonLink>
            </div>
          </li>
        </ul>
      </section>

      {/* ── 전환 동선 ──────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="card flex flex-col items-start gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-2xl leading-snug font-semibold tracking-[-0.025em] text-balance md:text-[1.875rem]">
              첫 반부터 함께 하시죠
            </h2>
            <p className="mt-3 max-w-[44ch] leading-relaxed text-ink-soft">
              인원 수와 관계없이 첫 반 하나로 4주 동안 무료로 써 보세요. 결정하실 것은 구매가
              아니라, 우리 학원에 맞는지 확인해 볼지입니다.
            </p>
            <p className="mt-4 text-[0.9375rem] text-ink-soft">
              <a className="underline underline-offset-4" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
              <span className="mx-2 text-ink-faint" aria-hidden="true">
                ·
              </span>
              <a className="underline underline-offset-4" href={`tel:${CONTACT.tel.replaceAll("-", "")}`}>
                {CONTACT.tel}
              </a>
            </p>
          </div>
          <ButtonLink href="/seminar/inquiry" tone="accent" size="lg" className="shrink-0">
            4주 무료 파일럿 상담
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
