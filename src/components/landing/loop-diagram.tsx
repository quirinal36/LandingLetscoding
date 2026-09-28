import type { CSSProperties } from "react";

/*
  라운지 운영 구조 — 세 축이 하나의 순환을 만든다.

    작품공유 ─(조회수 → 수익)─ 가상경제 ─(과제 완료 → 자산 증가)─ 과제관리 ─(주제선정 → 완료보고서)─ 작품공유

  원과 선은 SVG 로 그려 어느 폭에서도 비율을 지킨다. 연결 설명은 HTML 로 두어
  넓은 화면에서는 선 옆에 붙고, 좁은 화면에서는 그림 아래 목록으로 내려온다.
  선 위의 빛점은 양방향으로 흐르고, 원은 서로 다른 박자로 숨 쉰다. 동작은 CSS 로만 만든다.
*/

type Node = { key: string; title: string; sub: string; cx: number; cy: number };
type Link = { from: string; to: string; color: string; ink: string; title: string; body: string; place: string };

const R = 92;
const NODES: Node[] = [
  { key: "share", title: "작품공유", sub: "작품 게시 · 조회", cx: 500, cy: 140 },
  { key: "economy", title: "가상경제", sub: "자산 · 광고 · 투자", cx: 210, cy: 500 },
  { key: "task", title: "과제관리", sub: "주제선정 · 완료보고서", cx: 790, cy: 500 },
];
const LINKS: Link[] = [
  {
    from: "share",
    to: "economy",
    color: "#e0623b",
    ink: "#a8441b",
    title: "조회수 → 수익",
    body: "작품이 조회될수록 수익이 생기고, 광고하기·투자하기로 다시 작품에 돌아옵니다.",
    place: "md:right-[68%] md:top-[36%] md:text-right md:items-end",
  },
  {
    from: "share",
    to: "task",
    color: "#3b6fe0",
    ink: "#2a53b0",
    title: "주제선정 → 완료보고서",
    body: "과제에서 고른 주제가 작품이 되고, 작품이 완료보고서가 됩니다.",
    place: "md:left-[68%] md:top-[36%]",
  },
  {
    from: "economy",
    to: "task",
    color: "#12a58e",
    ink: "#0b7a69",
    title: "과제 완료 → 자산 증가",
    body: "과제를 끝내면 보상이 가상경제 자산으로 지급됩니다.",
    place: "md:left-1/2 md:top-[84%] md:w-[24%] md:-translate-x-1/2 md:text-center md:items-center",
  },
];

const byKey = Object.fromEntries(NODES.map((n) => [n.key, n]));

export function LoopDiagram() {
  return (
    <figure className="loop" data-reveal>
      <div className="relative">
        <svg viewBox="0 0 1000 640" className="mx-auto w-full max-w-[38rem] md:max-w-none" role="img" aria-labelledby="loop-title">
          <title id="loop-title">작품공유, 가상경제, 과제관리 세 축이 서로 연결되어 하나의 순환을 만드는 구조도</title>

          {LINKS.map((l, i) => {
            const a = byKey[l.from];
            const b = byKey[l.to];
            const length = Math.hypot(b.cx - a.cx, b.cy - a.cy);
            const angle = Math.atan2(b.cy - a.cy, b.cx - a.cx) * 180 / Math.PI;
            return (
              <g key={l.title} transform={`translate(${a.cx} ${a.cy}) rotate(${angle})`} style={{ color: l.color, "--i": i, "--travel": `${length}px` } as CSSProperties}>
                <line x2={length} stroke="currentColor" strokeWidth={18} strokeLinecap="round" pathLength={1} className="loop-draw" />
                <g className="loop-flow" aria-hidden="true">
                  {[1, -1].map((direction) => (
                    <g key={direction} className={`loop-particle${direction === -1 ? " loop-particle-back" : ""}`}>
                      <line x1={-direction * 34} x2={0} y1={direction * 7} y2={direction * 7} stroke="currentColor" strokeWidth={5} strokeLinecap="round" opacity={0.35} />
                      <circle cy={direction * 7} r={17} fill="currentColor" opacity={0.1} />
                      <circle cy={direction * 7} r={8} fill="#ffffff" stroke="currentColor" strokeWidth={3.5} />
                    </g>
                  ))}
                </g>
              </g>
            );
          })}

          {NODES.map((n, i) => (
            <g key={n.key} style={{ "--i": i } as CSSProperties}>
              <circle cx={n.cx} cy={n.cy} r={R} fill="none" stroke="#a8b7cf" strokeWidth={2} className="loop-halo" aria-hidden="true" />
              <circle cx={n.cx} cy={n.cy} r={R} fill="#ffffff" stroke="#d5dbe4" strokeWidth={3} className="loop-node" />
              <text x={n.cx} y={n.cy - 4} textAnchor="middle" className="[dominant-baseline:auto] max-md:translate-y-[12px]" fontSize={34} fontWeight={800} fill="#1b2333" letterSpacing="-0.02em">
                {n.title}
              </text>
              <text x={n.cx} y={n.cy + 30} textAnchor="middle" fontSize={17} fontWeight={500} fill="#55607a" className="hidden md:block">
                {n.sub}
              </text>
            </g>
          ))}
        </svg>

        <ul className="mt-8 grid gap-5 md:mt-0 md:contents">
          {LINKS.map((l) => (
            <li key={l.title} className={`flex flex-col gap-1 md:absolute md:w-[26%] ${l.place}`}>
              <span className="text-[1.125rem] font-bold tracking-[-0.02em] md:text-[1.25rem]" style={{ color: l.ink }}>
                {l.title}
              </span>
              <span className="text-[0.9375rem] leading-relaxed text-ink-soft">{l.body}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-x-6 text-[0.8125rem] text-ink-faint md:mt-4">
        <span>모든 연결은 양방향으로 순환합니다.</span>
        <label className="loop-toggle flex min-h-11 cursor-pointer items-center gap-2">
          <input type="checkbox" className="size-4 accent-[#3b6fe0]" />
          움직임 멈추기
        </label>
      </figcaption>
    </figure>
  );
}
