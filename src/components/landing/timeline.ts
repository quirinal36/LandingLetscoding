import type { CSSProperties } from "react";

/*
  스크롤로 되감는 장면의 공통 도구.
  모든 요소가 하나의 타임라인(STORY_T초) 위에 자기 keyframes 를 갖고,
  ScrollScene(mode="timeline") 이 재생 위치를 스크롤로 맞춘다.

  규칙: 요소의 기본 스타일이 곧 마지막 프레임이다. keyframes 는 "그 전"만 만든다.
  그래서 동작 줄이기 설정에서 애니메이션을 끄면 정보가 다 모인 화면이 남는다.
*/

export const STORY_T = 14;

export const EO = "cubic-bezier(0.32, 0.72, 0.35, 1)"; // 도착
export const EI = "cubic-bezier(0.55, 0, 0.9, 0.4)"; // 떨어짐
export const BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // 살짝 넘쳤다 돌아옴

export type Frame = [time: number, css: string, easeToNext?: string];

const pct = (t: number, total: number) => `${Number(((t / total) * 100).toFixed(3))}%`;

/** total: 이 장면 타임라인의 전체 길이(초). 기본은 이야기 장면의 STORY_T */
export function kf(name: string, frames: Frame[], total = STORY_T) {
  const first = frames[0];
  const last = frames[frames.length - 1];
  const all: Frame[] = [[0, first[1]], ...frames, [total, last[1]]];
  const body = all
    .map(([t, css, ease]) => `${pct(t, total)}{${css}${ease ? `;animation-timing-function:${ease}` : ""}}`)
    .join("");
  return `@keyframes ${name}{${body}}`;
}

export const run = (name: string, total = STORY_T): CSSProperties => ({ animation: `${name} ${total}s linear both` });

export const fadeUp = (name: string, t0: number, d = 0.35, from = "translateY(14px)") =>
  kf(name, [
    [t0, `opacity:0;transform:${from}`, EO],
    [t0 + d, "opacity:1;transform:none"],
  ]);
