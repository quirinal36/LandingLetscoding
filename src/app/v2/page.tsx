import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, reveal } from "@/components/landing/section";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { ButtonLink } from "@/components/ui";
import { CONTACT, PROOF, PROOF_ASOF } from "@/lib/offer";
import WORKS from "@/lib/works.json";
import { MonthOfMaking, TeacherSupport, GrowthPortfolio, BeforeYouBegin, StartSmall } from "@/components/landing/classroom-sections";

export const metadata: Metadata = {
  title: "배운 코딩이 작품으로 · 렛츠코딩 라운지 v2",
  description: "작품을 만들고, 공유하고, 성장을 기록하는 코딩학원. 렛츠코딩 라운지에서 반 하나로 4주간 시작하세요.",
  robots: { index: false, follow: false },
};

const INQUIRY = "/seminar/inquiry";
const LOUNGE = "https://lounge.letscoding.kr/works";
// 기존 공개 허용 자산은 나나쌤의 작품이다. 학생 작품·학년·제작 기간으로 소개하지 않는다.
const examples = WORKS.filter((work) => ["ten-pang", "pixel-art-maker", "image-editor"].includes(work.slug));
export default function LandingV2() {
  return (
    <div className="landing-v2">
      <RevealObserver />

      {/* A. 히어로 */}
      <section className="tone-dark v2-hero">
        <Container className="relative z-10 text-center">
          <div className="v2-edition"><span>LET’S CODING LOUNGE</span><Link href="/">기존 랜딩 보기 ↗</Link></div>
          <p className="v2-kicker intro">다음 달, 아이들과 무엇을 만들지 고민이신가요?</p>
          <h1 className="display v2-hero-title intro"><span className="text-metal">배운 코딩이 작품으로.</span><br /><span className="text-gold">작품이 우리 학원의<br className="sm:hidden" /> 포트폴리오로.</span></h1>
          <p className="v2-lead mx-auto mt-7 max-w-xl intro">만들고, 함께 해 보고, 더 나은 작품으로.<br />아이의 배움이 눈에 보이는 결과물로 쌓이는 곳.</p>
          <div className="v2-actions intro"><ButtonLink href={INQUIRY} tone="accent" size="lg" className="pill">4주 무료 파일럿 신청 <span aria-hidden="true">↗</span></ButtonLink><a href="#works" className="link-chevron">실제 작품 보기</a></div>
          <p className="v2-reassurance intro">기존 교재·교구 활용 <span>·</span> 반 하나로 시작 <span>·</span> 가맹 계약 없음</p>
          <div className="v2-hero-stage intro">
            <div className="v2-stage-light" aria-hidden="true" />
            <div className="v2-browser">
              <div className="v2-browser-bar"><span aria-hidden="true">● ● ●</span><span>lounge.letscoding.kr</span><span>WORKS</span></div>
              <Image src="/landing/works-grid.jpg" alt="렛츠코딩 라운지에 등록된 게임과 웹사이트의 작품 갤러리" width={1600} height={1000} sizes="(max-width: 768px) 94vw, 880px" preload className="v2-gallery-image" />
            </div>
            <div className="v2-stage-note"><span className="v2-note-dot" />교실에서 시작해, 교실 밖으로.</div>
          </div>
          <div className="v2-hero-footer"><span>작품을 만드는 수업. 성장이 남는 학원.</span><a href="#works">라운지 만나보기 <span aria-hidden="true">↓</span></a></div>
        </Container>
      </section>

      {/* B. 공개된 실제 작품 */}
      <section id="works" className="tone-paper v2-section">
        <Container>
          <div className="v2-section-heading" {...reveal()}><div><p className="v2-kicker">01 — MADE WITH CURIOSITY</p><h2 className="display v2-title">아이디어는 작게.<br />가능성은 이렇게 넓게.</h2></div><p className="v2-lead max-w-sm">게임부터 나만의 도구까지.<br />직접 열어 보면, 다음 수업이 떠오릅니다.</p></div>
          <div className="v2-work-grid">
            {examples.map((work, i) => <a key={work.slug} href={work.href} target="_blank" rel="noopener noreferrer" className="v2-work" {...reveal(i * 90)}><div className="v2-work-image"><Image src={`/landing/works/${work.slug}.webp`} alt={`${work.title} 실행 화면`} width={560} height={315} sizes="(max-width: 640px) 92vw, 33vw" /><span className="v2-work-arrow" aria-hidden="true">↗</span></div><div className="v2-work-caption"><div><p className="v2-caption">{work.kind}</p><h3>{work.title}</h3></div><span className="v2-caption">작품 열기</span></div></a>)}
          </div>
          <div className="v2-underlined-row"><p className="v2-caption">공개 사용이 허용된 나나쌤의 실제 작품 예시입니다.</p><a href={LOUNGE} target="_blank" rel="noopener noreferrer" className="link-chevron">라운지 전체 둘러보기</a></div>
        </Container>
      </section>

      {/* C. 한 달 수업 */}
      <MonthOfMaking />

      {/* D. 선생님의 역할과 지원 */}
      <TeacherSupport />

      {/* E. 상담에서 보여 주는 결과물 */}
      <GrowthPortfolio />

      {/* F. 집계 기준이 있는 운영 기록 */}
      <section className="tone-dark v2-section">
        <Container><div className="v2-proof-heading" {...reveal()}><p className="v2-kicker">05 — BUILT IN A REAL CLASSROOM</p><h2 className="display v2-title">직접 쓰고 있습니다.<br /><span className="text-metal">그래서, 보여 드릴 수 있습니다.</span></h2><p className="v2-lead mt-7">코딩학원에서 시작한 라운지.<br />공유된 작품과 그 안에서 오간 반응의 기록입니다.</p></div><dl className="v2-proof">{PROOF.map((proof, i) => <div key={proof.label} {...reveal(i * 75)}><dt>{proof.label}</dt><dd><span className="text-gold">{proof.value.toLocaleString("ko-KR")}</span><small>{proof.unit}</small></dd></div>)}</dl><p className="v2-caption mt-8">{PROOF_ASOF}</p><p className="v2-caption mt-3">활동 기록이며, 매출·재등록률의 개선을 의미하지 않습니다.</p></Container>
      </section>

      {/* G. 가격과 도입 */}
      <StartSmall />

      {/* H. 도입 전 질문 */}
      <BeforeYouBegin />

      {/* I. 마지막 제안 */}
      <section className="tone-dark v2-section v2-finale">
        <Container className="relative"><p className="v2-kicker" {...reveal()}>THE NEXT CHAPTER IS YOURS</p><h2 className="display v2-finale-title" {...reveal()}>우리 반의 다음 작품,<br /><span className="text-gold">여기서 시작합니다.</span></h2><p className="v2-lead mt-8" {...reveal()}>학생에게는 다음에 만들 것이,<br />학부모에게는 성장을 보여 줄 결과물이 생깁니다.</p><div className="v2-actions" {...reveal()}><ButtonLink href={INQUIRY} tone="accent" size="lg" className="pill">4주 무료 파일럿 신청 ↗</ButtonLink><a href={LOUNGE} target="_blank" rel="noopener noreferrer" className="link-chevron">실제 라운지 둘러보기</a></div><div className="v2-footer"><span>LET’S CODING LOUNGE</span><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><Link href="/">기존 랜딩 보기 ↗</Link></div></Container>
      </section>
    </div>
  );
}
