import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui";
import { GROWTH_T, GrowthCaptions, GrowthStage } from "@/components/landing/growth-stage";
import { ScrollScene } from "@/components/landing/scroll-scene";
import { CardRiver } from "@/components/landing/card-river";
import { LoopDiagram } from "@/components/landing/loop-diagram";
import { MonthOfMaking, TeacherSupport, GrowthPortfolio, BeforeYouBegin, StartSmall } from "@/components/landing/classroom-sections";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { ScrollProgress } from "@/components/landing/scroll-progress";
import { InfinityWindow } from "@/components/landing/infinity-window";
import { Container, Eyebrow, intro, reveal } from "@/components/landing/section";
import { COMPANY } from "@/lib/nav";
import { CONTACT, PROOF, PROOF_ASOF } from "@/lib/offer";

/*
  랜딩 — 원장님이 스크롤을 내리며 따라가는 한 줄 이야기. (docs/LANDING-PLAN.md v2)

  선언 → 왜 → 그래서 → 어떻게 → 어디서. 각 섹션의 마지막 줄이 다음 섹션의 질문이다.
    1. 히어로      주제1 선언. 학생 한 명이, 스타트업이 됩니다. 아래로 실제 학생 작품 카드가 흐른다
    2. 시대        주제2. 무한한 지식의 시대를 지나 무한 실행의 시대로. 채용 사례는 블로그 활용을 위해 숨김
    3. 성장        만들고 → 공유하기 → 성장하고 → 기록하기 팝업북
    4. 공간        공동체가 함께 소통하는 라운지와 작품 목록
    5. 사이클      작품공유 · 가상경제 · 과제관리
    6. 기능        라운지 기능소개
    7. 한 달 수업   과제 193개 · 매달 5개 · 활동 영상 · 4주 운영 예시
    8. 선생님 지원 역할 세 가지 · 코칭 · 제작 도구 안내
    9. 상담 결과물 작품 링크와 공개 프로필
    10. 숫자       기준일이 있는 운영 실측
    11. 시작       파일럿 · 가격 · 코칭
    12. 질문       도입 전 FAQ
    13. 끝         다음 스타트업의 탄생을 기다립니다.

  옮겨 간 것: 교육 장면과 2024년 장고 이야기 → /about(브랜드 스토리),
  라운지 확장 모델 도식과 이론 → /about/philosophy(교육 철학).

  사실의 경계: 숫자는 기준일이 있는 실측만. 효과(재원율·매출)는 약속하지 않는다.
  외부 사실(채용 변화)은 출처를 붙인다. 이미지는 실제 캡처와 공개 허용된 작품 썸네일만.
*/

const LOUNGE_URL = "https://lounge.letscoding.kr/works";
const INQUIRY = "/seminar/inquiry";

/* 구조화 데이터 — 이 페이지에 보이는 사실만 싣는다. 가격·문구를 바꾸면 여기도 같이 고친다. */
const ORG_ID = `${COMPANY.url}/#organization`;
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: COMPANY.name,
      alternateName: [COMPANY.short, COMPANY.latin],
      url: COMPANY.url,
      logo: `${COMPANY.url}/icon.png`,
      email: CONTACT.email,
      telephone: `+82-${CONTACT.tel.slice(1)}`,
      description: "7년차 코딩학원이 만들어 매일 쓰는 AI 시대 커리큘럼과 수업 운영 도구를 코딩 학원에 제공합니다.",
    },
    {
      "@type": "WebSite",
      "@id": `${COMPANY.url}/#website`,
      name: COMPANY.short,
      url: COMPANY.url,
      inLanguage: "ko-KR",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Service",
      name: "렛츠코딩 라운지",
      url: "https://lounge.letscoding.kr",
      provider: { "@id": ORG_ID },
      audience: { "@type": "BusinessAudience", name: "코딩 학원" },
      description: "학생들이 바이브코딩으로 만든 게임과 웹사이트를 올리고, 서로 해 보고, 반응을 주고받는 곳입니다.",
      offers: [
        {
          "@type": "Offer",
          name: "4주 무료 파일럿",
          price: 0,
          priceCurrency: "KRW",
          description: "인원 수와 관계없이 첫 반 하나로 먼저 써 보세요.",
        },
        {
          "@type": "Offer",
          name: "학생 1명 월 이용료",
          priceCurrency: "KRW",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: 11000,
            priceCurrency: "KRW",
            unitText: "학생 1명 월",
            valueAddedTaxIncluded: true,
          },
        },
      ],
    },
  ],
};

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

type Highlight = { title: string; body: string; image?: { src: string; alt: string; fit?: "cover" | "contain" }; art?: ReactNode };
const HIGHLIGHTS: Highlight[] = [
  { title: "작품이 주소를 갖습니다", body: "라운지에 올린 작품은 링크 하나로 친구 휴대폰에서 바로 실행됩니다.", image: { src: "/landing/play.jpg", alt: "라운지에 올라간 코딩 게임의 실행 화면" } },
  { title: "진도표 대신 포트폴리오", body: "만든 작품이 프로필에 쌓입니다. 상담에서 무엇을 만들었는지 한 화면으로 보여 줍니다.", image: { src: "/landing/profile.jpg", alt: "작품이 쌓인 라운지 공개 프로필 화면" } },
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <RevealObserver />

      {/* ═══ 1. 히어로 — 카드의 강 ═══════════════════════════════════ */}
      <section className="tone-dark relative overflow-hidden">
        <div className="halo top-[30%]" aria-hidden="true" />
        <Container className="relative pt-[clamp(4rem,10vh,7rem)] text-center">
          <p className="intro text-[0.9375rem] font-semibold text-ink-soft md:text-lg" {...intro(0)}>
            7년차 코딩학원이 만들어 매일 쓰는 AI 시대 커리큘럼
          </p>
          <h1 className="display mt-4 text-[2.75rem] md:text-[5.75rem]">
            <span className="intro text-metal block" {...intro(120)}>
              학생 한 명이,
            </span>
            <span className="intro text-gold block pb-2" {...intro(260)}>
              스타트업이 됩니다.
            </span>
          </h1>
          <p className="intro mx-auto mt-5 max-w-[36ch] text-[1.0625rem] leading-relaxed text-ink-soft md:text-[1.375rem]" {...intro(420)}>
            학생이 곧 하나의 스타트업입니다.<br />만들고, 알리고, 투자를 받습니다.
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

      {/* ═══ 2. 시대 — 무한 지식에서 무한 실행으로 (주제2) ══════════════ */}
      <section className="tone-dark border-t border-white/10 py-28 md:py-44">
        <Container>
          {/* 학부모 질문과 채용 사례는 추후 블로그에서 활용하기 위해 보관 */}
          <div hidden>
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
          </div>

          <div>
            {/* 앞은 검은 바탕, 누워 있는 8 모양으로만 뚫려 있다. 그 너머로 무한히 만들어질 캐릭터들 */}
            <InfinityWindow src="/landing/characters-crowd.jpg" />

            <div className="mt-12 text-center md:mt-16" {...reveal(120)}>
              <h2 className="display text-metal mx-auto max-w-[20ch] text-[2.25rem] md:text-[4rem]">무한한 지식의 시대를 지나,<br />무한한 실행의 시대로 나아갑니다.</h2>
              <p className="mx-auto mt-6 max-w-[40ch] text-lg leading-relaxed text-balance text-ink-soft md:text-[1.375rem]">
                기업 채용, 이제 아는 것을 묻지 않고, 해내는 것을 봅니다.<br />중요한 것은 무엇을 만들지 정하고, 끝까지 만드는 힘입니다.
              </p>
            </div>
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {ABILITIES.map((a, i) => (
                <li key={a} className="glass pill px-5 py-3 text-lg font-semibold md:text-xl" {...reveal(i * 90)}>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ═══ 3. 성장 — 학생 한 명이 스타트업이 되는 네 단계 (docs/GROWTH-SCENE-PLAN.md) ═ */}
      <section className="tone-paper pt-4 md:pt-8">
        <Container>
          <div {...reveal()}>
            <Eyebrow>어떻게 성장과정으로 이어지는가</Eyebrow>
            <h2 className="display text-ink-gradient mt-3 max-w-[18ch] text-[2.25rem] md:text-[4rem]">만들고 공유하기,<br />성장하고 기록하기</h2>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft md:text-[1.375rem]">
              내가 만든 상품을 함께 플레이 해보고,<br />주고받는 소통과 함께 성장합니다. 그 힘은 공동체 안에서 자랍니다.
            </p>
          </div>
        </Container>
      </section>
      <ScrollScene length={8.8} mode="timeline" duration={GROWTH_T} className="tone-paper" pinClassName="flex items-center">
        <Container className="grid items-center gap-8 md:gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="order-2 lg:order-1">
            <GrowthCaptions />
          </div>
          <div className="order-1 lg:order-2">
            <GrowthStage />
          </div>
        </Container>
      </ScrollScene>

      {/* ═══ 4. 공간 — 렛츠코딩 라운지 ════════════════════════════════ */}
      <section className="tone-paper overflow-hidden py-28 md:py-40">
        <Container>
          <div {...reveal()}>
            <Eyebrow>렛츠코딩 라운지</Eyebrow>
            <h2 className="display text-ink-gradient mt-3 max-w-[16ch] text-[2.5rem] md:text-[4.75rem]">공동체가 함께<br />즐겁게 소통할 수 있는 놀이터같은 공간</h2>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft md:text-[1.375rem]">
              내가 만든 게임과 웹사이트를 공유하고,<br />반응을 주고받는 곳.<br />수업이 끝나도 마음은 오랫동안 머무는 공간
            </p>
          </div>

          {/* 4-1. 라운지 작품 목록 캡처 — 누운 브라우저 창이 스크롤로 일어서고, 선 뒤에는 창 안의 목록이 아래로 흐른다 */}
          <ScrollProgress className="lounge-shot-wrap mt-14">
            <figure className="lounge-shot overflow-hidden rounded-[28px] bg-white p-2 md:p-3">
              <div className="flex items-center gap-1.5 px-3 pt-1 pb-2.5" aria-hidden="true">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 truncate rounded-full bg-[#f0f1f4] px-4 py-1 text-[0.8125rem] text-ink-faint">lounge.letscoding.kr</span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
                <Image src="/landing/works-grid.jpg" alt="렛츠코딩 라운지 작품 목록. 게임과 웹사이트 썸네일이 격자로 쌓여 있다" fill sizes="(min-width: 1088px) 1040px, 94vw" className="lounge-shot-img object-cover" />
              </div>
            </figure>
          </ScrollProgress>

          {/* 5. 세 축, 하나의 순환 */}
          <div className="mt-28 md:mt-36">
            <div {...reveal()}>
              <Eyebrow>미래교육을 위해 설계된 사이클</Eyebrow>
              <h3 className="display mt-3 max-w-[18ch] text-[1.75rem] md:text-[2.5rem]">세가지 축이 서로 탄탄하게 연결되어 있습니다.</h3>
              <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                라운지는 작품공유, 가상경제, 과제관리 세 축으로 운영됩니다. 작품이 조회되면 자산이 생기고, 과제를 끝내면 자산이 늘고, 과제가 곧 작품이 됩니다.
              </p>
            </div>
            <div className="mt-12">
              <LoopDiagram />
            </div>
          </div>
        </Container>

        {/* 6. 라운지 핵심기능 */}
        <Container className="mt-24">
          <h3 className="display mb-8 text-[1.75rem] md:text-[2.5rem]" {...reveal()}>
            렛츠코딩라운지 기능소개
          </h3>
          <ul aria-label="렛츠코딩 라운지 핵심기능" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => (
              <li key={h.title} className="flex flex-col overflow-hidden rounded-[28px] bg-white" {...reveal((i % 3) * 110)}>
                <div className="hl-media relative h-64 bg-[#eef0f4]">
                  {h.image ? <Image src={h.image.src} alt={h.image.alt} fill sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw" className={h.image.fit === "contain" ? "object-contain p-4" : "object-cover object-top"} /> : h.art}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-[1.375rem] font-bold tracking-[-0.025em]">{h.title}</p>
                  <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">{h.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <div className="landing-v2">
        {/* ═══ 7. 한 달 수업 — 활동 영상과 4주 운영 예시 ═══ */}
        <MonthOfMaking withVideo />
        {/* ═══ 8. 선생님의 역할과 지원 ═══ */}
        <TeacherSupport />
        {/* ═══ 9. 상담에서 보여 주는 결과물 ═══ */}
        <GrowthPortfolio />
      </div>

      {/* ═══ 10. 운영 수치 ═══════════════════════════════════════════ */}
      <section className="tone-dark border-t border-white/10 py-28 md:py-40">
        <Container>
          <div {...reveal()}>
            <Eyebrow>무한한 아이디어와 실행결과</Eyebrow>
            <h2 className="display text-metal mt-3 max-w-[16ch] text-[2.5rem] md:text-[4.5rem]">지금 이순간도 새로운 작품들이<br />등록되고 있습니다.</h2>
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {PROOF.map((p, i) => (
              <div key={p.label} {...reveal(i * 120)}>
                <dd className="display whitespace-nowrap text-[clamp(2.5rem,12vw,3.25rem)] tabular-nums md:text-[clamp(3rem,6vw,4.5rem)]">
                  <span className="sr-only">{p.value.toLocaleString("ko-KR")}</span><span className="inline-block h-[1.15em] overflow-hidden align-bottom leading-[1.15]"><span className="text-gold block" aria-hidden="true" data-count={p.value}>{p.value.toLocaleString("ko-KR")}</span></span>
                  <span className="ml-1 text-[0.4em] text-ink-soft [-webkit-text-fill-color:var(--color-ink-soft)]">{p.unit}</span>
                </dd>
                <dt className="mt-2 text-[1.0625rem] text-ink-soft">{p.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-[0.8125rem] text-ink-faint">{PROOF_ASOF}</p>
        </Container>
      </section>

      {/* ═══ 11. 시작 — 다크·골드 파일럿 카드 ═══ */}
      <div className="landing-v2">
        <StartSmall />
      </div>

      {/* ═══ 12. 도입 전 질문 ═══ */}
      <div className="landing-v2">
        <BeforeYouBegin />
      </div>

      {/* ═══ 13. 끝 — 다음 스타트업 ════════════════════════════════════ */}
      <section className="tone-dark relative overflow-hidden py-32 text-center md:py-48">
        <div className="halo top-[20%]" aria-hidden="true" />
        <Container className="relative">
          <h2 className="display text-glow mx-auto text-[3rem] md:text-[6.5rem]" {...reveal()}>
            다음 스타트업의 탄생을 기다립니다.
          </h2>
          <p className="mx-auto mt-6 max-w-[36ch] text-lg text-ink-soft md:text-[1.375rem]" {...reveal(220)}>
            우리 학원의 이름으로 된 공간이 생기게 됩니다.<br />수업이 끝나 교실 밖을 나가는 순간부터,<br />렛츠코딩라운지의 진가가 시작됩니다.
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
