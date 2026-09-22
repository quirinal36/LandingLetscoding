import { Button, ButtonLink, Dot } from "@/components/ui";

const TOKENS = [
  { name: "바탕", hex: "#E9EDF3", token: "bg", where: "페이지 배경" },
  { name: "올라온 면", hex: "#FFFFFF", token: "surface", where: "카드 · 메뉴 · 컨트롤" },
  { name: "들어간 면", hex: "#DDE3EC", token: "fill", where: "트랙 · 눌린 상태" },
  { name: "글자", hex: "#1B2333", token: "ink", where: "본문 · 13.4:1" },
  { name: "선", hex: "#D5DBE4", token: "separator", where: "구분선 · 떠 있는 면의 테두리" },
  { name: "컨트롤 경계", hex: "#7C8699", token: "edge", where: "누를 수 있는 것 · 3.1:1" },
  { name: "포인트", hex: "#3B6FE0", token: "accent", where: "전환 동선 · 현재 위치" },
];

const LAYERS = [
  { name: "바탕", cls: "bg-fill", note: "가장 아래" },
  { name: "카드", cls: "card", note: "흰 면이 곧 올라온 것" },
  { name: "트랙", cls: "track", note: "눌러 넣은 자리" },
  { name: "떠 있는 면", cls: "floating", note: "반투명 + 블러" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 first:mt-0">
      <h2 className="hairline border-b pb-2.5 text-lg font-semibold tracking-[-0.02em]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">
        랜딩 페이지 본문은 다음 기획에서 붙입니다. 이 화면은 지금까지 정한 테마와 메뉴를 그대로
        눌러보기 위한 것입니다.
      </p>

      <Section title="깊이를 만드는 법">
        <p className="mb-6 max-w-[58ch] leading-relaxed text-ink-soft">
          이 화면에는 그림자가 한 개도 없습니다. 깊이는 세 가지로만 만듭니다 — 면의 밝기 단계(회색
          바탕 위의 흰 면이 곧 올라온 것), 1px 헤어라인, 그리고 떠 있는 것의 반투명 블러. 메뉴를
          열어 보시면 아래 글자가 비치는 걸 보실 수 있습니다.
        </p>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {LAYERS.map((l) => (
            <li key={l.name}>
              <div className={`${l.cls} grid h-20 place-items-center rounded-[1.125rem]`}>
                <span className="text-[0.8125rem] text-ink-soft">{l.name}</span>
              </div>
              <p className="mt-2 text-[0.75rem] text-ink-faint">{l.note}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="색">
        <ul className="grid gap-3 sm:grid-cols-2">
          {TOKENS.map((t) => (
            <li key={t.token} className="card flex items-center gap-4 p-3">
              <span
                className="hairline size-11 shrink-0 rounded-[0.625rem] border"
                style={{ background: t.hex }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block font-medium">{t.name}</span>
                <span className="block text-[0.8125rem] text-ink-soft">{t.where}</span>
                <span className="mt-0.5 block font-mono text-[0.6875rem] text-ink-faint">
                  {t.hex.toLowerCase()} · --color-{t.token}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="누를 수 있는 것">
        <p className="mb-6 max-w-[58ch] leading-relaxed text-ink-soft">
          그림자가 없으니 경계는 헤어라인이 맡습니다. 컨트롤에만 긋고 카드에는 긋지 않습니다 —
          선이 곧 &ldquo;누를 수 있음&rdquo;의 신호여야 구분이 섭니다. 누르면 면이 한 단계
          어두워집니다.
        </p>
        <div className="flex flex-wrap items-start gap-3">
          <ButtonLink href="/about" size="md">
            회사 소개
          </ButtonLink>
          <ButtonLink href="/seminar/inquiry" tone="accent" size="md">
            도입문의
          </ButtonLink>
          <Button size="md" data-pressed="true">
            눌린 상태
          </Button>
          <Button size="md" disabled>
            비활성
          </Button>
          <Button size="lg">큰 버튼</Button>
        </div>
      </Section>

      <Section title="현재 위치">
        <p className="mb-6 max-w-[58ch] leading-relaxed text-ink-soft">
          파란 점은 지금 보고 있는 페이지 하나에만 켜집니다.
        </p>
        <div className="track inline-flex items-center gap-7 px-6 py-4">
          <span className="flex items-center gap-2.5 text-sm">
            <Dot on={true} /> 켜짐
          </span>
          <span className="flex items-center gap-2.5 text-sm">
            <Dot on={false} /> 꺼짐
          </span>
        </div>
      </Section>

      <Section title="글자">
        <p className="mb-6 max-w-[58ch] leading-relaxed text-ink-soft">
          Pretendard 한 가족으로 제목부터 본문까지 씁니다. Apple SD Gothic Neo와 같은 메트릭으로
          설계된 서체라, 지금 화면이 기대는 Apple식 여백과 자간이 그대로 들어맞습니다. 45부터
          920까지 이어지는 가변축이라 굵기를 원하는 지점에 세울 수 있습니다. 장식이 없는
          화면일수록 위계를 글자가 짊어지므로, 크기와 굵기의 간격을 넉넉하게 벌립니다.
        </p>
        <div className="card p-6 md:p-8">
          <p className="text-[2.75rem] leading-[1.12] font-semibold tracking-[-0.035em]">
            코딩을 가르치는 곳
          </p>
          <p className="mt-3 text-xl font-medium tracking-[-0.015em] text-ink-soft">
            교육기관을 위한 솔루션
          </p>
          <p className="mt-6 max-w-[46ch] leading-[1.75]">
            렛츠코딩은 교육기관이 코딩 수업을 직접 운영할 수 있도록 커리큘럼과 학습 공간, 운영
            도구를 함께 제공합니다.
          </p>
          <ul className="hairline mt-7 grid gap-1.5 border-t pt-6">
            {[300, 400, 500, 600, 700, 800].map((w) => (
              <li key={w} className="flex items-baseline gap-4">
                <span className="w-10 shrink-0 font-mono text-[0.6875rem] text-ink-faint">{w}</span>
                <span className="text-lg tracking-[-0.01em]" style={{ fontWeight: w }}>
                  코딩을 가르치는 곳 · Letscoding
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
}
