import Image from "next/image";
import type { CSSProperties } from "react";
import { BOUNCE, EO, Frame, kf, run } from "@/components/landing/timeline";

/*
  진화 장면 — 랜딩 3번. 교구는 진화할 때마다 다음 초보용 교구로 바뀌고, 그때마다 학생이 자라 레벨이 오른다. (docs/EVOLVE-SCENE-PLAN.md)

  0.0–0.8   학생 Lv.1(초2)이 왕초보용 코딩로봇(눈에 불 켜진 로봇)을 두 손으로 받쳐 들고 선다.
  1.4–2.9   진화 1: 검은 실루엣으로 2.6배 부풀고 뿔·날개, 가운데 "레벨업!"이 커진다 → 번쩍 → 펑.
            빛이 걷히면 학생은 Lv.2(초4)로 자라 있고, 손에는 조립형 코딩로봇.
            "훌륭한 재능이야!" → "다음 로봇이 너와 함께할 거야."
  3.8–5.3   진화 2 (3.2배) → 펑, 학생 Lv.3(초6), 조립형 로봇은 사라진다.
            "대단한걸? 최고의 엔지니어야!" → "다음은 드론과 함께 해 보자."
  5.0–5.9   입문용 코딩드론이 하늘에서 흔들리며 날아와 Lv.3 학생 손에 안긴다.
  6.8–8.5   진화 3 (3.8배, 꼬리까지) → 펑, 드론 대신 졸업모자. 다음 교구가 없다. 레벨은 3 에서 멈춘다.
            "여기까지 오게 될 줄 몰랐어" → "이제 더 이상 가르칠 게 없구나"
  9.0–11    펀치라인. 아무것도 움직이지 않는다. Lv.3 학생 손에 졸업모자.

  학생은 진화의 번쩍 뒤에서 자란다. 흰 빛이 가장 밝은 펑에서 작은 학생과 큰 학생이 바뀌고, 교구 자리도 새 손 높이로 옮긴다.
  그래서 새 교구가 손에 들릴 때 레벨도 이미 올라 있다.
  "레벨업!"은 부풀기 동안 점점 커지다 펑(진화 완료)에서 사라진다. 번쩍이 가장 밝을 때라 흰 빛에 묻혀 없어진다.
  두 목소리: 왼쪽 자막은 원장 목소리(존댓말), 무대 아래 메시지 박스는 교구 목소리(반말).

  기본 스타일 = 마지막 프레임(timeline.ts 규칙): Lv.3 학생 + 졸업모자 + 마지막 자막.
  동작 줄이기: .calm-none 이 transform 을 걷어 내므로 부풀기는 검게 변했다 돌아오는 것, "레벨업!"은 커지지 않고 나타났다 사라지는 것,
  성장·교구 교체는 교차 페이드만 남는다. 드론은 날아오지 않고 손 위에 나타난다.
  교구 자리는 transform 이 아니라 bottom 으로 옮기므로 동작 줄이기에서도 손을 따라간다.

  그림: public/landing/evolve (prototypes/evolve/cut.mjs 로 자른 것). 그림을 바꾸면 aspect 와 handsY 만 다시 잰다.
  학생과 무대 요소는 무대 %, 교구는 무대 폭 기준 cqw 로 잡는다. 무대가 4:3 이라 높이 1% = 0.75cqw.
*/

export const EVOLVE_T = 11;

const k = (name: string, frames: Frame[]) => kf(name, frames, EVOLVE_T);
const r = (name: string) => run(name, EVOLVE_T);
const hToCq = (stageH: number) => stageH * 0.75; // 무대 높이 % → cqw

const FEET = 14; // 발 위치 (무대 높이 %). 그 아래 3–13% 가 메시지 박스
const SINK = 0.5; // 교구 바닥이 손 중심보다 얼마나 아래로. 손 위쪽 절반을 교구가 덮어야 받쳐 든 것으로 읽힌다
const DS = "drop-shadow(0 5px 6px rgba(27,35,51,0.2))"; // 종이 그림자. 그림 안에 굽지 않는다

type Kid = { lv: number; src: string; H: number; aspect: number; handsY: number; W: number; hands: number };
// H = 키(무대 높이 %), aspect = 가로/세로(cut.mjs 가 찍어 준 값), handsY = 받쳐 든 손 중심(그림 위에서 %)
const KIDS: Kid[] = [
  { lv: 1, src: "/landing/evolve/kid-2.webp", H: 47, aspect: 0.3613, handsY: 48 },
  { lv: 2, src: "/landing/evolve/kid-4.webp", H: 61, aspect: 0.3174, handsY: 44 },
  { lv: 3, src: "/landing/evolve/kid-6.webp", H: 75, aspect: 0.3208, handsY: 41 },
].map((kid) => ({ ...kid, W: kid.H * kid.aspect * 0.75, hands: FEET + kid.H * (1 - kid.handsY / 100) }));
const LAST_KID = KIDS.length - 1;

type Kit = { name?: string; src: string; H: number; aspect: number; w: number; h: number };
// 교구 셋 + 마지막 진화 뒤 손에 남는 졸업모자(이름표 없음). H = 높이(무대 높이 %), aspect = 가로/세로. w·h 는 cqw
const KITS: Kit[] = [
  { name: "왕초보용 코딩로봇", src: "/landing/evolve/kit-1.webp", H: 15, aspect: 0.8324 },
  { name: "조립형 코딩로봇", src: "/landing/evolve/kit-2.webp", H: 14, aspect: 0.9502 },
  { name: "입문용 코딩드론", src: "/landing/evolve/kit-3.webp", H: 8, aspect: 1.805 },
  { src: "/landing/evolve/cap.webp", H: 9, aspect: 1.394 },
].map((kit) => ({ ...kit, h: hToCq(kit.H), w: hToCq(kit.H) * kit.aspect }));
const LAST_KIT = KITS.length - 1;
// 부풀기 상자 = 가장 큰 교구. 실루엣 조각은 이 상자 기준으로 붙는다
const WRAP_W = Math.max(...KITS.map((kit) => kit.w));
const WRAP_H = Math.max(...KITS.map((kit) => kit.h));
const kitBottom = (kid: Kid) => kid.hands - SINK;

// 진화 셋. t 부풀기 시작, d 부풀기 길이, s 최대 배율, lean 학생이 젖혀지는 각도
const EV = [
  { t: 1.4, d: 1.0, s: 2.6, lean: -4, tail: false },
  { t: 3.8, d: 1.0, s: 3.2, lean: -5, tail: false },
  { t: 6.8, d: 1.2, s: 3.8, lean: -6, tail: true },
].map((e) => ({ ...e, flash: e.t + e.d, pop: e.t + e.d + 0.1, end: e.t + e.d + 0.5 }));

// 드론이 하늘에서 날아와 손에 안긴다. 진화 2 의 빛이 걷히기 시작할 때 출발 — 그때 학생은 이미 Lv.3
const DRONE = { at: 5.0, land: 5.9 };

// 메시지 박스 — 진화마다 두 줄: 부풀기 시작에 한 줄, 펑에 한 줄
const MSGS: [number, string][] = [
  [EV[0].t, "훌륭한 재능이야!"],
  [EV[0].pop, "다음 로봇이 너와 함께할 거야."],
  [EV[1].t, "대단한걸? 최고의 엔지니어야!"],
  [EV[1].pop, "다음은 드론과 함께 해 보자."],
  [EV[2].t, "여기까지 오게 될 줄 몰랐어"],
  [EV[2].pop, "이제 더 이상 가르칠 게 없구나"],
];
const LAST_MSG = MSGS.length - 1;

const CAPTIONS = [
  { at: 0.8, kicker: "2019 · 프랜차이즈 교구", title: "왕초보용 코딩로봇,\n초등 2학년." },
  { at: EV[0].end, kicker: "다음 교구를 들였습니다", title: "조립형 코딩로봇.\n다시 처음부터." },
  { at: DRONE.land, kicker: "또 다음 교구를 들였습니다", title: "입문용 코딩드론.\n또 초보 단계." },
  { at: EV[2].end + 0.5, kicker: "7년 동안 겪은 일", title: "학생은 자랐는데,\n커리큘럼은 제자리였습니다." },
];
const LAST_CAP = CAPTIONS.length - 1;

// ── keyframes ─────────────────────────────────────────────────────
const PUFFS = Array.from({ length: 5 }, (_, i) => {
  const a = ((i * 72 - 90) * Math.PI) / 180;
  return { dx: Math.round(Math.cos(a) * 130), dy: Math.round(Math.sin(a) * 130) };
});

function stageCss() {
  const css: string[] = [];

  // 부풀기 상자: 배율 + 0.1초마다 좌우 흔들림 → 번쩍 동안 유지 → 펑(BOUNCE 로 원래 크기)
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

  // 교구 그림 묶음: 진화 때마다 검게 변했다 펑에서 돌아온다. filter 는 한 속성이라 종이 그림자를 같이 적는다
  css.push(
    k(
      "ev-kits",
      EV.flatMap((e): Frame[] => [
        [e.t, `filter:brightness(1) ${DS}`, EO],
        [e.t + 0.35, `filter:brightness(0) ${DS}`],
        [e.pop, `filter:brightness(0) ${DS}`],
        [e.pop + 0.05, `filter:brightness(1) ${DS}`],
      ]),
    ),
  );

  // 교구: 1 은 처음부터, 2 는 진화 1 의 펑에서 튀어나오고, 3(드론)은 하늘에서 날아온다. 진화 3 의 펑에서 졸업모자가 튀어나온다
  const hide = (t: number): Frame[] => [
    [t, "opacity:1;transform:none"],
    [t + 0.05, "opacity:0;transform:none"],
  ];
  const popIn = (t: number): Frame[] => [
    [t, "opacity:0;transform:scale(0.5)", BOUNCE],
    [t + 0.4, "opacity:1;transform:none"],
  ];
  css.push(
    k("ev-kit-0", [[0.3, "opacity:0;transform:scale(0.8)", BOUNCE], [0.7, "opacity:1;transform:none"], ...hide(EV[0].pop)]),
    k("ev-kit-1", [...popIn(EV[0].pop), ...hide(EV[1].pop)]),
    k("ev-kit-2", [
      [DRONE.at - 0.01, "opacity:0;transform:translate(70%,-800%) rotate(-12deg)"],
      [DRONE.at, "opacity:1;transform:translate(70%,-800%) rotate(-12deg)", EO],
      [DRONE.at + 0.4, "opacity:1;transform:translate(-45%,-380%) rotate(10deg)", EO],
      [DRONE.at + 0.65, "opacity:1;transform:translate(15%,-70%) rotate(-5deg)", BOUNCE],
      [DRONE.land, "opacity:1;transform:none"],
      ...hide(EV[2].pop),
    ]),
    k("ev-kit-3", popIn(EV[2].pop)),
  );

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

  // 레벨업! — 부풀기 동안 작게 나타나 점점 커지고, 펑(진화 완료)에서 사라진다
  css.push(
    k(
      "ev-levelup",
      EV.flatMap((e): Frame[] => [
        [e.t, "opacity:0;transform:scale(0.3)", "linear"],
        [e.t + 0.2, "opacity:1;transform:scale(0.4)", "linear"],
        [e.pop, "opacity:1;transform:scale(1)", EO],
        [e.pop + 0.1, "opacity:0;transform:scale(1.15)"],
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

  // 교구 자리: 펑에서 새 손 높이로 옮긴다(번쩍에 가려 보이지 않는다). 기본값(마지막 프레임)은 Lv.3 손
  css.push(
    k(
      "ev-pos",
      KIDS.slice(0, LAST_KID).flatMap((kid, i): Frame[] => [
        [EV[i].pop, `bottom:${kitBottom(kid).toFixed(2)}%`],
        [EV[i].pop + 0.05, `bottom:${kitBottom(KIDS[i + 1]).toFixed(2)}%`],
      ]),
    ),
  );

  // 학생: 진화 때 젖혀졌다가, 펑에서 다음 학생(한 뼘 큰)과 바뀐다. 마지막 학생은 젖혀졌다 돌아온다. 이름표도 같은 박자
  KIDS.forEach((_, i) => {
    const f: Frame[] = [];
    if (i === 0) f.push([0, "opacity:0;transform:scale(0.9)", BOUNCE], [0.8, "opacity:1;transform:none"]);
    else f.push([EV[i - 1].pop, "opacity:0;transform:scale(0.94)", BOUNCE], [EV[i - 1].pop + 0.4, "opacity:1;transform:none"]);
    const e = EV[i];
    const lean = `transform:rotate(${e.lean}deg)`;
    f.push([e.t, "opacity:1;transform:none", EO], [e.flash, `opacity:1;${lean}`]);
    if (i < LAST_KID) f.push([e.pop, `opacity:1;${lean}`], [e.pop + 0.05, `opacity:0;${lean}`]);
    else f.push([e.pop, `opacity:1;${lean}`, BOUNCE], [e.pop + 0.3, "opacity:1;transform:none"]);
    css.push(k(`ev-kid-${i}`, f));

    const show = i === 0 ? 0.8 : EV[i - 1].end;
    const tag: Frame[] = [
      [show, "opacity:0", EO],
      [show + 0.3, "opacity:1"],
    ];
    if (i < LAST_KID) tag.push([e.pop, "opacity:1", EO], [e.pop + 0.1, "opacity:0"]);
    css.push(k(`ev-kid-tag-${i}`, tag));
  });

  // 교구 이름표: 부풀기 동안 숨는다. 졸업모자에는 이름표가 없어서 마지막 프레임에는 이름표가 없다
  const tagOn = (t: number): Frame[] => [
    [t, "opacity:0", EO],
    [t + 0.3, "opacity:1"],
  ];
  const tagOff = (t: number): Frame[] => [
    [t, "opacity:1", EO],
    [t + 0.15, "opacity:0"],
  ];
  css.push(
    k("ev-kit-tag-0", [...tagOn(0.8), ...tagOff(EV[0].t)]),
    k("ev-kit-tag-1", [...tagOn(EV[0].end), ...tagOff(EV[1].t)]),
    k("ev-kit-tag-2", [...tagOn(DRONE.land), ...tagOff(EV[2].t)]),
  );

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
const SIL_BOX: CSSProperties = { left: "-100%", top: "-50%", width: "300%", height: "200%", transformOrigin: "50% 62%", opacity: 0 };
const PUFF = WRAP_W * 0.7; // cqw

export function EvolveStage() {
  return (
    <div
      className="@container relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-white"
      role="img"
      aria-label="초등학교 2학년 학생이 눈에 불이 켜진 왕초보용 코딩로봇을 두 손으로 받쳐 들고 있다. 로봇이 검은 실루엣으로 부풀며 진화할 때마다 무대 가운데에 레벨업 글자가 커지고, 번쩍 하고 나면 학생은 한 뼘 자라 레벨이 올라 있고 손에는 다음 교구가 들려 있다. 레벨 2 학생은 팔다리 달린 조립형 코딩로봇을, 레벨 3 학생은 하늘에서 날아온 입문용 코딩드론을 받는다. 드론이 마지막으로 진화하면 이제 더 이상 가르칠 게 없다는 말과 함께 학생 손에 졸업모자가 남는다. 교구는 셋 다 레벨 1이었다."
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

      {/* 진화 중에 무대가 어두워진다 — 학생은 이 아래, 교구는 이 위 */}
      <div className="absolute inset-0 bg-ink" style={{ opacity: 0, ...r("ev-dim") }} aria-hidden="true" />

      {/* 교구 — 손 중심에 붙은 기준점. 자리(bottom)는 손을 따라가고, 안쪽 상자가 부풀고 흔들린다. 부풀기 기준점은 상자 중심 */}
      <div className="absolute left-1/2 size-0" style={{ bottom: `${kitBottom(KIDS[LAST_KID]).toFixed(2)}%`, ...r("ev-pos") }} aria-hidden="true">
        <div className="calm-none absolute bottom-0" style={{ left: `-${(WRAP_W / 2).toFixed(3)}cqw`, width: `${WRAP_W.toFixed(3)}cqw`, height: `${WRAP_H.toFixed(3)}cqw`, ...r("ev-wrap") }}>
          {/* 실루엣 상자: 부풀기 상자 폭의 3배 × 높이의 2배. 정사각 viewBox 가 폭에 맞춰 줄면 뿔이 머리 뒤에 숨는다 */}
          <svg viewBox="0 0 200 200" className="calm-none absolute" style={{ ...SIL_BOX, ...r("ev-sil") }}>
            <path d="M78 70 L66 18 L98 60 Z" fill={SIL} />
            <path d="M122 70 L134 18 L102 60 Z" fill={SIL} />
            <path d="M62 95 L4 54 L30 100 L0 146 L60 132 Z" fill={SIL} />
            <path d="M138 95 L196 54 L170 100 L200 146 L140 132 Z" fill={SIL} />
          </svg>
          <svg viewBox="0 0 200 200" className="calm-none absolute" style={{ ...SIL_BOX, ...r("ev-sil-tail") }}>
            <path d="M132 148 Q172 160 178 194 L192 176 L200 200 L170 200 Q160 170 128 158 Z" fill={SIL} />
          </svg>
          <div className="absolute inset-0" style={{ filter: DS, ...r("ev-kits") }}>
            {KITS.map((kit, i) => (
              <div
                key={kit.src}
                className="calm-none absolute bottom-0"
                style={{ left: `calc(50% - ${(kit.w / 2).toFixed(3)}cqw)`, width: `${kit.w.toFixed(3)}cqw`, height: `${kit.h.toFixed(3)}cqw`, opacity: i === LAST_KIT ? 1 : 0, ...r(`ev-kit-${i}`) }}
              >
                <Image src={kit.src} alt="" fill sizes="(min-width: 1024px) 220px, 40vw" className="object-contain" />
              </div>
            ))}
          </div>
        </div>

        {PUFFS.map((_, i) => (
          <span
            key={i}
            className="calm-none absolute aspect-square rounded-full bg-[#cfd6e2]"
            style={{ left: `-${(PUFF / 2).toFixed(3)}cqw`, bottom: `${((WRAP_H - PUFF) / 2).toFixed(3)}cqw`, width: `${PUFF.toFixed(3)}cqw`, opacity: 0, ...r(`ev-puff-${i}`) }}
          />
        ))}

        {/* 교구 이름표는 옆에 단다. 머리 위에 두면 학생 얼굴을 가린다 */}
        {KITS.map(
          (kit, i) =>
            kit.name && (
              <p
                key={kit.name}
                className={`${TAG} translate-y-1/2`}
                style={{ left: `${(kit.w / 2 + 1.2).toFixed(3)}cqw`, bottom: `${(kit.h / 2).toFixed(3)}cqw`, opacity: 0, ...r(`ev-kit-tag-${i}`) }}
              >
                <span className="absolute top-1/2 right-full -mt-px h-0.5 w-[0.9em] bg-ink" />
                {kit.name}
                <b className={LV}>Lv.1</b>
              </p>
            ),
        )}
      </div>

      {/* 레벨업! — 무대 가운데. 번쩍 아래에 두어 펑에서 흰 빛에 묻혀 사라지게 한다 */}
      <p
        className="display calm-none absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(2rem,11cqw,5rem)] whitespace-nowrap text-[#ffd166]"
        style={{ opacity: 0, ...r("ev-levelup") }}
        aria-hidden="true"
      >
        레벨업!
      </p>

      <div className="absolute inset-0 bg-white" style={{ opacity: 0, ...r("ev-flash") }} aria-hidden="true" />

      {/* 메시지 박스 — 교구 목소리 */}
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
