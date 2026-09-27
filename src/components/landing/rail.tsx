"use client";

import { useRef, type ReactNode } from "react";

/*
  가로로 넘기는 하이라이트 (Apple 「하이라이트 살펴보기」 방식).
  손가락이나 트랙패드로 넘기고, 데스크톱에서는 아래 두 버튼으로도 넘긴다.
*/
export function Rail({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 360) + 20;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        aria-label={label}
        className="rail flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-68rem)/2))] pb-2 [scroll-padding-inline:max(1rem,calc((100vw-68rem)/2))]"
      >
        {children}
      </ul>
      <div className="mx-auto mt-6 flex max-w-[68rem] justify-end gap-3 px-4">
        <button type="button" onClick={() => move(-1)} aria-label="이전 하이라이트" className="control pill size-11 p-0">
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3 5 8l5 5" />
          </svg>
        </button>
        <button type="button" onClick={() => move(1)} aria-label="다음 하이라이트" className="control pill size-11 p-0">
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 3 5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
