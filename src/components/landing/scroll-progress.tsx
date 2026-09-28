"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  고정하지 않는 요소에 스크롤 진행도를 CSS 변수로 흘려보낸다.
    --p   요소 윗변이 화면 높이 from 에서 to 까지 올라오는 동안 0 → 1
    --pan 그 뒤로 요소 윗변이 to 에서 panTo 까지 더 올라오는 동안 0 → 1
  모양은 CSS 가 이 변수로 계산한다. React 상태를 쓰지 않고 변수만 바꾼다.

  변수는 스크립트가 처음 붙인다. CSS 기본값(var(--p, 1), var(--pan, 0))이 곧 정지 상태라,
  스크립트가 못 돌아도 그림은 온전히 보인다. (scroll-scene.tsx 와 같은 규칙)
*/
export function ScrollProgress({
  from = 1,
  to = 0.35,
  panTo = -0.25,
  className = "",
  children,
}: {
  /** 화면 높이에 대한 비율. 1 = 화면 맨 아래 */
  from?: number;
  to?: number;
  panTo?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      el.style.setProperty("--p", clamp((vh * from - top) / (vh * (from - to))).toFixed(3));
      el.style.setProperty("--pan", clamp((vh * to - top) / (vh * (to - panTo))).toFixed(3));
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
  }, [from, to, panTo]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
