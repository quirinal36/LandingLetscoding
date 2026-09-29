import type { CSSProperties, ReactNode } from "react";

/* 랜딩·브랜드 스토리·교육 철학이 같이 쓰는 섹션 조각. [data-reveal] 은 RevealObserver 가 페이지에 하나 있어야 움직인다. */

export const reveal = (d = 0) => ({ "data-reveal": "", style: { "--d": d } as CSSProperties });
export const intro = (d = 0) => ({ style: { "--d": d } as CSSProperties });

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-[68rem] px-4 md:px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[1.0625rem] font-semibold text-accent-ink md:text-xl">{children}</p>;
}
