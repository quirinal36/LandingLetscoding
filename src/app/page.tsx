import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ButtonLink } from "@/components/ui";
import { CardRiver } from "@/components/landing/card-river";
import { PhoneVideo } from "@/components/landing/phone-video";
import { Rail } from "@/components/landing/rail";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { ScrollScene } from "@/components/landing/scroll-scene";
import { StoryCaptions, StoryStage } from "@/components/landing/story-stage";
import { STORY_T } from "@/components/landing/timeline";

/*
  랜딩 — MYPROBLEM.md 의 이야기를 학생 작품으로 보여 준다. (DESIGN.md 「랜딩」, HERO-MOTION-PLAN.md)

  글보다 물건이 먼저다. 이 페이지에서 움직이는 것은 전부 진짜다.
    1. 히어로      헤드라인 아래로 실제 학생 작품 카드가 3D로 흐른다
    2. 이야기      교구 상자가 천장에 부딪혀 떨어지고, 작품 카드가 쌓여 천장을 깬다. 스크롤이 재생 막대
    3. 문단        학원은 한 명을 오래 지켜야 한다. 단어가 하나씩 밝아진다
    4. 영상        원장님이 만든 30초 쇼츠가 폰 안에서 돈다
    5. AI 질문     코딩테스트가 사라진다. 남는 힘은 무엇인가
    6. 제품        렛츠코딩 라운지 하이라이트
    7. 숫자        우리 학원의 실제 운영 수치
    8. 시작 · 끝   파일럿 · 가격 · 코칭, 다음 칸은 원장님 학원에서

  사실의 경계: 숫자는 기준일이 있는 실측만. 효과(재원율·매출)는 약속하지 않는다.
  외부 사실(채용 변화)은 출처를 붙인다. 이미지는 실제 캡처와 공개 허용된 작품 썸네일만.
*/

const LOUNGE_URL = "https://lounge.letscoding.kr/works";
const INQUIRY = "/seminar/inquiry";
const CONTACT = { email: "contact@letscoding.kr", tel: "010-5679-0072" };

const reveal = (d = 0) => ({ "data-reveal": "", style: { "--d": d } as CSSProperties });
const intro = (d = 0) => ({ style: { "--d": d } as CSSProperties });

function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[68rem] px-4 md:px-6 ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[1.0625rem] font-semibold text-accent-ink md:text-xl">{children}</p>;
}

const PARAGRAPH =
  "학원은 영업이 어렵습니다. 한 명을 지켜 1년, 3년을 쌓아야 합니다. 그런데 제가 써 본 교구도, 서점의 교재도 모두 초보 1단계에서 6단계까지만 다뤘습니다. 학생은 자라는데, 커리큘럼은 제자리였습니다.";

const HIRING = [
  {
    who: "넥슨",
    what: "2026년 신입 게임 프로그래머 채용에서 코딩테스트를 없애고, AI 도구로 실무 문제를 푸는 평가를 도입했습니다.",
    source: "서울신문 · 2026.8.27",
    href: "https://www.seoul.co.kr/news/economy/2026/08/27/20260827500045",
  },
  {
    who: "CJ올리브네트웍스",
    what: "2026년 하반기 신입 공채에서 단독 코딩테스트 전형을 폐지하고 생성형 AI 활용 역량 검증을 도입했습니다.",
    source: "굿모닝경제",
    href: "https://www.goodkyung.com/news/articleView.html?idxno=291499",
  },
];
const ABILITIES = ["기획", "문제 정의", "AI 활용", "생각 근육", "공감 근육", "회복탄력성"];

/** 영상 옆 — 학생이 한 달 동안 하는 일 */
const MONTH = [
  { n: "01", t: "고른다", d: "이달의 문제 5개 중 하나, 또는 자기 문제" },
  { n: "02", t: "만든다", d: "AI와 함께. 막히는 곳은 개발일지에" },
  { n: "03", t: "올린다", d: "작품이 주소를 갖는다. 친구 폰에서 열린다" },
  { n: "04", t: "설명한다", d: "가이드 영상으로 자기 작품을 소개" },
];

type Highlight = { title: string; body: string; image?: { src: string; alt: string; fit?: "cover" | "contain" }; art?: ReactNode };
const STEPS = ["아이디어 구상", "문제와 해결 정리", "제작 완료", "라운지 게시", "가이드 영상"];
const HIGHLIGHTS: Highlight[] = [
  { title: "매달 5개의 새 문제", body: "이달의 문제가 매달 새로 열립니다. 학생은 하나를 골라 4주 프로젝트로 만듭니다.", image: { src: "/landing/monthly.png", alt: "라운지의 이달의 추천 과제 목록 화면", fit: "contain" } },
  { title: "학습과제 193개", body: "이달의 문제 대신 과제로 4주 수업을 꾸릴 수 있습니다. 학년과 난이도로 골라 반에 배정합니다.", image: { src: "/landing/learning.png", alt: "컴퓨터 과학 학습과제 목록 화면", fit: "contain" } },
  { title: "작품이 주소를 갖습니다", body: "라운지에 올린 작품은 링크 하나로 친구 휴대폰에서 바로 실행됩니다.", image: { src: "/landing/play.jpg", alt: "라운지에 올라간 코딩 게임의 실행 화면" } },
  { title: "진도표 대신 포트폴리오", body: "만든 작품이 프로필에 쌓입니다. 상담에서 무엇을 만들었는지 한 화면으로 보여 줍니다.", image: { src: "/landing/profile.jpg", alt: "작품이 쌓인 라운지 공개 프로필 화면" } },
  {
    title: "끝까지 가는 5단계",
    body: "제작 완료는 3단계입니다. 남에게 보여 주고 직접 설명하는 데까지 가야 과제가 끝납니다.",
    art: (
      <ol className="grid h-full content-center gap-2 p-6">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 text-[0.9375rem] font-semibold">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#1b2333] text-[0.75rem] text-white">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    ),
  },
  {
    title: "뱃지와 학원 화폐 루캣",
    body: "꾸준히 만들고 반응을 받으면 뱃지가 쌓입니다. 루캣으로 친구 작품에 투자하며 서로의 작품을 봅니다.",
    art: (
      <div className="grid h-full place-items-center">
        <div className="relative grid size-40 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffe7a3,#f0b33c_55%,#b97a12)] text-6xl font-extrabold text-[#7a4d05]">
          L
          <span className="absolute -right-3 -bottom-2 grid size-16 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#dbe6ff,#5b8cff_60%,#2c52b6)] text-2xl text-white">★</span>
        </div>
      </div>
    ),
  },
];

const PROOF = [
  { value: 196, unit: "건", label: "등록된 학생 작품" },
  { value: 44, unit: "명", label: "작품을 올린 학생" },
  { value: 6093, unit: "회", label: "작품 조회" },
  { value: 342, unit: "개", label: "작품에 달린 댓글" },
];

const START = [
  { kicker: "파일럿", title: "4주 무료", body: "인원 수와 관계없이 첫 반 하나로 먼저 써 보세요." },
  { kicker: "가격", title: "학생 1명\n월 11,000원", body: "부가세 포함. 원장님이 수강료에 포함해 결제합니다." },
  { kicker: "코칭", title: "첫 수업은\n함께", body: "렛츠코딩 팀이 바이브코딩 수업 진행을 코칭합니다." },
];

export default function Home() {
  return (
    <>
      <RevealObserver />

      {/* ═══ 1. 히어로 — 카드의 강 ═══════════════════════════════════ */}
      <section className="tone-dark relative overflow-hidden">
        <div className="halo top-[30%]" aria-hidden="true" />
        <Container className="relative pt-[clamp(4rem,10vh,7rem)] text-center">
          <p className="intro text-[0.9375rem] font-semibold text-ink-soft md:text-lg" {...intro(0)}>
            7년차 코딩학원이 직접 만들어 매일 쓰는 AI 시대 커리큘럼
          </p>
          <h1 className="display mt-4 text-[2.75rem] md:text-[5.75rem]">
            <span className="intro text-metal block" {...intro(120)}>
              아이는 자라는데,
            </span>
            <span className="intro text-gold block pb-2" {...intro(260)}>
              교재는 처음으로.
            </span>
          </h1>
          <p className="intro mx-auto mt-5 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-soft md:text-[1.375rem]" {...intro(420)}>
            새 로봇을 들여도 6개월이면 다시 초보 단계. 그 굴레를 끊은 수업과 플랫폼을 그대로 드립니다.
          </p>
          <div className="intro mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2" {...intro(560)}>
            <ButtonLink href={INQUIRY} tone="accent" size="lg" className="pill">
              4주 무료 파일럿 신청
            </ButtonLink>
            <a href={LOUNGE_URL} target="_blank" rel="noopener" className="link-chevron text-[1.0625rem]">
              실제 라운지 둘러보기
            </a>
          </div>
        </Container>

        <div className="intro relative mt-6 md:mt-2" {...intro(500)}>
          <CardRiver />
          <p className="absolute right-4 bottom-2 text-[0.75rem] text-ink-faint md:right-8">렛츠코딩 라운지에 올라온 실제 작품들</p>
        </div>
      </section>

      {/* ═══ 2. 이야기 — 천장을 깨다 ═════════════════════════════════ */}
      <ScrollScene length={5} mode="timeline" duration={STORY_T} className="tone-dark" pinClassName="flex items-center">
        <Container className="grid items-center gap-8 pt-16 md:gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-5 text-[0.8125rem] font-medium tracking-[0.08em] text-ink-faint uppercase">7년 동안 겪은 일</p>
            <StoryCaptions />
          </div>
          <div className="relative">
            <div className="halo opacity-60" aria-hidden="true" />
            <div className="relative">
              <StoryStage />
            </div>
          </div>
        </Container>
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10" aria-hidden="true">
          <div className="h-full origin-left bg-accent" style={{ transform: "scaleX(var(--p))" }} />
        </div>
      </ScrollScene>

      {/* ═══ 3. 한 명을 오래 지켜야 하는 사업 ═══════════════════════════ */}
      <ScrollScene length={2.4} className="tone-paper" pinClassName="flex items-center">
        <Container>
          <p className="display max-w-[22ch] text-[1.875rem] leading-[1.25] md:text-[3.25rem]">
            {PARAGRAPH.split(" ").map((w, i, all) => (
              <span key={i} className="scrub-word" style={{ "--i": i, "--n": all.length } as CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </p>
        </Container>
      </ScrollScene>

      {/* ═══ 4. 영상 — 한 달 동안 학생이 하는 일 ═══════════════════════ */}
      <section className="tone-dark relative overflow-hidden py-24 md:py-36">
        <div className="halo top-[10%] opacity-70" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
          <div {...reveal()}>
            <Eyebrow>2026년 1월부터</Eyebrow>
            <h2 className="display text-metal mt-3 text-[2.5rem] md:text-[4rem]">
              문법 대신,
              <br />
              자기 게임을 만듭니다.
            </h2>
            <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-ink-soft">
              2024년에 장고로 웹앱 수업을 시도했다가 이론의 벽에 막혔습니다. AI가 코드를 써 주게 된 2026년, 같은 수업이 됩니다.
            </p>
          </div>

          <div className="relative mx-auto" {...reveal(150)}>
            <div className="halo inset-[-20%] opacity-80" aria-hidden="true" />
            <div className="relative -rotate-3 transition-transform duration-500 hover:rotate-0">
              <PhoneVideo src="/landing/video/lounge-shorts.mp4" poster="/landing/video/lounge-shorts-poster.jpg" />
            </div>
          </div>

          <ol className="grid gap-4">
            {MONTH.map((m, i) => (
              <li key={m.n} className="glass flex items-start gap-4 rounded-2xl px-5 py-4" {...reveal(200 + i * 110)}>
                <span className="font-mono text-[0.75rem] text-accent-ink">{m.n}</span>
                <span>
                  <span className="block text-lg font-bold">{m.t}</span>
                  <span className="mt-0.5 block text-[0.9375rem] text-ink-soft">{m.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ═══ 5. AI 시대의 질문 ═══════════════════════════════════════ */}
      <section className="tone-dark border-t border-white/10 py-28 md:py-44">
        <Container>
          <div {...reveal()}>
            <Eyebrow>학부모님이 가장 날카롭게 묻는 질문</Eyebrow>
            <p className="mt-3 text-xl text-ink-soft md:text-2xl">&ldquo;AI가 코딩 다 해 주는데, 왜 배워요?&rdquo;</p>
          </div>
          <h2 className="display text-glow mt-10 text-[3rem] md:text-[7rem]" {...reveal(120)}>
            코딩테스트가
            <br />
            사라지고 있습니다.
          </h2>

          <ul className="mt-14 grid gap-4 md:grid-cols-2">
            {HIRING.map((h, i) => (
              <li key={h.who} className="card flex flex-col p-7 md:p-9" {...reveal(i * 140)}>
                <p className="text-2xl font-bold tracking-[-0.02em]">{h.who}</p>
                <p className="mt-3 flex-1 text-[1.0625rem] leading-relaxed text-ink-soft">{h.what}</p>
                <a href={h.href} target="_blank" rel="noopener" className="link-chevron mt-4 text-[0.9375rem]">
                  {h.source}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-24 md:mt-32" {...reveal()}>
            <h3 className="display text-metal max-w-[18ch] text-[2.25rem] md:text-[4rem]">남는 것은 무엇을 만들지 정하고, 끝까지 만드는 힘.</h3>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3">
            {ABILITIES.map((a, i) => (
              <li key={a} className="glass pill px-5 py-3 text-lg font-semibold md:text-xl" {...reveal(i * 90)}>
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ═══ 6. 렛츠코딩 라운지 ══════════════════════════════════════ */}
      <section className="tone-paper overflow-hidden py-28 md:py-40">
        <Container>
          <div {...reveal()}>
            <Eyebrow>렛츠코딩 라운지</Eyebrow>
            <h2 className="display text-ink-gradient mt-3 max-w-[16ch] text-[2.5rem] md:text-[4.75rem]">수업이 끝나도 작품은 남습니다.</h2>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft md:text-[1.375rem]">
              학생들이 바이브코딩으로 만든 게임과 웹사이트를 올리고, 서로 해 보고, 반응을 주고받는 곳입니다.
            </p>
          </div>

          <figure className="mt-14 overflow-hidden rounded-[28px] bg-white p-2 md:p-3" {...reveal(100)}>
            <div className="flex items-center gap-1.5 px-3 pt-1 pb-2.5" aria-hidden="true">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate rounded-full bg-[#f0f1f4] px-4 py-1 text-[0.8125rem] text-ink-faint">lounge.letscoding.kr</span>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
              <Image src="/landing/works-grid.jpg" alt="렛츠코딩 라운지 작품 목록. 게임과 웹사이트 썸네일이 격자로 쌓여 있다" fill sizes="(min-width: 1088px) 1040px, 94vw" className="object-cover object-top" />
            </div>
          </figure>
        </Container>

        <div className="mt-24">
          <Container>
            <h3 className="display mb-8 text-[1.75rem] md:text-[2.5rem]" {...reveal()}>
              하이라이트 살펴보기
            </h3>
          </Container>
          <Rail label="렛츠코딩 라운지 하이라이트">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex w-[82vw] max-w-[22rem] shrink-0 flex-col overflow-hidden rounded-[28px] bg-white">
                <div className="relative h-64 bg-[#eef0f4]">
                  {h.image ? <Image src={h.image.src} alt={h.image.alt} fill sizes="352px" className={h.image.fit === "contain" ? "object-contain p-4" : "object-cover object-top"} /> : h.art}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[1.375rem] font-bold tracking-[-0.025em]">{h.title}</p>
                  <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{h.body}</p>
                </div>
              </li>
            ))}
          </Rail>
        </div>
      </section>

      {/* ═══ 7. 운영 수치 ═══════════════════════════════════════════ */}
      <section className="tone-dark py-28 md:py-40">
        <Container>
          <div {...reveal()}>
            <Eyebrow>우리 학원에서 먼저 4개월 반</Eyebrow>
            <h2 className="display text-metal mt-3 max-w-[16ch] text-[2.5rem] md:text-[4.5rem]">팔기 전에, 먼저 매일 썼습니다.</h2>
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {PROOF.map((p, i) => (
              <div key={p.label} {...reveal(i * 120)}>
                <dd className="display text-gold text-[3.25rem] tabular-nums md:text-[5rem]">
                  <span data-count={p.value}>{p.value.toLocaleString("ko-KR")}</span>
                  <span className="ml-1 text-[0.4em] text-ink-soft [-webkit-text-fill-color:var(--color-ink-soft)]">{p.unit}</span>
                </dd>
                <dt className="mt-2 text-[1.0625rem] text-ink-soft">{p.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-[0.8125rem] text-ink-faint">렛츠코딩앤플레이 · 2026.4.6 – 8.22 등록분 · 2026.8.24 운영 DB 집계</p>
        </Container>
      </section>

      {/* ═══ 8. 시작 ═══════════════════════════════════════════════ */}
      <section className="tone-paper py-28 md:py-40">
        <Container>
          <div {...reveal()}>
            <Eyebrow>시작하는 법</Eyebrow>
            <h2 className="display text-ink-gradient mt-3 max-w-[14ch] text-[2.5rem] md:text-[4.5rem]">반 하나로 충분합니다.</h2>
          </div>
          <ul className="mt-14 grid gap-4 md:grid-cols-3">
            {START.map((s, i) => (
              <li key={s.kicker} className="flex flex-col rounded-[28px] bg-white p-8 md:p-10" {...reveal(i * 120)}>
                <p className="text-[0.9375rem] font-semibold text-accent-ink">{s.kicker}</p>
                <p className="display mt-3 text-[2.25rem] whitespace-pre-line md:text-[2.5rem]">{s.title}</p>
                <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[1.0625rem] text-ink-soft" {...reveal()}>
            가맹 계약이 아닙니다. 학생 수만큼 이용권을 사서 쓰는 구독입니다.
          </p>
        </Container>
      </section>

      {/* ═══ 9. 다음 칸 ═════════════════════════════════════════════ */}
      <section className="tone-dark relative overflow-hidden py-32 text-center md:py-48">
        <div className="halo top-[20%]" aria-hidden="true" />
        <Container className="relative">
          <svg viewBox="0 0 240 120" className="final-stairs mx-auto w-48 md:w-64" fill="none" aria-hidden="true" {...reveal()}>
            <path d="M10 110 V90 H50 V70 H90 V50 H130 V30 H170" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" pathLength={1} className="final-draw" />
            <path d="M170 30 V10 H230" stroke="var(--color-accent-ink)" strokeWidth="3" strokeDasharray="6 7" />
          </svg>
          <h2 className="display text-glow mx-auto mt-10 text-[3rem] md:text-[6.5rem]" {...reveal(120)}>
            다음 칸은,
            <br />
            원장님 학원에서.
          </h2>
          <p className="mx-auto mt-6 max-w-[36ch] text-lg text-ink-soft md:text-[1.375rem]" {...reveal(220)}>
            결정하실 것은 구매가 아니라, 우리 학원에 맞는지 4주 동안 확인해 볼지입니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3" {...reveal(320)}>
            <ButtonLink href={INQUIRY} tone="accent" size="lg" className="pill">
              4주 무료 파일럿 신청
            </ButtonLink>
            <a href={LOUNGE_URL} target="_blank" rel="noopener" className="link-chevron text-[1.0625rem]">
              실제 라운지 둘러보기
            </a>
          </div>
          <p className="mt-10 text-[0.9375rem] text-ink-soft">
            <a className="underline underline-offset-4" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <span className="mx-2 text-ink-faint" aria-hidden="true">·</span>
            <a className="underline underline-offset-4" href={`tel:${CONTACT.tel.replaceAll("-", "")}`}>{CONTACT.tel}</a>
          </p>
        </Container>
      </section>
    </>
  );
}
