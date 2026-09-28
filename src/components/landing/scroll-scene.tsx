"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/*
  고정 장면. 높이가 긴 구간(length × 화면 높이) 동안 안쪽이 화면에 붙어 있고,
  그 사이 스크롤 진행도 p(0→1)를 CSS 변수 --p 로 흘려보낸다.

  mode="timeline" 이면 안쪽 CSS 애니메이션 전부를 멈추고, 재생 위치를 p × duration 에 맞춘다.
  시간으로 짠 장면(StoryGraph)을 그대로 스크롤로 되감고 감을 수 있다.

  동작 줄이기 설정에서도 스크럽은 계속한다. 스크롤이 곧 재생 막대라 저절로 움직이는 것이 없고,
  어지러운 이동·블러·튕김은 CSS(landing.css 「동작 줄이기」)가 걷어 내어 밝기 변화만 남긴다.
  React 상태를 쓰지 않는다. 스크롤마다 다시 그리지 않고 변수 하나만 바꾼다.

  --p 는 마크업에 심지 않고 스크립트가 처음 붙인다. CSS 의 var(--p, 1) 기본값이 곧 마지막 상태라,
  스크립트가 못 돌아도(오류·차단·구형 브라우저) 다 읽히는 화면이 남는다. 0으로 심으면 영원히 흐린 채 멈춘다.
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
    const anims = mode === "timeline" && typeof el.getAnimations === "function" ? el.getAnimations({ subtree: true }) : [];
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
      style={{ height: `${length * 100}svh` } as CSSProperties}
    >
      <div className={`scene-pin ${pinClassName}`}>{children}</div>
    </section>
  );
}
