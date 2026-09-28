import type { Metadata } from "next";
import { OfferCards, Section, Steps } from "@/components/product";
import { CONTACT } from "@/lib/offer";

export const metadata: Metadata = {
  title: "도입문의 · 4주 무료 파일럿 신청",
  description: "렛츠코딩 라운지 4주 무료 파일럿은 전화나 이메일로 신청합니다. 첫 반 하나로 시작하고, 학생 1명 월 11,000원(부가세 포함)입니다.",
};

const TEL_HREF = `tel:${CONTACT.tel.replaceAll("-", "")}`;

/** 상담부터 결정까지. 홈의 도입 조건(START)과 같은 사실만 쓴다. */
const STEPS = [
  { t: "상담", d: "전화나 이메일로 연락 주시면 학원 상황을 듣고 첫 반을 함께 정합니다." },
  { t: "4주 파일럿", d: "첫 반 하나로 무료로 써 봅니다. 첫 수업은 렛츠코딩 팀이 함께 코칭합니다." },
  { t: "계속 쓸지 결정", d: "우리 학원에 맞으면 학생 1명 월 11,000원(부가세 포함)으로 이어 갑니다." },
];

const ASK = ["학원 이름과 지역", "첫 반의 학생 수와 학년", "지금 하고 있는 코딩 수업(있다면)"];

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="text-3xl font-semibold tracking-[-0.025em] md:text-4xl">도입문의</h1>
      <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-soft">
        4주 무료 파일럿은 전화나 이메일로 신청합니다. 첫 반 하나로 시작하면 됩니다.
      </p>
      <p className="mt-2 text-[0.9375rem] text-ink-soft">렛츠코딩 파이썬 14일 무료체험도 같은 곳으로 문의해 주세요.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href={TEL_HREF} className="card block p-7 transition-transform hover:-translate-y-0.5">
          <span className="text-sm font-semibold text-accent-ink">전화</span>
          <span className="mt-2 block text-2xl font-semibold">{CONTACT.tel}</span>
          <span className="mt-2 block text-sm text-ink-soft">바로 통화하고 싶으실 때</span>
        </a>
        <a href={`mailto:${CONTACT.email}`} className="card block p-7 transition-transform hover:-translate-y-0.5">
          <span className="text-sm font-semibold text-accent-ink">이메일</span>
          <span className="mt-2 block text-2xl font-semibold break-all">{CONTACT.email}</span>
          <span className="mt-2 block text-sm text-ink-soft">자료를 먼저 받아 보고 싶으실 때</span>
        </a>
      </div>

      <Section title="도입은 이렇게 진행됩니다">
        <Steps items={STEPS} />
      </Section>

      <Section title="도입 조건">
        <OfferCards />
      </Section>

      <Section title="상담 때 알려 주시면 빨라요">
        <ul className="grid gap-2 leading-relaxed text-ink-soft">
          {ASK.map((a) => (
            <li key={a} className="flex gap-2">
              <span aria-hidden="true">·</span>
              {a}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
