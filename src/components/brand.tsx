import Link from "next/link";
import { COMPANY } from "@/lib/nav";

/**
 * 마크는 실행 화살표다. 코드를 돌릴 때 누르는 바로 그 모양.
 * 면을 파거나 띄우지 않고, 옅은 포인트 색 사각형 위에 얹는다.
 */
export function Brand() {
  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} 홈`}
      className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
    >
      <span
        className="grid size-9 place-items-center rounded-[0.625rem] bg-accent-soft"
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" className="size-4" fill="none">
          <path
            d="M5.5 3.25 10.25 8 5.5 12.75"
            stroke="var(--color-accent)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">{COMPANY.short}</span>
    </Link>
  );
}
