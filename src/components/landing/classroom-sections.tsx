import Image from "next/image";
import { Container, reveal } from "@/components/landing/section";
import { PhoneVideo } from "@/components/landing/phone-video";
import { ButtonLink } from "@/components/ui";
import { START } from "@/lib/offer";
import "./landing-v2.css";

const INQUIRY = "/seminar/inquiry";
const weeks = [
  { n: "01", title: "무엇을 만들까?", text: "이달의 추천 과제나 나만의 아이디어에서 시작합니다.", result: "아이디어 · 문제 정의" },
  { n: "02", title: "직접 만들어 봅니다.", text: "제작 도구로 만들고, 막힌 문제와 해결 과정을 개발일지에 남깁니다.", result: "제작 · 개발일지" },
  { n: "03", title: "친구에게 보여 줍니다.", text: "라운지에 올리고, 친구가 직접 해 본 반응을 받아 봅니다.", result: "공유 · 피드백" },
  { n: "04", title: "내 말로 설명합니다.", text: "가이드 영상과 완료 보고서로 만든 것과 배운 것을 정리합니다.", result: "설명 · 회고" },
];
const questions = [
  { q: "기존 교재와 수업을 모두 바꿔야 하나요?", a: "기존 교재와 교구를 활용하면서 작품 제작·공유 활동을 연결할 수 있습니다. 처음에는 운영 중인 반 하나에서 프로젝트 수업으로 시작해 보세요. 정해진 교안만으로 진행하는 수업보다, 학생이 직접 만들고 설명하는 수업에 잘 맞습니다." },
  { q: "코딩은 어디서 하나요? AI 도구도 포함되나요?", a: "작품은 외부 제작 도구에서 만들고, 라운지에는 HTML·ZIP 파일을 올리거나 작품 링크를 연결합니다. 라운지는 AI 코딩 편집기를 제공하지 않습니다. 외부 도구의 계정·연령 조건·이용료는 각 도구의 정책을 따르며, 도입 상담에서 수업에 사용할 환경을 함께 확인합니다." },
  { q: "다른 학원에도 작품이 보이나요?", a: "공개 작품은 여러 학원이 함께 보는 갤러리에 올라갑니다. 작품마다 공개, 링크로만 공유, 비공개를 선택할 수 있습니다. 학원별 페이지도 있지만, 이를 학원 내부 전용 공개 기능과 혼동하지 않도록 안내합니다." },
  { q: "학부모는 어떻게 보나요? 개발일지도 공개되나요?", a: "공개 작품과 프로필은 링크로 보여 줄 수 있습니다. 개발일지는 로그인한 같은 학원 회원이 보는 기록이며, 공개 프로필의 작품 목록과는 다릅니다. 학부모에게는 공개 가능한 작품 링크를 전달해 주세요." },
  { q: "어린 학생의 가입과 동의는 어떻게 하나요?", a: "만 14세 미만 학생은 학원에서 보호자 서면 동의를 받고, 시스템에는 동의를 확인한 사실을 기록하는 방식입니다. 도입할 때 가입 절차와 학원에서 준비할 동의 사항을 함께 안내합니다." },
  { q: "4주가 끝나면 자동으로 결제되나요?", a: "자동으로 유료 전환되지 않습니다. 파일럿 동안 수업과 학생 반응을 살펴보고 계속 이용할지 결정합니다. 이용을 중단하거나 학생이 학원을 그만둬도 계정과 작품은 유지되며, 이용권 상태에 따라 이용 가능한 기능이 달라집니다." },
];


export function MonthOfMaking({ withVideo = false }: { withVideo?: boolean }) {
  return (
    <section id="classroom" className="tone-dark v2-section">
        <Container>
          <div className="v2-section-heading" {...reveal()}><div><h2 className="display v2-title">다음 달 수업,<br /><span className="text-gold">프로젝트 하나로.</span></h2></div><p className="v2-lead max-w-sm">완성에서 끝나지 않습니다.<br />남에게 보여 주고, 자기 말로 설명하는 데까지.</p></div>
          <div className="v2-curriculum" {...reveal()}><div className="v2-curriculum-copy"><p className="v2-kicker">시작할 거리는 준비되어 있습니다</p><div className="v2-resource"><strong>193<span>개</span></strong><p>컴퓨터 과학 · 웹 · 로블록스 · 파이썬 학습과제</p></div><div className="v2-resource"><strong>5<span>개 / 매달</span></strong><p>새롭게 만나는 이달의 추천 과제</p></div></div>{withVideo ? <div className="v2-activity-video"><PhoneVideo src="/landing/video/lounge-activity-loop.mp4" poster="/landing/video/lounge-activity-loop-poster.jpg" /></div> : <div className="v2-monthly-image"><Image src="/landing/monthly.png" alt="학생이 골라 시작하는 이달의 추천 과제 화면" width={1200} height={900} sizes="(max-width: 768px) 92vw, 620px" /></div>}</div>
          <ol className="v2-weeks">{weeks.map((week, i) => <li key={week.n} {...reveal(i * 75)}><p className="v2-week-number">WEEK <span>{week.n}</span></p><h3>{week.title}</h3><p>{week.text}</p><span className="v2-week-result">{week.result}</span></li>)}</ol>
          <p className="v2-caption mt-8">4주 운영 예시입니다. 학생 수준과 수업 시간에 맞춰 진행 속도를 조정합니다.</p>
        </Container>
      </section>
  );
}

export function TeacherSupport() {
  return (
    <section className="tone-paper v2-section">
        <Container>
          <div className="v2-teacher-grid"><div {...reveal()}><h2 className="display v2-title">선생님의 역할은<br />좋은 다음 질문을<br />건네는 일.</h2><p className="v2-lead mt-7">방향을 잡고, 막힌 곳을 돕고,<br />더 나은 시도를 제안해 주세요.</p><a href={INQUIRY} className="link-chevron mt-6">우리 반 수업 상담하기</a></div><div className="v2-teacher-support" {...reveal(100)}><Image src="/about/workshop-generated.webp" alt="AI로 생성한 바이브코딩 워크숍 이미지. 선생님들이 노트북으로 실습하고 강사가 함께 돕는 모습" width={1672} height={941} sizes="(max-width: 768px) 92vw, 540px" className="v2-workshop" /><div className="v2-support-row"><span>01</span><div><h3>첫 수업은 함께 준비합니다.</h3><p>렛츠코딩 팀이 바이브코딩 수업 진행을 코칭합니다.</p></div></div><div className="v2-support-row"><span>02</span><div><h3>다음 수업도 이어갈 수 있도록.</h3><p>과제 자료와 제품 가이드를 활용하고, 온라인 연수의 일정과 참여 조건은 도입 상담에서 안내받으세요.</p></div></div><div className="v2-support-row"><span>03</span><div><h3>선생님의 피드백이 성장을 만듭니다.</h3><p>과제와 개발일지를 검토하고, 작품에 피드백하는 시간은 수업 운영에 함께 계획합니다.</p></div></div></div></div>
          <div className="v2-tool-strip" {...reveal()}><p className="v2-kicker">수업 도구의 역할</p><p><strong>외부 도구로 제작</strong><span aria-hidden="true">→</span><strong>라운지에 게시</strong><span aria-hidden="true">→</span><strong>공유하고 기록</strong></p><small>라운지는 작품 공유·기록 공간입니다. 외부 AI 제작 도구의 계정과 이용료는 별도로 확인합니다.</small></div>
        </Container>
      </section>
  );
}

export function GrowthPortfolio() {
  return (
    <section className="tone-paper v2-portfolio-section">
        <Container><div className="v2-portfolio" {...reveal()}><div className="v2-portfolio-copy"><h2 className="display v2-title">“이번 달에<br />이걸 만들었어요.”</h2><p className="v2-lead mt-7">상담에서 작품을 열어 보여 주세요.<br />아이의 배움이 설명할 수 있는 결과물로 남습니다.</p><ul className="v2-plain-list"><li>작품마다 생기는 공유 링크</li><li>프로필에 차곡차곡 쌓이는 작품</li><li>휴대폰에서도 열어 볼 수 있는 결과물</li></ul><p className="v2-caption mt-8">개발일지는 로그인한 같은 학원 회원에게 보이는 기록입니다.</p></div><div className="v2-profile-image"><Image src="/landing/profile.jpg" alt="작품과 뱃지가 쌓인 라운지 공개 프로필 예시" width={1000} height={1200} sizes="(max-width: 768px) 92vw, 540px" /></div></div></Container>
      </section>
  );
}

export function BeforeYouBegin() {
  return (
    <section className="tone-paper v2-faq-section">
        <Container className="v2-faq-grid"><div {...reveal()}><h2 className="display v2-title">궁금한 것부터<br />확인하세요.</h2><p className="v2-lead mt-6">우리 학원에 맞는 선택을 위해.</p></div><div className="v2-faq">{questions.map((question) => <details key={question.q}><summary>{question.q}<span aria-hidden="true">+</span></summary><p>{question.a}</p></details>)}</div></Container>
      </section>
  );
}

export function StartSmall() {
  return (
    <section id="start" className="tone-paper v2-section">
        <Container><div className="v2-section-heading" {...reveal()}><div><h2 className="display v2-title">반 하나면 충분합니다.<br />먼저, 4주만.</h2></div><p className="v2-lead max-w-sm">우리 학원의 수업에 맞는지는<br />직접 써 보고 결정하세요.</p></div><div className="v2-offers">{START.map((offer, i) => <div key={offer.kicker} className={i === 0 ? "v2-offer v2-offer-featured tone-dark" : "v2-offer"} {...reveal(i * 90)}><p className="v2-kicker">{offer.kicker}</p><h3 className={i === 0 ? "display text-gold" : "display"}>{offer.title}</h3><p>{offer.body}</p>{i === 0 && <ButtonLink href={INQUIRY} tone="accent" className="pill mt-7">파일럿 신청 ↗</ButtonLink>}{i === 1 && <small>예: 학생 10명 이용 시 월 110,000원</small>}</div>)}</div><ol className="v2-start-steps">{["수업 환경 상담", "기관 개설 · 첫 반 준비", "4주 무료 파일럿", "계속 이용할지 결정"].map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol><p className="v2-caption mt-7">가맹 계약 없이 학생 수만큼 이용권을 구매합니다. 파일럿 종료 후 자동 결제되지 않습니다.</p></Container>
      </section>
  );
}
