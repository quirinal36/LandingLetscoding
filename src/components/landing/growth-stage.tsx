import Image from "next/image";
import type { CSSProperties } from "react";
import { BOUNCE, EI, EO, Frame, kf, run } from "@/components/landing/timeline";

/*
  성장 장면 — 라운지 확장 모델(만든다 → 다듬는다 → 자란다 → 남는다)을
  여러 겹의 종이 컷아웃이 스크롤에 따라 일어나는 팝업북으로 보여 준다.
  기획: GROWTH-SCENE-PLAN.md · 모형: lounge_model.md

  장면 1(만든다) → 장면 2(다듬는다) → 장면 3(자란다) → 장면 4(남는다).
    - 레이어마다 서는 시각(at)과 눕는 시각(out)을 갖는다. out 이 있는 레이어는 마지막 프레임이 "누워 사라짐"이라
      기본 스타일도 숨김이다 (timeline.ts 규칙: 기본 스타일 = 마지막 프레임).
    - 그래서 동작 줄이기·스크립트 없음에서는 장면 4만 선 채로 남는다.
    - 장면 2의 왼쪽 아이와 책상은 장면 1 레이어를 작게 줄여 다시 쓴다. 인물이 같아야 한다.

  종이가 서는 방식
    - 레이어마다 아래 가장자리가 경첩이다(transform-origin 50% 100%).
    - 뒤로 누운 rotateX(90deg)에서 0으로 선다. 90도에서는 옆면이라 보이지 않는다.
    - 무대의 perspective-origin 을 위쪽에 두어, 눕는 중인 종이의 앞면이 위에서 내려다보이게 한다.
    - BOUNCE 로 살짝 앞으로 넘쳤다가 제자리에 선다. 서는 동안 그림자도 함께 자란다.

  위치: 레이어 PNG 는 내용만 남게 잘라 두었고(public/landing/growth), 무대 위 자리는 아래 LAYERS 의 %로 잡는다.
  무대 좌표는 prototypes/growth/scene1-composite-v1.png(승인된 합성본)을 기준으로 맞췄다.

  동작 줄이기: 움직이는 요소에 .calm-none 을 붙인다. landing.css 가 transform 을 걷어 내고 opacity 변화만 남는다.
  그래서 서는 키프레임은 반드시 opacity 도 함께 움직인다.
*/

export const GROWTH_T = 20.2;

const k = (name: string, frames: Frame[]) => kf(name, frames, GROWTH_T);
const r = (name: string) => run(name, GROWTH_T);

type Layer = {
  key: string;
  src: string;
  /** 무대 기준 % */
  left: number;
  bottom: number;
  width: number;
  /** 이미지 가로/세로 비 (잘라 낸 WebP 기준) */
  aspect: number;
  /** 서기 시작하는 시각(초) */
  at: number;
  /** 눕기 시작하는 시각(초). 없으면 끝까지 서 있다 */
  out?: number;
  /** 노트북 화면 켜짐 연출을 얹는다 */
  screen?: boolean;
  /** 개발일지에 줄이 그어지는 연출을 얹는다 */
  journal?: boolean;
};

const STAND = 0.8;
const LIE = 0.5;
const DESK = "/landing/growth/s1-2-desk-play.webp";
const KID = "/landing/growth/s1-3-kid.webp";

// 장면 1 · 만든다 (0.0–4.9) — prototypes/growth/scene1-composite-v1.png 기준
// 장면 2 · 다듬는다 (4.9–9.9) — prototypes/growth/scene2-composite-v1.png 기준. 왼쪽 무리는 장면 1 을 0.7배로 줄였다.
// 장면 3 · 자란다 (9.9–14.3) — prototypes/growth/scene3-composite-v1.png 기준. 합성본과 무대가 같은 4:3 이라 합성본 좌표를 그대로 %로 옮겼다.
//   뒤쪽 아이들이 깊이감 있게 서도록 벽을 위로 올리고, 그 아래에 광장 바닥 종이(.growth-floor)를 깐다.
// 장면 4 · 남는다 (14.8–20.2) — 장면 1 의 방으로 돌아온다. 벽에 액자 셋, 노트북은 닫히고 개발일지와 결과보고서.
//   구도가 장면 1 과 같아 합성본 없이 장면 1 레이어를 참조로 뽑았다.
const S2 = 4.9;
const S3 = 9.9;
const S4 = 14.8;
const LAYERS: Layer[] = [
  { key: "s1-wall", src: "/landing/growth/s1-1-wall.webp", left: 6, bottom: 9, width: 88, aspect: 1.3468, at: 0.0, out: 4.55 },
  { key: "s1-desk", src: DESK, left: 21, bottom: 4, width: 60, aspect: 1.4706, at: 0.5, out: 4.45, screen: true },
  { key: "s1-kid", src: KID, left: 25, bottom: 6, width: 33, aspect: 0.7293, at: 1.0, out: 4.35 },

  { key: "s2-wall", src: "/landing/growth/s2-1-wall.webp", left: 6, bottom: 9, width: 88, aspect: 1.3289, at: S2, out: 9.45 },
  { key: "s2-desk", src: DESK, left: 6, bottom: 8.8, width: 42, aspect: 1.4706, at: S2 + 0.35, out: 9.4 },
  { key: "s2-kid", src: KID, left: 8.8, bottom: 10.2, width: 23.1, aspect: 0.7293, at: S2 + 0.6, out: 9.35 },
  { key: "s2-friend", src: "/landing/growth/s2-2-friend.webp", left: 58.5, bottom: 9, width: 27, aspect: 0.8079, at: S2 + 0.9, out: 9.3 },

  { key: "s3-wall", src: "/landing/growth/s3-1-wall.webp", left: 17, bottom: 38, width: 66, aspect: 1.5979, at: S3, out: 14.45 },
  { key: "s3-crowd-back", src: "/landing/growth/s3-2-crowd-back.webp", left: 23, bottom: 35, width: 34, aspect: 1.4159, at: S3 + 0.35, out: 14.4 },
  { key: "s3-crowd-front", src: "/landing/growth/s3-3-crowd-front.webp", left: 15, bottom: 12, width: 26, aspect: 1.1589, at: S3 + 0.6, out: 14.35 },
  { key: "s3-junior", src: "/landing/growth/s3-4-junior.webp", left: 56.5, bottom: 15, width: 26.5, aspect: 1.1667, at: S3 + 0.85, out: 14.3 },
  // 아이: 서서 액자를 올려다보며 하트를 날린 뒤, 후배 옆 바닥에 앉아 후배 노트북을 가리킨다
  { key: "s3-kid-look", src: "/landing/growth/s3-6-kid-look.webp", left: 43, bottom: 13, width: 13.9, aspect: 0.4875, at: S3 + 1.1, out: S3 + 3.0 },
  { key: "s3-kid-help", src: "/landing/growth/s3-5-kid-help.webp", left: 69, bottom: 10, width: 14, aspect: 0.7327, at: S3 + 3.2, out: 14.25 },

  { key: "s4-wall", src: "/landing/growth/s4-1-wall.webp", left: 6, bottom: 9, width: 88, aspect: 1.3201, at: S4 },
  { key: "s4-desk", src: "/landing/growth/s4-2-desk.webp", left: 15.7, bottom: 5.4, width: 68, aspect: 1.7628, at: S4 + 0.4, journal: true },
  { key: "s4-kid", src: "/landing/growth/s4-3-kid.webp", left: 25, bottom: 6, width: 29.9, aspect: 0.661, at: S4 + 0.7 },
  { key: "s4-report", src: "/landing/growth/s4-4-report.webp", left: 60, bottom: 38, width: 7, aspect: 0.7967, at: S4 + 1.8 },
];

// 노트북 화면: 책상 레이어에는 종이 공작 게임 화면이 이미 그려져 있다(힉스필드로 책상과 함께 생성).
// 그 위에 꺼진 화면색 판을 얹었다가 걷어 내어 "화면이 켜진다"를 만든다. 아래는 게임 화면 안쪽 네 모서리(책상 레이어 기준 %).
const SCREEN = { tl: [51.3, 3.2], tr: [75.0, 5.6], br: [73.2, 31.4], bl: [47.4, 29.0] } as const;
const SCREEN_AT = 2.4;

// 종이비행기: 노트북에서 오른쪽 위로 날아올랐다가, 장면이 넘어갈 때 화면 밖으로 떠난다(친구에게 간다)
const PLANE = { left: 64, top: 13, width: 13, aspect: 1.377, at: 3.2, out: 4.2 };

// 튀어나오는 것들: 출발점에서 작게 나와 제자리로 간다. dx·dy 는 출발점까지의 거리, 요소 크기 기준 %
type Pop = { key: string; src: string; left: number; top: number; width: number; aspect: number; at: number; dx: number; dy: number; out?: number };
const HEART = "/landing/growth/s2-3-heart.webp";
const POPS: Pop[] = [
  // 장면 2 반응 말풍선: 친구의 휴대폰에서 튀어 올라 두 방 사이에 뜬다
  { key: "s2-heart", src: HEART, left: 44, top: 19, width: 10, aspect: 0.9563, at: S2 + 2.0, dx: 170, dy: 250, out: 9.2 },
  { key: "s2-star", src: "/landing/growth/s2-4-star.webp", left: 53, top: 27, width: 9, aspect: 1.0631, at: S2 + 2.5, dx: 110, dy: 190, out: 9.2 },
  { key: "s2-dots", src: "/landing/growth/s2-5-dots.webp", left: 54, top: 37, width: 8.5, aspect: 1.1348, at: S2 + 3.0, dx: 90, dy: 110, out: 9.2 },
  // 장면 3: 아이 손의 하트가 벽의 물고기 액자로 날아간다(투자·댓글)
  { key: "s3-heart", src: HEART, left: 57, top: 20, width: 6, aspect: 0.9563, at: S3 + 2.1, dx: -60, dy: 400, out: 14.2 },
  // 장면 4: 점선 화살표 끝에 작은 종이비행기. 다음 작품으로
  { key: "s4-plane", src: "/landing/growth/s1-5-plane.webp", left: 62, top: 2.5, width: 7, aspect: 1.377, at: S4 + 4.3, dx: 120, dy: 60 },
];
// 장면 4 개발일지: 책상 레이어 안 오른쪽 페이지의 네 모서리(책상 레이어 기준 %). 줄 셋이 차례로 그어진다
const PAGE = { tl: [44.6, 17.2], tr: [63.4, 20.9], br: [61.6, 34.4], bl: [43.8, 31.3] } as const;
const LINES_AT = S4 + 2.3;
const lerp = (a: readonly number[], b: readonly number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const JOURNAL_ASPECT = 1.7628; // s4-2-desk.webp 가로/세로
const JOURNAL_LINES = [0.3, 0.5, 0.7].map((t, i) => {
  const l = lerp(PAGE.tl, PAGE.bl, t);
  const r = lerp(PAGE.tr, PAGE.br, t);
  const a = lerp(l, r, 0.1);
  const b = lerp(l, r, i === 2 ? 0.55 : 0.88);
  const x = (v: number) => (v * JOURNAL_ASPECT).toFixed(2);
  return `M${x(a[0])} ${a[1].toFixed(2)} L${x(b[0])} ${b[1].toFixed(2)}`;
});

// 장면 4 순환 화살표: 무대 오른쪽 가장자리를 타고 위로 올라가 왼쪽으로 꺾인다(무대 좌표, viewBox 100×75)
const LOOP_PATH = "M88 58 C95 56 96 50 96 42 L96 14 C96 6 92 4 84 4 L74 4";
const LOOP_AT = S4 + 3.4;

// 연필 종이: 반응을 읽고 고친다. 아이 책상 위, 머그 옆에 선다
const PENCIL = { left: 42.5, bottom: 31.5, width: 5.2, aspect: 0.8318, at: S2 + 3.7, out: 9.25 };

// ── 자막 ──────────────────────────────────────────────────────
// GROWTH-SCENE-PLAN.md 5절. 장면이 붙을 때마다 아래로 쌓이고, 지난 자막은 흐려진다.
const CAPTIONS = [
  { at: 1.8, title: "만들고", body: "AI와 함께 만들고,\n링크 하나로 세상에 내놓는다." },
  { at: S2 + 1.5, title: "공유하기", body: "시장이 반응하는 지점을\n찾아나선다." },
  { at: S3 + 1.6, title: "성장하고", body: "친구가 써 보고, 투자하고,\n함께 성장해 나간다." },
  { at: S4 + 1.3, title: "기록하기", body: "개발일지와 결과보고서.\n다음 작품의 출발점." },
];

export function GrowthCaptions() {
  // 위: 네 단계 이름이 한 줄로, 지금 단계만 진하다. 아래: 지금 단계의 큰 제목과 설명 하나가 바뀌어 든다.
  // 네 개를 쌓으면 휴대폰과 낮은 화면에서 고정 장면 높이를 넘는다.
  const css: string[] = [];
  CAPTIONS.forEach((c, i) => {
    const next = CAPTIONS[i + 1];
    const step: Frame[] = [
      [c.at, "opacity:0.3", EO],
      [c.at + 0.3, "opacity:1"],
    ];
    if (next) step.push([next.at, "opacity:1", EO], [next.at + 0.3, "opacity:0.3"]);
    css.push(k(`gr-step-${i}`, step));

    const big: Frame[] = [
      [c.at, "opacity:0;transform:translateY(18px)", EO],
      [c.at + 0.4, "opacity:1;transform:none"],
    ];
    if (next) big.push([next.at - 0.35, "opacity:1;transform:none", EO], [next.at, "opacity:0;transform:translateY(-18px)"]);
    css.push(k(`gr-cap-${i}`, big));
  });
  const last = CAPTIONS.length - 1;
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: css.join("\n") }} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[1rem] font-bold md:text-lg" aria-label="라운지 학습 모형의 네 단계">
        {CAPTIONS.map((c, i) => (
          <li key={c.title} className="flex items-center gap-2" style={{ ...r(`gr-step-${i}`), opacity: i === last ? 1 : 0.3 }}>
            {i > 0 && (
              <span className="text-ink-faint" aria-hidden="true">
                →
              </span>
            )}
            {c.title}
          </li>
        ))}
      </ol>
      <div className="relative mt-4 min-h-[8.5rem] md:mt-6 md:min-h-[12rem]">
        {CAPTIONS.map((c, i) => (
          <div key={c.title} className="calm-none absolute inset-x-0 top-0" style={{ ...r(`gr-cap-${i}`), opacity: i === last ? 1 : 0 }} aria-hidden={i === last ? undefined : true}>
            <p className="display text-[2.5rem] md:text-[4rem]">{c.title}</p>
            <p className="mt-2 text-[1.0625rem] leading-relaxed whitespace-pre-line text-ink-soft md:text-xl">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 무대 ──────────────────────────────────────────────────────
const SHADOW = "drop-shadow(0 10px 14px rgba(27,35,51,0.22))";
const FLAT = "drop-shadow(0 0 0 rgba(27,35,51,0))";
const paperFrames = (l: Layer): Frame[] => {
  const f: Frame[] = [
    [l.at, `opacity:0;transform:rotateX(90deg);filter:${FLAT}`, BOUNCE],
    [l.at + STAND, `opacity:1;transform:rotateX(0deg);filter:${SHADOW}`],
  ];
  // 뒤로 누우며 사라진다. 팝업북 책장이 넘어갈 때 종이가 접히는 것처럼
  if (l.out !== undefined) f.push([l.out, `opacity:1;transform:rotateX(0deg);filter:${SHADOW}`, EI], [l.out + LIE, `opacity:0;transform:rotateX(80deg);filter:${FLAT}`]);
  return f;
};
const stood = (out?: number): CSSProperties => ({ filter: SHADOW, opacity: out === undefined ? 1 : 0 });

export function GrowthStage() {
  const css: string[] = [];
  LAYERS.forEach((l) => css.push(k(`gr-${l.key}`, paperFrames(l))));
  css.push(
    k("gr-s1-screen-off", [
      [SCREEN_AT, "opacity:1", EO],
      [SCREEN_AT + 0.7, "opacity:0"],
    ]),
    k("gr-s1-screen-glow", [
      [SCREEN_AT + 0.2, "opacity:0", EO],
      [SCREEN_AT + 0.45, "opacity:0.7", EO],
      [SCREEN_AT + 1.1, "opacity:0"],
    ]),
    k("gr-s1-plane", [
      [PLANE.at, "opacity:0;transform:translate(-160%, 190%) rotate(-18deg) scale(0.45)", EO],
      [PLANE.at + 0.25, "opacity:1;transform:translate(-120%, 140%) rotate(-14deg) scale(0.55)", EO],
      [PLANE.at + 1.0, "opacity:1;transform:none", EI],
      [PLANE.out, "opacity:1;transform:none", EI],
      [PLANE.out + 0.5, "opacity:0;transform:translate(160%, -120%) rotate(8deg) scale(0.8)"],
    ]),
    k("gr-s2-pencil", paperFrames({ key: "pencil", src: "", left: 0, bottom: 0, width: 0, aspect: 1, at: PENCIL.at, out: PENCIL.out })),
    k("gr-s3-floor", [
      [S3, "opacity:0", EO],
      [S3 + 0.5, "opacity:1", EI],
      [14.4, "opacity:1", EI],
      [14.8, "opacity:0"],
    ]),
    ...JOURNAL_LINES.map((_, i) =>
      k(`gr-s4-line-${i}`, [
        [LINES_AT + i * 0.3, "stroke-dashoffset:1", EO],
        [LINES_AT + i * 0.3 + 0.35, "stroke-dashoffset:0"],
      ]),
    ),
    k("gr-s4-loop", [
      [LOOP_AT, "stroke-dashoffset:1", EO],
      [LOOP_AT + 1.0, "stroke-dashoffset:0"],
    ]),
    k("gr-s4-loop-head", [
      [LOOP_AT + 0.9, "opacity:0", EO],
      [LOOP_AT + 1.1, "opacity:1"],
    ]),
    ...POPS.map((p) => {
      const f: Frame[] = [
        [p.at, `opacity:0;transform:translate(${p.dx}%, ${p.dy}%) scale(0.2)`, BOUNCE],
        [p.at + 0.7, "opacity:1;transform:none"],
      ];
      if (p.out !== undefined) f.push([p.out, "opacity:1;transform:none", EI], [p.out + 0.35, "opacity:0;transform:scale(0.6)"]);
      return k(`gr-${p.key}`, f);
    }),
  );

  const clip = `polygon(${[SCREEN.tl, SCREEN.tr, SCREEN.br, SCREEN.bl].map(([x, y]) => `${x}% ${y}%`).join(", ")})`;

  return (
    <div
      className="growth-stage relative aspect-[4/3] w-full overflow-hidden rounded-[28px]"
      role="img"
      aria-label="종이로 만든 작은 방이 하나씩 일어선다. 노란 후드를 입은 아이가 노트북으로 게임을 만들고, 종이비행기 한 장이 화면에서 날아간다. 방이 접히고 두 방이 새로 선다. 옆방의 파란 후드 친구가 휴대폰으로 그 게임을 하고, 하트와 별과 말줄임표 말풍선이 아이 쪽으로 날아온다. 아이 책상 위에 연필 종이가 선다. 다시 방이 접히고 작품 액자가 걸린 광장이 선다. 아이들이 휴대폰과 태블릿으로 서로의 게임을 함께 하고, 노란 후드 아이는 액자를 올려다보며 하트를 날린 뒤 어린 후배 옆에 앉아 후배의 노트북을 가리킨다. 마지막으로 처음의 방으로 돌아온다. 벽에는 작품 액자 셋이 걸렸고, 아이는 노트북을 닫고 개발일지를 쓴다. 책상에 결과보고서가 서고, 점선 화살표가 위로 올라가 다음 작품으로 이어진다."
    >
      <style dangerouslySetInnerHTML={{ __html: css.join("\n") }} />

      {/* 탁자 면 */}
      <div className="growth-table absolute inset-x-0 bottom-0 h-[16%]" aria-hidden="true" />

      <div className="growth-3d absolute inset-0" aria-hidden="true">
        {/* 장면 3 · 광장 바닥 — 벽 아래로 펼쳐진 종이 */}
        <div className="calm-none growth-floor absolute inset-x-0 bottom-[5%] h-[34%]" style={{ opacity: 0, ...r("gr-s3-floor") }} />

        {LAYERS.map((l) => (
          <div
            key={l.key}
            className="calm-none growth-paper absolute"
            style={{ left: `${l.left}%`, bottom: `${l.bottom}%`, width: `${l.width}%`, aspectRatio: String(l.aspect), ...stood(l.out), ...r(`gr-${l.key}`) }}
          >
            <Image src={l.src} alt="" fill sizes="(min-width: 1088px) 600px, 90vw" className="object-contain" />

            {/* 노트북 화면 — 꺼진 판이 걷히며 게임이 켜진다. 기본 스타일은 켜진 상태(판 숨김) */}
            {l.screen && (
              <>
                <div className="absolute inset-0 bg-[#232a3b]" style={{ clipPath: clip, opacity: 0, ...r("gr-s1-screen-off") }} />
                <div className="absolute inset-0 bg-white mix-blend-soft-light" style={{ clipPath: clip, opacity: 0, ...r("gr-s1-screen-glow") }} />
              </>
            )}

            {/* 개발일지 — 오른쪽 페이지에 줄 셋이 차례로 그어진다. 기본 스타일은 다 그어진 상태 */}
            {l.journal && (
              <svg className="absolute inset-0 size-full" viewBox={`0 0 ${(100 * JOURNAL_ASPECT).toFixed(2)} 100`}>
                {JOURNAL_LINES.map((d, i) => (
                  <path key={i} d={d} pathLength={1} fill="none" stroke="#3a4152" strokeWidth={0.55} strokeLinecap="round" strokeDasharray="1 2" style={r(`gr-s4-line-${i}`)} />
                ))}
              </svg>
            )}
          </div>
        ))}

        {/* 종이비행기 — 링크가 친구에게 간다 */}
        <div className="calm-none absolute" style={{ left: `${PLANE.left}%`, top: `${PLANE.top}%`, width: `${PLANE.width}%`, aspectRatio: String(PLANE.aspect), ...stood(PLANE.out), ...r("gr-s1-plane") }}>
          <Image src="/landing/growth/s1-5-plane.webp" alt="" fill sizes="140px" className="object-contain" />
        </div>

        {/* 장면 2 · 연필 종이 — 반응을 읽고 고친다 */}
        <div
          className="calm-none growth-paper absolute"
          style={{ left: `${PENCIL.left}%`, bottom: `${PENCIL.bottom}%`, width: `${PENCIL.width}%`, aspectRatio: String(PENCIL.aspect), ...stood(PENCIL.out), ...r("gr-s2-pencil") }}
        >
          <Image src="/landing/growth/s2-6-pencil.webp" alt="" fill sizes="80px" className="object-contain" />
        </div>

        {/* 장면 4 · 순환 화살표 — 점선이 그어지며 올라가 다음 작품으로 돌아간다. 마스크로 점선을 "그린다" */}
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 75" preserveAspectRatio="none">
          <defs>
            <mask id="gr-loop-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="75">
              <path d={LOOP_PATH} pathLength={1} fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="1 2" style={r("gr-s4-loop")} />
            </mask>
          </defs>
          <path d={LOOP_PATH} fill="none" stroke="#5b6adf" strokeWidth={0.55} strokeLinecap="round" strokeDasharray="1.4 1.3" mask="url(#gr-loop-mask)" />
          <path d="M77 1.6 L73.6 4 L77 6.4" fill="none" stroke="#5b6adf" strokeWidth={0.55} strokeLinecap="round" strokeLinejoin="round" style={r("gr-s4-loop-head")} />
        </svg>

        {/* 튀어나오는 것들 — 장면 2 반응 말풍선, 장면 3 하트, 장면 4 종이비행기 */}
        {POPS.map((p) => (
          <div key={p.key} className="calm-none absolute" style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.width}%`, aspectRatio: String(p.aspect), ...stood(p.out), ...r(`gr-${p.key}`) }}>
            <Image src={p.src} alt="" fill sizes="120px" className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
