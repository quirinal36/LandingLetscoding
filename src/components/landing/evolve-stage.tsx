import Image from "next/image";
import type { CSSProperties } from "react";
import { BOUNCE, EO, Frame, kf, run } from "@/components/landing/timeline";

/*
  진화 장면 — 랜딩 3번. 교구는 진화할 때마다 아기로 돌아오고, 학생만 자란다. (EVOLVE-SCENE-PLAN.md)
  박자와 배율은 prototypes/evolve/evolve.html 에서 맞춘 값을 그대로 옮겼다.

  0.0–0.8   초2 학생이 아기 로봇을 두 손으로 받쳐 들고 선다.
  1.4–2.9   진화 1: 로봇이 검은 실루엣으로 2.6배 부풀고 뿔·날개가 솟는다 → 번쩍 → 펑, 같은 아기. 이름표만 로봇 B.
  3.4–3.9   학생만 조용히 자란다. 초4.
  4.3–5.8   진화 2 (3.2배) → 새 교구.
  6.3–6.8   초6.
  7.2–8.9   진화 3 (3.8배, 꼬리까지) → 또 새 교구.
  9.2–11    펀치라인. 아무것도 움직이지 않는다.

  한 순간에 움직이는 것은 하나다. 로봇이 요란할 때 학생은 가만히 있고, 학생이 자랄 때 로봇은 손을 따라 올라갈 뿐이다.
  두 목소리: 왼쪽 자막은 원장 목소리(존댓말), 무대 아래 메시지 박스는 게임 목소리(반말).

  기본 스타일 = 마지막 프레임(timeline.ts 규칙): 초6 + 아기 로봇 + Lv.6 / Lv.1 + 마지막 자막.
  동작 줄이기: .calm-* 가 transform 을 걷어 내므로 부풀기는 검게 변했다 돌아오는 것, 성장은 교차 페이드만 남는다.
  로봇 자리는 transform 이 아니라 bottom 으로 옮기므로 동작 줄이기에서도 손을 따라간다.

  그림: public/landing/evolve (prototypes/evolve/cut.mjs 로 자른 것). 그림을 바꾸면 aspect 와 handsY 만 다시 잰다.
  무대 좌표는 전부 % 다. 무대가 4:3 이라 높이 1% = 너비 0.75%.
*/

export const EVOLVE_T = 11;

const k = (name: string, frames: Frame[]) => kf(name, frames, EVOLVE_T);
const r = (name: string) => run(name, EVOLVE_T);

const FEET = 14; // 발 위치 (무대 높이 %). 그 아래 3–13% 가 메시지 박스
const ROBOT_H = 15; // 로봇 높이 (무대 높이 %)
const ROBOT_SINK = 0.5; // 로봇 발이 손 중심보다 얼마나 아래로. 손 위쪽 절반을 로봇이 덮어야 받쳐 든 것으로 읽힌다
const DS = "drop-shadow(0 5px 6px rgba(27,35,51,0.2))"; // 종이 그림자. 그림 안에 굽지 않는다

type Kid = { lv: number; src: string; H: number; aspect: number; handsY: number; W: number; hands: number };
// H = 키(무대 높이 %), aspect = 가로/세로(cut.mjs 가 찍어 준 값), handsY = 받쳐 든 손 중심(그림 위에서 %)
const KIDS: Kid[] = [
  { lv: 2, src: "/landing/evolve/kid-2.webp", H: 47, aspect: 0.3613, handsY: 48 },
  { lv: 4, src: "/landing/evolve/kid-4.webp", H: 61, aspect: 0.3174, handsY: 44 },
  { lv: 6, src: "/landing/evolve/kid-6.webp", H: 75, aspect: 0.3208, handsY: 41 },
].map((kid) => ({ ...kid, W: kid.H * kid.aspect * 0.75, hands: FEET + kid.H * (1 - kid.handsY / 100) }));
const LAST_KID = KIDS.length - 1;

const ROBOT_ASPECT = 0.6476;
const ROBOT_W = ROBOT_H * ROBOT_ASPECT * 0.75; // 무대 너비 %
const robotBottom = (kid: Kid) => kid.hands - ROBOT_SINK;
const ROBOT_NAMES = ["로봇 A", "로봇 B", "새 교구", "또 새 교구"];

// 진화 셋. t 부풀기 시작, d 부풀기 길이, s 최대 배율, lean 학생이 젖혀지는 각도
const EV = [
  { t: 1.4, d: 1.0, s: 2.6, lean: -4, tail: false },
  { t: 4.3, d: 1.0, s: 3.2, lean: -5, tail: false },
  { t: 7.2, d: 1.2, s: 3.8, lean: -6, tail: true },
].map((e) => ({ ...e, flash: e.t + e.d, pop: e.t + e.d + 0.1, end: e.t + e.d + 0.5 }));

// 성장 둘. 로봇이 조용할 때만
const GROW = [
  { t: 3.4, from: 0, to: 1 },
  { t: 6.3, from: 1, to: 2 },
];
const GD = 0.5;

const MSGS: [number, string][] = [
  [1.4, "어…? 로봇 A의 상태가…!"],
  [2.9, "로봇 A는 로봇 B로 진화했다!"],
  [3.4, "학생은 Lv.4가 되었다!"],
  [4.3, "어…? 로봇 B의 상태가…!"],
  [5.8, "로봇 B는 새 교구로 진화했다!"],
  [6.3, "학생은 Lv.6이 되었다!"],
  [7.2, "어…? 새 교구의 상태가…!"],
  [8.9, "새 교구는 또 새 교구로 진화했다!"],
  [9.4, "…교구는 여전히 Lv.1이다."],
];
const LAST_MSG = MSGS.length - 1;

const CAPTIONS = [
  { at: 0.8, kicker: "2019 · 프랜차이즈 교구", title: "로봇 A.\n초등 2학년." },
  { at: 2.9, kicker: "새 교구를 들였습니다", title: "다시 처음부터." },
  { at: 5.8, kicker: "또 새 교구를 들였습니다", title: "또 초보 단계." },
  { at: 9.4, kicker: "7년 동안 겪은 일", title: "학생은 자랐는데,\n커리큘럼은 제자리였습니다." },
];
const LAST_CAP = CAPTIONS.length - 1;

// ── keyframes ─────────────────────────────────────────────────────
function stageCss() {
  const css: string[] = [];

  // 로봇: 부풀기(배율 + 0.1초마다 좌우 흔들림) → 번쩍 동안 유지 → 펑(BOUNCE 로 아기)
  const wrap: Frame[] = [];
  EV.forEach((e) => {
    wrap.push([e.t, "transform:none", "linear"]);
    const n = Math.round(e.d / 0.1);
    for (let i = 1; i <= n; i++) {
      const u = i / n;
      const s = 1 + (e.s - 1) * u * u;
      const rot = (i % 2 ? 1 : -1) * (2 + 3 * u);
      wrap.push([e.t + i * 0.1, `transform:scale(${s.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`, "linear"]);
    }
    wrap.push([e.pop, `transform:scale(${e.s})`, BOUNCE], [e.end, "transform:none"]);
  });
  css.push(k("ev-wrap", wrap));

  // 로봇 그림: 처음에 나타나고, 진화 때마다 검게 변했다 펑에서 돌아온다. filter 는 한 속성이라 종이 그림자를 같이 적는다
  const robot: Frame[] = [
    [0.3, `opacity:0;filter:brightness(1) ${DS}`, EO],
    [0.7, `opacity:1;filter:brightness(1) ${DS}`],
  ];
  EV.forEach((e) =>
    robot.push(
      [e.t, `opacity:1;filter:brightness(1) ${DS}`, EO],
      [e.t + 0.35, `opacity:1;filter:brightness(0) ${DS}`],
      [e.pop, `opacity:1;filter:brightness(0) ${DS}`],
      [e.pop + 0.05, `opacity:1;filter:brightness(1) ${DS}`],
    ),
  );
  css.push(k("ev-robot", robot));

  // 실루엣 조각 — 뿔·날개는 매번, 꼬리는 세 번째에만
  const sil = (list: typeof EV): Frame[] =>
    list.flatMap((e): Frame[] => [
      [e.t + 0.35, "opacity:0;transform:scale(0.2)", BOUNCE],
      [e.t + e.d * 0.85, "opacity:1;transform:scale(1)"],
      [e.pop, "opacity:1;transform:scale(1)"],
      [e.pop + 0.05, "opacity:0;transform:scale(0.2)"],
    ]);
  css.push(k("ev-sil", sil(EV)), k("ev-sil-tail", sil(EV.filter((e) => e.tail))));

  // 어두워짐과 번쩍
  css.push(
    k(
      "ev-dim",
      EV.flatMap((e): Frame[] => [
        [e.t, "opacity:0", EO],
        [e.t + 0.6, "opacity:0.82"],
        [e.pop, "opacity:0.82", EO],
        [e.pop + 0.3, "opacity:0"],
      ]),
    ),
    k(
      "ev-flash",
      EV.flatMap((e): Frame[] => [
        [e.flash, "opacity:0", EO],
        [e.flash + 0.1, "opacity:1", EO],
        [e.flash + 0.5, "opacity:0"],
      ]),
    ),
  );

  // 연기 — 펑 직후 다섯 방향으로 퍼지며 사라진다
  PUFFS.forEach((p, i) =>
    css.push(
      k(
        `ev-puff-${i}`,
        EV.flatMap((e): Frame[] => [
          [e.pop, "opacity:0;transform:translate(0,0) scale(0.3)", EO],
          [e.pop + 0.06, "opacity:1;transform:translate(0,0) scale(0.6)", EO],
          [e.end + 0.15, `opacity:0;transform:translate(${p.dx}%,${p.dy}%) scale(1.4)`],
        ]),
      ),
    ),
  );

  // 로봇 자리: 학생이 자랄 때 손과 함께 올라간다. 기본값(마지막 프레임)은 초6 손
  css.push(
    k(
      "ev-pos",
      GROW.flatMap((g): Frame[] => [
        [g.t, `bottom:${robotBottom(KIDS[g.from]).toFixed(2)}%`, EO],
        [g.t + GD, `bottom:${robotBottom(KIDS[g.to]).toFixed(2)}%`],
      ]),
    ),
  );

  // 학생: 등장·성장(BOUNCE) → 진화 때 젖혀짐 → 다음 성장 때 사라짐. 이름표도 같은 박자
  KIDS.forEach((_, i) => {
    const f: Frame[] = [];
    if (i === 0) f.push([0, "opacity:0;transform:scale(0.9)", BOUNCE], [0.8, "opacity:1;transform:none"]);
    else f.push([GROW[i - 1].t, "opacity:0;transform:scale(0.94)", BOUNCE], [GROW[i - 1].t + GD, "opacity:1;transform:none"]);
    const e = EV[i];
    f.push(
      [e.t, "opacity:1;transform:none", EO],
      [e.flash, `opacity:1;transform:rotate(${e.lean}deg)`],
      [e.pop, `opacity:1;transform:rotate(${e.lean}deg)`, BOUNCE],
      [e.pop + 0.3, "opacity:1;transform:none"],
    );
    if (i < GROW.length) f.push([GROW[i].t, "opacity:1;transform:none", EO], [GROW[i].t + 0.25, "opacity:0;transform:none"]);
    css.push(k(`ev-kid-${i}`, f));

    const show = i === 0 ? 0.8 : GROW[i - 1].t + GD;
    const tag: Frame[] = [
      [show, "opacity:0", EO],
      [show + 0.3, "opacity:1"],
    ];
    if (i < GROW.length) tag.push([GROW[i].t, "opacity:1", EO], [GROW[i].t + 0.15, "opacity:0"]);
    css.push(k(`ev-kid-tag-${i}`, tag));
  });

  // 로봇 이름표: 부풀기 동안 숨고, 펑 뒤에 새 이름
  ROBOT_NAMES.forEach((_, j) => {
    const show = j === 0 ? 0.8 : EV[j - 1].end;
    const f: Frame[] = [
      [show, "opacity:0", EO],
      [show + 0.3, "opacity:1"],
    ];
    if (j < EV.length) f.push([EV[j].t, "opacity:1", EO], [EV[j].t + 0.15, "opacity:0"]);
    css.push(k(`ev-robot-tag-${j}`, f));
  });

  // 메시지 박스
  css.push(
    k("ev-msg", [
      [1.2, "opacity:0", EO],
      [1.5, "opacity:1"],
    ]),
  );
  MSGS.forEach(([t], i) => {
    const f: Frame[] = [
      [t, "opacity:0", EO],
      [t + 0.12, "opacity:1"],
    ];
    const next = MSGS[i + 1];
    if (next) f.push([next[0], "opacity:1", EO], [next[0] + 0.08, "opacity:0"]);
    css.push(k(`ev-msg-${i}`, f));
  });

  return css.join("\n");
}

const PUFFS = Array.from({ length: 5 }, (_, i) => {
  const a = ((i * 72 - 90) * Math.PI) / 180;
  return { dx: Math.round(Math.cos(a) * 130), dy: Math.round(Math.sin(a) * 130) };
});

const STAGE_CSS = stageCss();
const CAPTION_CSS = CAPTIONS.map((c, i) => {
  const f: Frame[] = [
    [c.at, "opacity:0;transform:translateY(24px)", EO],
    [c.at + 0.35, "opacity:1;transform:none"],
  ];
  const next = CAPTIONS[i + 1];
  if (next) f.push([next.at - 0.3, "opacity:1;transform:none", EO], [next.at, "opacity:0;transform:translateY(-24px)"]);
  return k(`ev-cap-${i}`, f);
}).join("\n");

// ── 자막 ──────────────────────────────────────────────────────────
export function EvolveCaptions() {
  return (
    <div className="relative min-h-[9rem] md:min-h-[15rem]">
      <style dangerouslySetInnerHTML={{ __html: CAPTION_CSS }} />
      {CAPTIONS.map((c, i) => (
        <div key={c.title} className="calm-none absolute inset-x-0 top-0" style={{ ...r(`ev-cap-${i}`), opacity: i === LAST_CAP ? 1 : 0 }} aria-hidden={i === LAST_CAP ? undefined : true}>
          <p className="text-[0.9375rem] font-semibold text-accent-ink md:text-lg">{c.kicker}</p>
          <p className={`display mt-2 text-[2rem] break-keep whitespace-pre-line md:text-[3.25rem] ${i === LAST_CAP ? "text-ink-gradient" : ""}`}>{c.title}</p>
        </div>
      ))}
    </div>
  );
}

// ── 무대 ──────────────────────────────────────────────────────────
// 이름표는 opacity 만 움직이므로 .calm-none 이 필요 없다. 배치(-translate-*-1/2)는 Tailwind v4 에서 translate 속성이라
// transform 애니메이션·동작 줄이기와 겹치지 않는다.
const TAG = "absolute whitespace-nowrap rounded-full bg-ink px-[0.9em] py-[0.35em] text-[clamp(0.6875rem,2.4cqw,1rem)] font-bold tracking-[-0.01em] text-white";
const LV = "ml-[0.4em] text-[#ffd166] tabular-nums";
const SIL = "#141a2b";

export function EvolveStage() {
  return (
    <div
      className="@container relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-white"
      role="img"
      aria-label="초등학교 2학년 학생이 아기 로봇을 두 손으로 받쳐 들고 있다. 로봇은 검은 괴물 실루엣으로 부풀며 요란하게 진화하지만, 번쩍 하고 나면 똑같은 아기 로봇이다. 이름만 로봇 B, 새 교구, 또 새 교구로 바뀌고 레벨은 늘 1이다. 그사이 학생만 4학년, 6학년으로 자란다. 마지막에는 6학년 학생이 손바닥만 한 아기 로봇을 들고 있다."
    >
      <style dangerouslySetInnerHTML={{ __html: STAGE_CSS }} />

      {/* 바닥 */}
      <div className="absolute inset-x-[6%] h-px bg-separator" style={{ bottom: `${FEET}%` }} aria-hidden="true" />

      {/* 학생 셋 — 발 기준으로 선다 */}
      {KIDS.map((kid, i) => (
        <div
          key={kid.src}
          className="calm-none absolute origin-bottom"
          style={{ left: `${(50 - kid.W / 2).toFixed(3)}%`, bottom: `${FEET}%`, width: `${kid.W.toFixed(3)}%`, height: `${kid.H}%`, opacity: i === LAST_KID ? 1 : 0, ...r(`ev-kid-${i}`) }}
          aria-hidden="true"
        >
          <Image src={kid.src} alt="" fill sizes="(min-width: 1024px) 180px, 32vw" className="object-contain" style={{ filter: DS }} />
        </div>
      ))}
      {KIDS.map((kid, i) => (
        <p key={kid.lv} className={`${TAG} left-1/2 -translate-x-1/2`} style={{ bottom: `${FEET + kid.H + 2.5}%`, opacity: i === LAST_KID ? 1 : 0, ...r(`ev-kid-tag-${i}`) }} aria-hidden="true">
          학생<b className={LV}>Lv.{kid.lv}</b>
        </p>
      ))}

      {/* 진화 중에 무대가 어두워진다 — 학생은 이 아래, 로봇은 이 위 */}
      <div className="absolute inset-0 bg-ink" style={{ opacity: 0, ...r("ev-dim") }} aria-hidden="true" />

      {/* 로봇 — 자리(bottom)는 손을 따라가고, 안쪽이 부풀고 흔들린다. 부풀기 기준점은 로봇 중심 */}
      <div
        className="absolute left-1/2"
        style={{ width: `${ROBOT_W.toFixed(3)}%`, height: `${ROBOT_H}%`, marginLeft: `-${(ROBOT_W / 2).toFixed(3)}%`, bottom: `${robotBottom(KIDS[LAST_KID]).toFixed(2)}%`, ...r("ev-pos") }}
        aria-hidden="true"
      >
        <div className="calm-none absolute inset-0" style={r("ev-wrap")}>
          {/* 실루엣 상자: 로봇 폭의 3배 × 높이의 2배. 폭 2배면 정사각 viewBox 가 폭에 맞춰 줄어 뿔이 머리 뒤에 숨는다 */}
          <svg viewBox="0 0 200 200" className="calm-none absolute" style={{ ...SIL_BOX, ...r("ev-sil") }}>
            <path d="M78 70 L66 18 L98 60 Z" fill={SIL} />
            <path d="M122 70 L134 18 L102 60 Z" fill={SIL} />
            <path d="M62 95 L4 54 L30 100 L0 146 L60 132 Z" fill={SIL} />
            <path d="M138 95 L196 54 L170 100 L200 146 L140 132 Z" fill={SIL} />
          </svg>
          <svg viewBox="0 0 200 200" className="calm-none absolute" style={{ ...SIL_BOX, ...r("ev-sil-tail") }}>
            <path d="M132 148 Q172 160 178 194 L192 176 L200 200 L170 200 Q160 170 128 158 Z" fill={SIL} />
          </svg>
          <div className="absolute inset-0" style={{ filter: DS, ...r("ev-robot") }}>
            <Image src="/landing/evolve/robot.webp" alt="" fill sizes="(min-width: 1024px) 220px, 40vw" className="object-contain" />
          </div>
        </div>

        {PUFFS.map((_, i) => (
          <span key={i} className="calm-none absolute top-1/2 left-1/2 -mt-[35%] -ml-[35%] aspect-square w-[70%] rounded-full bg-[#cfd6e2]" style={{ opacity: 0, ...r(`ev-puff-${i}`) }} />
        ))}

        {/* 로봇 이름표는 옆에 단다. 머리 위에 두면 학생 얼굴을 가린다 */}
        {ROBOT_NAMES.map((name, j) => (
          <p key={name} className={`${TAG} top-1/2 left-[118%] -translate-y-1/2`} style={{ opacity: j === ROBOT_NAMES.length - 1 ? 1 : 0, ...r(`ev-robot-tag-${j}`) }}>
            <span className="absolute top-1/2 right-full -mt-px h-0.5 w-[0.9em] bg-ink" />
            {name}
            <b className={LV}>Lv.1</b>
          </p>
        ))}
      </div>

      <div className="absolute inset-0 bg-white" style={{ opacity: 0, ...r("ev-flash") }} aria-hidden="true" />

      {/* 메시지 박스 — 게임 목소리 */}
      <div className="absolute inset-x-[4%] bottom-[3%] h-[10%] rounded-[14px] bg-ink text-[clamp(0.8125rem,3cqw,1.25rem)] font-semibold text-white" style={r("ev-msg")} aria-hidden="true">
        {MSGS.map(([, text], i) => (
          <span key={text} className="absolute inset-0 flex items-center px-[3.5cqw] whitespace-nowrap" style={{ opacity: i === LAST_MSG ? 1 : 0, ...r(`ev-msg-${i}`) }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

const SIL_BOX: CSSProperties = { left: "-100%", top: "-50%", width: "300%", height: "200%", transformOrigin: "50% 62%", opacity: 0 };
