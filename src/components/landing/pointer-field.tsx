"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  포인터 자리를 CSS 변수로 흘려보내는 그릇.
  --mx, --my 가 -1 ~ 1 사이 값을 갖고, 안쪽 CSS 가 그 값으로 기울기와 시차를 만든다.
  React 상태를 쓰지 않는다. 움직임마다 다시 그리지 않고 변수 둘만 바꾼다.
  포인터가 나가면 천천히 가운데로 돌아온다. 터치 기기와 동작 줄이기 설정에서는 아무것도 하지 않는다.
*/
export function PointerField({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.setProperty("--mx", current.x.toFixed(4));
      el.style.setProperty("--my", current.y.toFixed(4));
      const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
      kick();
    };
    const onLeave = () => {
      target = { x: 0, y: 0 };
      kick();
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ "--mx": 0, "--my": 0 } as React.CSSProperties}>
      {children}
    </div>
  );
}
