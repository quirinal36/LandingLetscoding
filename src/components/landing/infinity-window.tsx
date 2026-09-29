"use client";

import { useEffect, useId, useRef } from "react";

/*
  뚫린 무한대. 앞 레이어는 섹션의 검은 바탕이고, 누워 있는 8 모양으로만 구멍이 나 있다.
  구멍 너머로 수많은 캐릭터 사진이 보이고, 스크롤을 내리면 사진이 위에서 아래로 지나간다.

  진행도 p 는 이 요소가 화면 아래로 들어올 때 0, 화면 위로 나갈 때 1.
  --p 는 스크립트가 처음 붙인다. 스크립트가 못 돌아도 CSS 기본값(가운데)으로 사진이 보인다.
*/
/* 원 두 개(중심 165·435, 반지름 105)를 가운데서 교차하는 접선으로 잇는다 (viewBox 600×280) */
const PATH =
  "M246.6,205.9 L353.4,74.1 A105,105 0 1 1 353.4,205.9 L246.6,74.1 A105,105 0 1 0 246.6,205.9 Z";

/* 사진 한 장(16:9)의 높이. 네 장을 이어 창(280)보다 1072 긴 띠를 만든다 */
const TILE = 338;
const STRIP = [0, TILE, TILE * 2, TILE * 3];

export function InfinityWindow({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mask = `inf-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="infinity mx-auto w-full max-w-[52rem]" data-reveal="">
      <svg viewBox="0 0 600 280" className="w-full overflow-visible" role="img" aria-label="무한대 기호 너머로 보이는 수많은 캐릭터 피규어">
        <defs>
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="280">
            <path className="infinity-draw" d={PATH} pathLength={1} fill="none" stroke="#fff" strokeWidth="50" strokeLinecap="round" />
          </mask>
          <linearGradient id={`${mask}-rim`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffe7a3" />
            <stop offset="0.5" stopColor="#ffc857" />
            <stop offset="1" stopColor="#ff9f43" />
          </linearGradient>
        </defs>
        {/* 구멍의 가장자리 — 금빛 테두리 */}
        <path className="infinity-draw infinity-rim" d={PATH} pathLength={1} fill="none" stroke={`url(#${mask}-rim)`} strokeWidth="55" strokeLinecap="round" />
        <g mask={`url(#${mask})`}>
          <rect width="600" height="280" fill="#000" />
          {/* 사진을 세로로 이어 붙인 긴 띠. 한 장 걸러 뒤집어 이음매를 감춘다.
              스크롤에 따라 띠가 창 너머로 위에서 아래로 흘러간다 */}
          <g className="infinity-photo">
            {STRIP.map((y, i) => (
              <image key={y} href={src} x="0" y={y} width="600" height={TILE} preserveAspectRatio="xMidYMid slice" transform={i % 2 ? `matrix(1 0 0 -1 0 ${2 * y + TILE})` : undefined} />
            ))}
          </g>
          {/* 사진을 살짝 어둡게 — 앞의 금빛 테두리와 글이 먼저 보이도록 */}
          <rect width="600" height="280" fill="#000" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
