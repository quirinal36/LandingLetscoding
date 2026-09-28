import type { ReactNode } from "react";
import { START } from "@/lib/offer";

/* 솔루션·도입문의 같은 문서형 페이지가 같이 쓰는 조각. 홈의 장면형 레이아웃과 달리 읽히는 게 먼저다. */

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export type Qa = { q: string; a: string };

/** 화면의 FAQ와 FAQPage JSON-LD를 같은 목록에서 만든다. 답을 고치면 둘이 같이 바뀐다. */
export function Faq({ items }: { items: Qa[] }) {
  return (
    <Section title="자주 묻는 질문">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }}
      />
      <div className="grid gap-3">
        {items.map(({ q, a }) => (
          <details key={q} className="card group p-5">
            <summary className="cursor-pointer list-none font-semibold marker:hidden">
              <span className="mr-2 text-accent-ink">Q.</span>
              {q}
            </summary>
            <p className="mt-3 leading-relaxed text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function Steps({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="grid gap-3">
      {items.map((s, i) => (
        <li key={s.t} className="card flex items-start gap-4 p-5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1b2333] text-sm font-semibold text-white">{i + 1}</span>
          <span>
            <span className="block font-semibold">{s.t}</span>
            <span className="mt-1 block leading-relaxed text-ink-soft">{s.d}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Features({ items }: { items: { t: string; d: string[] }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((f) => (
        <div key={f.t} className="card p-6">
          <h3 className="font-semibold">{f.t}</h3>
          <ul className="mt-3 grid gap-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            {f.d.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true">·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** 홈의 도입 조건(START)을 카드로. 도입문의·라운지가 같이 쓴다. */
export function OfferCards() {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {START.map((s) => (
        <div key={s.kicker} className="card p-5">
          <dt className="text-sm font-semibold text-accent-ink">{s.kicker}</dt>
          <dd className="mt-1 text-lg font-semibold whitespace-pre-line">{s.title}</dd>
          <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</dd>
        </div>
      ))}
    </dl>
  );
}
