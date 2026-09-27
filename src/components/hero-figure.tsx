/*
  히어로 그림 — MYPROBLEM.md 2번(문제)과 6번(천장)을 한 쌍으로 그린다.

  왼쪽: 교구를 갈아타는 커리큘럼. 새 교구마다 초보 단계로 돌아가는 톱니.
  오른쪽: 프로젝트가 쌓이는 커리큘럼. 작품을 거듭할수록 필요한 기술이 늘어나는 계단.

  색은 DESIGN.md 규칙대로 무채색. 오른쪽 계단이 이어지는 점선 하나만 포인트 블루다.
  그 점선은 페이지 아래 문의로 이어지는 "함께 그려 갈 길"이다 (LANDING-PLAN.md).
  스크롤 연출·애니메이션 없음. 처음부터 다 그려져 있다.
*/

const W = 320;
const H = 196;
const BASE = 150; // 바닥선 y
const AXIS_Y = 22; // 축 이름이 서는 y

const label = { fontSize: 12, fill: "var(--color-ink-soft)" } as const;
const caption = { fontSize: 11, fill: "var(--color-ink-faint)" } as const;

/** 왼쪽 — 교구마다 처음으로 돌아가는 톱니 */
function Sawtooth() {
  const teeth = ["로봇 A", "로봇 B", "새 교구"];
  const tw = 86; // 톱니 하나의 너비
  const x0 = 24;
  const peak = 78; // 톱니가 올라가는 높이 한계 (초보 단계 천장)
  const d = teeth
    .map((_, i) => {
      const x = x0 + i * tw;
      return `${i === 0 ? "M" : "L"} ${x} ${BASE} L ${x + tw - 8} ${peak} L ${x + tw} ${BASE}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="fig-a-title fig-a-desc">
      <title id="fig-a-title">교구를 갈아타는 커리큘럼</title>
      <desc id="fig-a-desc">
        로봇 A, 로봇 B, 새 교구를 차례로 도입할 때마다 실력 곡선이 초보 단계 천장까지 올라갔다가 다시
        바닥으로 떨어지는 톱니 모양. 학생은 자라는데 교재는 매번 처음으로 돌아간다.
      </desc>
      {/* 초보 단계 천장 */}
      <line x1={x0} y1={peak} x2={W - 16} y2={peak} stroke="var(--color-separator)" strokeWidth="1" strokeDasharray="3 4" />
      <text x={W - 16} y={peak - 6} textAnchor="end" {...caption}>
        초보 단계 천장
      </text>
      {/* 바닥 */}
      <line x1={x0} y1={BASE} x2={W - 16} y2={BASE} stroke="var(--color-fill-strong)" strokeWidth="1" />
      {/* 톱니 */}
      <path d={d} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
      {teeth.map((t, i) => (
        <text key={t} x={x0 + i * tw + tw / 2} y={BASE + 20} textAnchor="middle" {...label}>
          {t}
        </text>
      ))}
      {teeth.map((t, i) => (
        <text key={`${t}-m`} x={x0 + i * tw + tw / 2} y={BASE + 36} textAnchor="middle" {...caption}>
          1~6개월
        </text>
      ))}
      {/* 학생의 실력 축 */}
      <text x={x0} y={AXIS_Y} {...caption}>
        학생의 실력
      </text>
    </svg>
  );
}

/** 오른쪽 — 작품이 쌓일수록 올라가는 계단 */
function Stairs() {
  const steps = ["첫 게임", "배포", "저장", "로그인", "내 문제"];
  const sw = 54; // 계단 하나의 너비
  const sh = 20; // 계단 하나의 높이
  const x0 = 24;
  const y0 = BASE;
  let d = `M ${x0} ${y0}`;
  steps.forEach((_, i) => {
    const x = x0 + i * sw;
    const y = y0 - i * sh;
    d += ` L ${x} ${y - sh} L ${x + sw} ${y - sh}`;
  });
  const endX = x0 + steps.length * sw;
  const endY = y0 - steps.length * sh;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="fig-b-title fig-b-desc">
      <title id="fig-b-title">프로젝트가 쌓이는 커리큘럼</title>
      <desc id="fig-b-desc">
        첫 게임, 배포, 저장, 로그인, 내 문제 해결로 이어지는 계단. 작품을 거듭할수록 필요한 기술이
        늘어나며 실력 곡선이 계속 올라가고, 마지막 계단 뒤로 다음 단계가 점선으로 열려 있다.
      </desc>
      <line x1={x0} y1={BASE} x2={W - 16} y2={BASE} stroke="var(--color-fill-strong)" strokeWidth="1" />
      <path d={d} fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
      {/* 다음 단계 — 아직 그려지지 않은 길 */}
      <path
        d={`M ${endX} ${endY} L ${endX} ${endY - sh} L ${W - 8} ${endY - sh}`}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeDasharray="4 5"
        strokeLinejoin="round"
      />
      {steps.map((s, i) => (
        <text key={s} x={x0 + i * sw + sw / 2} y={BASE + 20} textAnchor="middle" {...label}>
          {s}
        </text>
      ))}
      <text x={x0} y={BASE + 36} {...caption}>
        작품 1
      </text>
      <text x={endX - 4} y={BASE + 36} textAnchor="end" {...caption}>
        작품 N
      </text>
      <text x={x0} y={AXIS_Y} {...caption}>
        학생의 실력
      </text>
    </svg>
  );
}

export function HeroFigure() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <figure className="card p-5 md:p-6">
        <figcaption className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
          교구를 갈아타는 커리큘럼
          <span className="mt-1 block text-[0.8125rem] font-normal text-ink-soft">
            새 교구를 들일 때마다 초보 단계로 돌아갑니다
          </span>
        </figcaption>
        <div className="mt-4">
          <Sawtooth />
        </div>
      </figure>
      <figure className="card p-5 md:p-6">
        <figcaption className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
          프로젝트가 쌓이는 커리큘럼
          <span className="mt-1 block text-[0.8125rem] font-normal text-ink-soft">
            작품을 거듭할수록 필요한 기술이 늘어납니다
          </span>
        </figcaption>
        <div className="mt-4">
          <Stairs />
        </div>
      </figure>
    </div>
  );
}
