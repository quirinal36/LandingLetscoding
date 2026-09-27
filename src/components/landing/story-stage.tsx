import Image from "next/image";
import type { ReactNode } from "react";
import { BOUNCE, EI, EO, Frame, STORY_T, fadeUp, kf, run } from "@/components/landing/timeline";

/*
  이야기 무대 — MYPROBLEM.md 2번(문제)과 6번(천장)을 진짜 카드로 보여 준다.
  설계 원문은 HERO-MOTION-PLAN.md. 이 파일은 그 타임라인을 선 대신 물건으로 그린 것이다.

  0.0–5.6  교구 상자 셋이 차례로 떠올라 유리 천장에 부딪히고 떨어진다. 떨어진 상자는 회색으로 남는다.
  5.6–6.4  바닥에 "2026.1 바이브코딩" 눈금이 박힌다.
  6.4–10.4 학생 작품 카드가 오른쪽에서 날아와 한 장씩 쌓인다. 카드마다 그때 필요해진 기술 칩이 붙는다.
  9.3      넷째 카드가 천장을 지나는 순간 천장이 갈라지며 번쩍인다.
  10.6     탑 꼭대기에 파란 점선 빈 칸이 열린다. 다음 칸은 원장님 학원.

  모든 위치는 무대(4:3)의 % 좌표다. translateY 는 요소 자신의 높이 기준이라
  아래 상수로 무대 높이와 맞춰 둔다.
*/

const CEIL_FROM_BOTTOM = 52; // 천장 높이 (무대 높이의 %)

// 교구 상자
const KITS = [
  { name: "로봇 A", x: 7, tilt: -7 },
  { name: "로봇 B", x: 21, tilt: 5 },
  { name: "새 교구", x: 35, tilt: -3 },
];
const KIT_H = 18; // 상자 높이 (무대 %)
const KIT_BOTTOM = 10;
const KIT_RISE = ((CEIL_FROM_BOTTOM - KIT_BOTTOM - KIT_H) / KIT_H) * 100; // 자기 높이의 %
const KIT_START = [1.0, 2.5, 4.0];
const RISE = 1.0;
const DROP = 0.3;
const kitHold = (i: number) => (i === 2 ? 0.5 : 0.1);

// 작품 카드 탑
const CARD_H = 13; // 카드 높이 (무대 %)
const CARD_GAP = 1.5;
const TOWER_BOTTOM = 6;
const TOWER_X = 60; // 카드 왼쪽 (무대 너비 %)
const CARDS = [
  { slug: "ten-pang", title: "텐팡", skill: "첫 작품", dx: 0 },
  { slug: "memory", title: "메모리 메모리", skill: "로그인", dx: 3 },
  { slug: "pycamp", title: "파이썬 훈련소", skill: "DB", dx: -2 },
  { slug: "translator", title: "영한 번역기", skill: "API", dx: 2 },
  { slug: "letscoding-village", title: "렛츠코딩 빌리지", skill: "내 문제", dx: -1 },
];
const STACK_START = 6.6;
const STEP = 0.8;
const cardStart = (i: number) => STACK_START + STEP * i;
const LAND = 0.45;
const BREAK_AT = cardStart(3) + LAND - 0.1; // 넷째 카드가 천장을 지나는 순간
const TICK_AT = 6.0;
const NEXT_AT = 10.6;
const CEIL_LABEL_AT = KIT_START[2] + RISE;

const cardBottom = (i: number) => TOWER_BOTTOM + i * (CARD_H + CARD_GAP);

// ── 기술 칩 아이콘 ────────────────────────────────────────────────
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ICONS: Record<string, ReactNode> = {
  "첫 작품": (
    <Icon>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 8.5h18M10.5 11.5v5l4-2.5z" />
    </Icon>
  ),
  로그인: (
    <Icon>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5" />
    </Icon>
  ),
  DB: (
    <Icon>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6v12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" />
    </Icon>
  ),
  API: (
    <Icon>
      <path d="M4 8h15M16 5l3 3-3 3M20 16H5M8 13l-3 3 3 3" />
    </Icon>
  ),
  "내 문제": (
    <Icon>
      <path d="M6 21V3.5M6 4h11l-2.5 4 2.5 4H6" />
    </Icon>
  ),
};

function RobotIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-[46%]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="10" y="16" width="28" height="22" rx="5" />
      <path d="M24 16v-5M20 8h8M4 24v8M44 24v8" />
      <circle cx="18" cy="26" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="30" cy="26" r="2.5" fill="currentColor" stroke="none" />
      <path d="M18 33h12" />
    </svg>
  );
}

// ── 자막 ──────────────────────────────────────────────────────────
const CAPTIONS: { from: number; to: number; kicker: string; title: string; tone?: "glow" }[] = [
  { from: 0, to: 2.45, kicker: "2019 · 프랜차이즈 교구", title: "로봇 A.\n6개월이면 끝." },
  { from: 2.45, to: 3.95, kicker: "새 교구를 들였습니다", title: "로봇 B.\n다시 처음부터." },
  { from: 3.95, to: 5.9, kicker: "학생은 자랐는데", title: "새 교구.\n또 초보 단계." },
  { from: 5.9, to: 7.9, kicker: "2026년 1월", title: "학생들과\n바이브코딩을 시작." },
  { from: 7.9, to: 9.7, kicker: "만들수록 필요한 기술이 생깁니다", title: "천장을\n뚫었습니다.", tone: "glow" },
  { from: 9.7, to: 11.0, kicker: "마지막 칸", title: "학생이 가져온\n자기 문제." },
  { from: 11.0, to: STORY_T, kicker: "그리고", title: "다음 칸은,\n원장님 학원에서.", tone: "glow" },
];

export function StoryCaptions() {
  const css = CAPTIONS.map((c, i) => {
    const last = i === CAPTIONS.length - 1;
    const frames: Frame[] = [
      [c.from, "opacity:0;transform:translateY(24px);filter:blur(8px)", EO],
      [c.from + 0.35, "opacity:1;transform:none;filter:blur(0)"],
    ];
    if (!last)
      frames.push(
        [c.to - 0.3, "opacity:1;transform:none;filter:blur(0)", EO],
        [c.to, "opacity:0;transform:translateY(-24px);filter:blur(8px)"],
      );
    return kf(`st-cap-${i}`, frames);
  });
  return (
    <div className="story-captions relative min-h-[9.5rem] md:min-h-[15rem]">
      <style dangerouslySetInnerHTML={{ __html: css.join("\n") }} />
      {CAPTIONS.map((c, i) => {
        const last = i === CAPTIONS.length - 1;
        return (
          <div key={c.title} className="story-caption absolute inset-x-0 top-0" style={{ ...run(`st-cap-${i}`), opacity: last ? 1 : 0 }} aria-hidden={last ? undefined : true}>
            <p className="text-[0.9375rem] font-semibold text-accent-ink md:text-lg">{c.kicker}</p>
            <p className={`display mt-2 text-[2.25rem] whitespace-pre-line md:text-[3.75rem] ${c.tone === "glow" ? "text-glow" : "text-metal"}`}>{c.title}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── 무대 ──────────────────────────────────────────────────────────
const CEIL_LABEL = "초보 단계 천장";

export function StoryStage() {
  const css: string[] = [];

  // 교구 상자: 떠오름 → 천장에 부딪혀 찌그러짐 → 떨어져 회색으로
  KITS.forEach((k, i) => {
    const r0 = KIT_START[i];
    const top = r0 + RISE;
    const drop = top + kitHold(i);
    const up = `translateY(${-KIT_RISE}%)`;
    css.push(
      kf(`st-kit-${i}`, [
        [r0 - 0.2, "opacity:0;transform:translateY(20%) scale(0.9)", EO],
        [r0, "opacity:1;transform:translateY(0) scale(1)", EO],
        [top, `opacity:1;transform:${up} scale(1)`, EO],
        [top + 0.12, `opacity:1;transform:${up} scale(1.08,0.88)`, EO],
        [drop, `opacity:1;transform:${up} scale(1)`, EI],
        [drop + DROP, `opacity:1;transform:translateY(0) rotate(${k.tilt}deg)`],
      ]),
      kf(`st-kit-skin-${i}`, [
        [drop + DROP, "filter:grayscale(0) brightness(1)", EO],
        [drop + DROP + 0.5, "filter:grayscale(1) brightness(0.55)"],
      ]),
      fadeUp(`st-kit-label-${i}`, r0),
    );
  });

  // 천장: 라벨 타이핑, 셋째 카드가 닿을 때 갈라짐
  [...CEIL_LABEL].forEach((_, j) => {
    const t = CEIL_LABEL_AT + 0.06 * j;
    css.push(
      kf(`st-type-${j}`, [
        [t, "opacity:0", "step-end"],
        [t + 0.02, "opacity:1"],
      ]),
    );
  });
  css.push(
    kf("st-ceil-l", [
      [BREAK_AT, "transform:none", EO],
      [BREAK_AT + 0.5, "transform:translate(-4%, -6px) rotate(-2.5deg)"],
    ]),
    kf("st-ceil-r", [
      [BREAK_AT, "transform:none", EO],
      [BREAK_AT + 0.5, "transform:translate(4%, 6px) rotate(2.5deg)"],
    ]),
    kf("st-flash", [
      [BREAK_AT, "opacity:0;transform:scale(0.6)", EO],
      [BREAK_AT + 0.12, "opacity:1;transform:scale(1.1)", EO],
      [BREAK_AT + 0.9, "opacity:0;transform:scale(1.6)"],
    ]),
    kf("st-ceil-dim", [
      [BREAK_AT, "opacity:1", EO],
      [BREAK_AT + 0.8, "opacity:0.35"],
    ]),
    kf("st-strike", [
      [BREAK_AT + 0.2, "transform:scaleX(0)", EO],
      [BREAK_AT + 0.7, "transform:scaleX(1)"],
    ]),
    kf("st-tick", [
      [TICK_AT, "opacity:0;transform:scaleY(0)", EO],
      [TICK_AT + 0.4, "opacity:1;transform:scaleY(1)"],
    ]),
    fadeUp("st-tick-label", TICK_AT + 0.15),
    kf("st-next", [
      [NEXT_AT, "opacity:0;transform:translateY(30%) scale(0.9)", BOUNCE],
      [NEXT_AT + 0.6, "opacity:1;transform:none"],
    ]),
  );

  // 작품 카드: 오른쪽 위에서 날아와 살짝 넘쳤다가 자리에 앉는다
  CARDS.forEach((_, i) => {
    const s0 = cardStart(i);
    css.push(
      kf(`st-card-${i}`, [
        [s0, "opacity:0;transform:translate(70%, -60%) rotate(8deg) scale(0.85)", BOUNCE],
        [s0 + LAND, "opacity:1;transform:none"],
      ]),
      fadeUp(`st-chip-${i}`, s0 + LAND + 0.05, 0.3, "translateX(-8px) scale(0.9)"),
    );
  });

  const ceilTop = 100 - CEIL_FROM_BOTTOM;

  return (
    <div
      className="story-stage relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-[#0b0d14]"
      role="img"
      aria-label="같은 학생의 7년. 로봇 A, 로봇 B, 새 교구를 들일 때마다 초보 단계라는 유리 천장에 부딪혀 떨어지고, 떨어진 교구는 회색으로 쌓인다. 2026년 1월 바이브코딩을 시작한 뒤로는 학생이 만든 작품 카드가 첫 작품, 로그인, DB, API, 내 문제 순서로 탑처럼 쌓이며 그 천장을 깨고 올라간다. 탑 꼭대기에 다음 칸이 비어 있다."
    >
      <style dangerouslySetInnerHTML={{ __html: css.join("\n") }} />

      {/* 바탕 모눈 */}
      <div className="stage-grid absolute inset-0" aria-hidden="true" />

      {/* 바닥 */}
      <div className="absolute inset-x-[4%] bottom-[5.5%] h-px bg-white/15" aria-hidden="true" />

      {/* 2026.1 눈금 */}
      <div className="absolute bottom-[5.5%] left-[54%] w-px origin-bottom bg-accent-ink/60" style={{ height: `${CEIL_FROM_BOTTOM + 30}%`, ...run("st-tick") }} aria-hidden="true" />
      <p className="absolute bottom-[1%] left-[54%] translate-x-2 text-[0.6875rem] font-semibold text-accent-ink md:text-xs" style={run("st-tick-label")} aria-hidden="true">
        2026.1 바이브코딩 시작
      </p>

      {/* 유리 천장 */}
      <div className="absolute inset-x-[4%]" style={{ top: `${ceilTop}%` }} aria-hidden="true">
        <p className="absolute -top-6 left-0 flex text-[0.6875rem] font-semibold tracking-wide text-white/60 md:text-xs">
          <span className="relative">
            {[...CEIL_LABEL].map((c, j) => (
              <span key={j} style={run(`st-type-${j}`)}>
                {c === " " ? " " : c}
              </span>
            ))}
            <span className="absolute inset-x-0 top-1/2 h-px origin-left bg-[#ffb454]" style={run("st-strike")} />
          </span>
        </p>
        <div className="relative h-2.5" style={run("st-ceil-dim")}>
          <div className="ceiling absolute inset-y-0 left-0 w-[52%] origin-right" style={run("st-ceil-l")} />
          <div className="ceiling absolute inset-y-0 right-0 w-[46%] origin-left" style={run("st-ceil-r")} />
        </div>
        {/* 번쩍 */}
        <div className="flash absolute top-1/2 left-[62%] size-[28%] -translate-x-1/2 -translate-y-1/2" style={{ ...run("st-flash"), opacity: 0 }} />
      </div>

      {/* 교구 상자 */}
      {KITS.map((k, i) => (
        <div key={k.name} className="absolute" style={{ left: `${k.x}%`, bottom: `${KIT_BOTTOM}%`, width: "11%", height: `${KIT_H}%` }} aria-hidden="true">
          <div className="size-full" style={run(`st-kit-${i}`)}>
            <div className="kit grid size-full place-items-center" style={run(`st-kit-skin-${i}`)}>
              <RobotIcon />
            </div>
          </div>
          <p className="absolute top-full left-1/2 mt-2 -translate-x-1/2 text-[0.6875rem] whitespace-nowrap text-white/55 md:text-xs" style={run(`st-kit-label-${i}`)}>
            {k.name}
          </p>
        </div>
      ))}

      {/* 작품 카드 탑 */}
      {CARDS.map((c, i) => (
        <div
          key={c.slug}
          className="absolute"
          style={{ left: `${TOWER_X + c.dx}%`, bottom: `${cardBottom(i)}%`, height: `${CARD_H}%`, aspectRatio: "16 / 9" }}
          aria-hidden="true"
        >
          <div className="relative size-full" style={run(`st-card-${i}`)}>
            <div className="work-card relative size-full overflow-hidden rounded-[10px] md:rounded-[14px]">
              <Image src={`/landing/works/${c.slug}.webp`} alt="" fill sizes="220px" className="object-cover" />
            </div>
            <span className="skill-chip absolute top-1/2 right-full mr-2 flex -translate-y-1/2 items-center gap-1 whitespace-nowrap" style={run(`st-chip-${i}`)}>
              {ICONS[c.skill]}
              {c.skill}
            </span>
          </div>
        </div>
      ))}

      {/* 다음 칸 */}
      <a
        href="/seminar/inquiry"
        className="next-slot absolute grid place-items-center text-accent-ink"
        style={{ left: `${TOWER_X}%`, bottom: `${cardBottom(CARDS.length)}%`, height: `${CARD_H}%`, aspectRatio: "16 / 9", ...run("st-next") }}
        aria-label="다음 칸은 원장님 학원에서. 도입 문의로 이동"
      >
        <span className="text-2xl leading-none font-light md:text-3xl">+</span>
      </a>
    </div>
  );
}
