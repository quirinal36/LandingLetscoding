"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/*
  고정 장면. 높이가 긴 구간(length × 화면 높이) 동안 안쪽이 화면에 붙어 있고,
  그 사이 스크롤 진행도 p(0→1)를 CSS 변수 --p 로 흘려보낸다.

  mode="timeline" 이면 안쪽 CSS 애니메이션 전부를 멈추고, 재생 위치를 p × duration 에 맞춘다.
  시간으로 짠 장면(StoryGraph)을 그대로 스크롤로 되감고 감을 수 있다.

  동작 줄이기 설정이면 아무것도 하지 않는다. CSS가 고정을 풀고 마지막 상태를 보여 준다.
  React 상태를 쓰지 않는다. 스크롤마다 다시 그리지 않고 변수 하나만 바꾼다.
*/
export function ScrollScene({
  length,
  mode = "var",
  duration = 0,
  className = "",
  pinClassName = "",
  children,
}: {
  /** 장면 전체 높이. 화면 높이의 몇 배인가 */
  length: number;
  mode?: "var" | "timeline";
  /** mode="timeline" 일 때 안쪽 애니메이션 길이(초) */
  duration?: number;
  className?: string;
  pinClassName?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anims = mode === "timeline" ? el.getAnimations({ subtree: true }) : [];
    anims.forEach((a) => a.pause());

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 1;
      el.style.setProperty("--p", p.toFixed(4));
      if (anims.length) {
        const t = p * duration * 1000;
        for (const a of anims) a.currentTime = t;
      }
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
  }, [mode, duration]);

  return (
    <section
      ref={root}
      className={`scene ${className}`}
      style={{ height: `${length * 100}svh`, "--p": 0 } as CSSProperties}
    >
      <div className={`scene-pin ${pinClassName}`}>{children}</div>
    </section>
  );
}
