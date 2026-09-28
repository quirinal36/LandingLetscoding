"use client";

import { useEffect, useRef } from "react";

/*
  라운지 확장 모델 도식을 스크롤로 재생한다. (lounge-model.tsx 안에 하나 둔다)

  - 칸마다 --p(0→1): 칸의 윗변이 화면 높이 92%에서 52%까지 올라오는 동안 차오른다.
  - 도식 전체에 --axis: 네 칸 --p 의 평균. 왼쪽 축이 위에서 아래로 그어진다.
  모양은 landing.css 「라운지 확장 모델」이 이 변수로 계산한다. React 상태를 쓰지 않고 변수만 바꾼다.

  변수는 스크립트가 처음 붙인다. CSS 기본값 var(--p, 1) 이 곧 다 그려진 상태라,
  스크립트가 못 돌아도 도식이 온전히 보인다. (scroll-scene.tsx 와 같은 규칙)
*/
export function LoungeModelScrub() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fig = ref.current?.closest<HTMLElement>(".lounge-model");
    if (!fig) return;
    const tiers = Array.from(fig.querySelectorAll<HTMLElement>("[data-lm-tier]"));
    const boxes = tiers.map((t) => t.querySelector<HTMLElement>(".lm-tier") ?? t);
    if (!tiers.length) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      let sum = 0;
      tiers.forEach((t, i) => {
        const top = boxes[i].getBoundingClientRect().top;
        const p = clamp((vh * 0.92 - top) / (vh * 0.4));
        t.style.setProperty("--p", p.toFixed(3));
        sum += p;
      });
      fig.style.setProperty("--axis", (sum / tiers.length).toFixed(3));
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

  return <span ref={ref} hidden />;
}
