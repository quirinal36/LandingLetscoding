/*
 * 렛츠코딩 — REEL 2026
 *
 * 15초 · 8씬 · 128 BPM. 씬 하나가 4박(1마디 = 1.875초)이다.
 *
 * 모든 프레임은 시간 t의 순수 함수다. render(t)를 부르면 어느 시점이든 같은 그림이 나온다.
 * 그래서 브라우저 미리보기(requestAnimationFrame)와 MP4 익스포트(프레임 단위 캡처)가
 * 같은 코드를 쓰고, 익스포트는 기계 속도와 상관없이 60fps로 정확하다.
 *
 * 문구는 랜딩페이지(src/app/page.tsx)에 이미 쓰인 것만 가져왔다. 수치는 그 파일의
 * PROOF(2026.4.6–8.22 등록분, 2026.8.24 운영 DB 집계)에 있는 값만 쓴다.
 */
(function (root) {
  'use strict';

  /* ── 박자 ──────────────────────────────────────────────── */
  const BPM = 128;
  const BEAT = 60 / BPM; // 0.46875초
  const BAR = BEAT * 4; // 1.875초 — 씬 하나의 길이
  const FPS = 60;
  const SCENE_COUNT = 8;
  const DURATION = BAR * SCENE_COUNT; // 15초

  /* ── 색 ───────────────────────────────────────────────────
     브랜드 토큰(src/app/globals.css)에 파이썬 옐로 하나를 더했다.
     파랑 + 노랑은 파이썬 로고의 두 색이기도 하다. */
  const C = {
    blue: '#3b6fe0', // --color-accent
    blueDeep: '#2d57b8', // --color-accent-deep
    blueLight: '#8fb0f7',
    ink: '#1b2333', // --color-ink
    night: '#0c111d',
    paper: '#e9edf3', // --color-bg
    white: '#ffffff',
    yellow: '#ffd43b',
  };
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const RGB = Object.fromEntries(Object.entries(C).map(([k, v]) => [k, hex(v)]));

  /* ── 글꼴 ──────────────────────────────────────────────────
     Pretendard(브랜드 서체) · IBM Plex Mono(브랜드 모노) · IBM Plex Serif Italic(강조 한 가지) */
  const FONT = {
    sans: '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", system-ui, sans-serif',
    mono: '"IBM Plex Mono", "Pretendard Variable", ui-monospace, monospace',
    serif: '"IBM Plex Serif", "Pretendard Variable", Georgia, serif',
  };

  /* ── 문구 ─────────────────────────────────────────────────
     바꿀 때는 여기만 고치면 된다. 레이아웃은 글자 폭을 재서 맞춘다. */
  const COPY = {
    hudLeft: "LET'S CODING — REEL 2026",
    hudRight: '2026 · 60 FPS · 128 BPM',
    s1: {
      lines: ['WHY', 'CODE?'], // 가로 화면에서는 한 줄로 붙는다
      accent: 'in the age of AI',
      ko: 'AI가 코딩 다 해주는데, 코딩을 왜 배워요?',
    },
    s2: { word: 'IDEA', ko: 'AI가 대신 못 하는 것을 시킵니다' },
    s3: [
      { ko: '정하고', en: 'PLAN' },
      { ko: '만들고', en: 'MAKE' },
      { ko: '내놓고', en: 'SHIP' },
      { ko: '고치고', en: 'ITERATE' },
    ],
    s4: { word: 'LOUNGE', ko: '학생 작품이 사라지지 않는 학원' },
    s5: { word: 'grow.', ko: '진도표 대신, 성장을 보여 줍니다' },
    s6: {
      value: 196,
      unit: 'STUDENT WORKS',
      ko: '학생 44명이 4개월 반 동안 올린 작품',
      note: '렛츠코딩앤플레이 · 2026.4.6–8.22 등록분',
    },
    s7: { word: "LET'S CODE", sub: '2026' },
    s8: {
      wordmark: '렛츠코딩',
      pillars: 'CURRICULUM · LOUNGE · PYTHON',
      tagline: 'AI 시대의 코딩 커리큘럼, 원장님 혼자 고민하지 마세요.',
      cta: '4주 무료 파일럿 · CONTACT@LETSCODING.KR',
    },
  };

  /* ── 수학 ──────────────────────────────────────────────── */
  const TAU = Math.PI * 2;
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a)); // 구간 [a, b]를 0→1로
  const smoothstep = (a, b, x) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };

  const EASE = {
    linear: (t) => t,
    inCubic: (t) => t * t * t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    outBack: (t) => {
      const c1 = 1.70158;
      return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    outElastic: (t) =>
      t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (TAU / 3)) + 1,
    outBounce: (t) => {
      const n = 7.5625;
      const d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
      return n * (t -= 2.625 / d) * t + 0.984375;
    },
  };

  /** 감쇠 스프링. 0에서 출발해 1을 지나쳤다가 1로 가라앉는다. */
  const spring = (p, damp, freq) => (p <= 0 ? 0 : 1 - Math.exp(-damp * p) * Math.cos(freq * p));

  /** 정수 → [0, 1). 같은 입력이면 늘 같은 값 — 프레임마다 흔들리지 않는 난수. */
  function hash(n) {
    let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b);
    x ^= x >>> 13;
    x = Math.imul(x, 0xc2b2ae35);
    x ^= x >>> 16;
    return (x >>> 0) / 4294967296;
  }
  function rng(seed) {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── 캔버스 도구 ────────────────────────────────────────── */
  const buffers = new Map();
  /** 이름 붙은 오프스크린 캔버스. 크기가 바뀌면 다시 잡는다. */
  function buffer(key, W, H) {
    let b = buffers.get(key);
    if (!b) {
      const c = document.createElement('canvas');
      b = { c, ctx: c.getContext('2d') };
      buffers.set(key, b);
    }
    if (b.c.width !== W || b.c.height !== H) {
      b.c.width = W;
      b.c.height = H;
    }
    reset(b.ctx);
    return b;
  }
  function reset(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.setLineDash([]);
  }

  function frame(W, H) {
    return { W, H, u: Math.min(W, H) / 1080, portrait: H > W, diag: Math.hypot(W, H) };
  }

  function font(ctx, weight, size, family, style) {
    ctx.font = `${style || 'normal'} ${weight} ${Math.max(1, size).toFixed(2)}px ${family}`;
  }
  /** maxW 안에 들어가는 가장 큰 글자 크기(maxSize 이하). */
  function fit(ctx, text, weight, family, maxW, maxSize, style) {
    font(ctx, weight, 100, family, style);
    const w = ctx.measureText(text).width || 1;
    return Math.min(maxSize, (100 * maxW) / w);
  }
  /** 글자별 x 위치. 앞 글자까지의 폭을 재므로 커닝이 반영된다. */
  function glyphs(ctx, text) {
    const list = [];
    let acc = '';
    for (const ch of Array.from(text)) {
      list.push({ ch, x: ctx.measureText(acc).width, w: ctx.measureText(ch).width });
      acc += ch;
    }
    return { list, width: ctx.measureText(text).width };
  }
  /** 자간을 직접 준다(canvas letterSpacing을 못 쓰는 브라우저 대비). */
  function trackedWidth(ctx, text, tracking) {
    let w = 0;
    for (const ch of Array.from(text)) w += ctx.measureText(ch).width + tracking;
    return Math.max(0, w - tracking);
  }
  function drawTracked(ctx, text, x, y, tracking, align) {
    const total = trackedWidth(ctx, text, tracking);
    let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
    const prev = ctx.textAlign;
    ctx.textAlign = 'left';
    for (const ch of Array.from(text)) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + tracking;
    }
    ctx.textAlign = prev;
    return total;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawGrid(ctx, f, step, color, lw) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath();
    const ox = (f.W % step) / 2;
    const oy = (f.H % step) / 2;
    for (let x = ox; x <= f.W; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, f.H);
    }
    for (let y = oy; y <= f.H; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(f.W, y);
    }
    ctx.stroke();
    ctx.restore();
  }
  /** 브랜드 마크 — 실행 화살표(src/components/brand.tsx와 같은 path). progress로 그려 나간다. */
  function chevron(ctx, x, y, size, color, progress) {
    if (progress <= 0) return;
    const s = size / 16;
    const len = 2 * Math.hypot(4.75, 4.75);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.25;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([len * progress, len]);
    ctx.beginPath();
    ctx.moveTo(5.5, 3.25);
    ctx.lineTo(10.25, 8);
    ctx.lineTo(5.5, 12.75);
    ctx.stroke();
    ctx.restore();
  }
  const blinkOn = (t) => Math.floor(t / (BEAT / 2)) % 2 === 0; // 8분음표마다 깜빡

  /* ── 글리치 ────────────────────────────────────────────── */
  /** 가로 띠를 잘라 좌우로 민다. amt 0→1. */
  function sliceGlitch(ctx, src, f, amt, seed) {
    const { W, H, u } = f;
    ctx.drawImage(src, 0, 0);
    if (amt <= 0) return;
    const r = rng(seed * 7919 + 1);
    let y = 0;
    while (y < H) {
      const h = Math.min(H - y, (0.02 + r() * 0.1) * H);
      if (r() < 0.7) {
        const dx = Math.round((r() - 0.5) * 2 * amt * W * 0.2);
        ctx.drawImage(src, 0, y, W, h, dx, y, W, h);
        if (dx > 0) ctx.drawImage(src, W - dx, y, dx, h, 0, y, dx, h);
        else if (dx < 0) ctx.drawImage(src, 0, y, -dx, h, W + dx, y, -dx, h);
      }
      y += h;
    }
    const bars = Math.floor(amt * 7);
    for (let i = 0; i < bars; i++) {
      ctx.fillStyle = [C.yellow, C.blue, C.white][i % 3];
      ctx.globalAlpha = 0.5 + r() * 0.4;
      ctx.fillRect(r() * W * 0.6, r() * H, (0.1 + r() * 0.4) * W, (1 + r() * 5) * u);
    }
    ctx.globalAlpha = 1;
  }
  /** RGB 채널을 갈라 좌우로 민다. amt 0→1. */
  function rgbSplit(ctx, src, f, amt) {
    const { W, H } = f;
    const off = amt * 18 * f.u;
    if (off < 0.5) {
      ctx.drawImage(src, 0, 0);
      return;
    }
    const layers = [
      [buffer('rgb-r', W, H), '#ff0000', -off, 0],
      [buffer('rgb-g', W, H), '#00ff00', 0, off * 0.35],
      [buffer('rgb-b', W, H), '#0000ff', off, 0],
    ];
    for (const [b, col] of layers) {
      b.ctx.drawImage(src, 0, 0);
      b.ctx.globalCompositeOperation = 'multiply';
      b.ctx.fillStyle = col;
      b.ctx.fillRect(0, 0, W, H);
      b.ctx.globalCompositeOperation = 'source-over';
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const [b, , dx, dy] of layers) ctx.drawImage(b.c, dx, dy);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ════════════════════════════════════════════════════════
     01 WHY CODE — 키네틱 타이포
     엔드카드의 노란 선이 갈라지며 파란 면이 열리고, 글자가 하나씩 떨어져 스프링으로 착지한다.
     ════════════════════════════════════════════════════════ */
  const S1 = {
    label: 'WHY CODE',
    tone: () => 'w',
    draw(ctx, f, lt) {
      const out = prog(lt, BAR - 0.21, BAR);
      if (out <= 0) return s1Paint(ctx, f, lt);
      const b = buffer('s1', f.W, f.H);
      s1Paint(b.ctx, f, lt);
      sliceGlitch(ctx, b.c, f, EASE.inCubic(out), Math.floor(lt * FPS));
    },
  };

  function s1Paint(ctx, f, lt) {
    const { W, H, u, portrait } = f;

    // ① 인트로: 가운데 노란 선이 위아래로 갈라지며 파란 면이 열린다
    ctx.fillStyle = C.ink;
    ctx.fillRect(0, 0, W, H);
    const open = EASE.inOutCubic(prog(lt, 0.02, 0.24));
    const half = (H / 2 + 4 * u) * open;
    ctx.fillStyle = C.blue;
    ctx.fillRect(0, H / 2 - half, W, half * 2);
    if (open < 1) {
      const lw = 4 * u;
      ctx.fillStyle = C.yellow;
      ctx.fillRect(0, H / 2 - half - lw / 2, W, lw);
      ctx.fillRect(0, H / 2 + half - lw / 2, W, lw);
    }

    // ② 글자 낙하 — 16분음표 간격으로 한 글자씩
    const lines = portrait ? COPY.s1.lines : [COPY.s1.lines.join(' ')];
    const maxW = W * (portrait ? 0.84 : 0.8);
    const maxS = H * (portrait ? 0.17 : 0.3);
    const size = Math.min(...lines.map((l) => fit(ctx, l, 900, FONT.sans, maxW, maxS)));
    font(ctx, 900, size, FONT.sans);
    const lineGap = size * 0.98;
    const base0 = portrait ? H * 0.42 : H * 0.53;
    ctx.textAlign = 'center';
    let k = 0;
    let lastBase = base0;
    lines.forEach((line, li) => {
      const g = glyphs(ctx, line);
      const x0 = W / 2 - g.width / 2;
      const base = base0 + li * lineGap;
      lastBase = base;
      for (const gl of g.list) {
        if (gl.ch === ' ') continue;
        const start = 0.2 + k * 0.085;
        const seed = hash(k * 131 + 17);
        k++;
        const p = prog(lt, start, start + 0.6);
        if (p <= 0) continue;
        const cx = x0 + gl.x + gl.w / 2;
        const D = base + size * 0.2; // 화면 위에서 출발
        const y = base - (1 - spring(p, 9, 11)) * D;
        const rot = (seed - 0.5) * 1.2 * Math.exp(-6 * p) * Math.cos(10 * p);
        const land = p - 0.143; // 스프링이 처음 바닥에 닿는 순간
        const squash = land > 0 ? Math.exp(-18 * land) : 0;
        ctx.save();
        ctx.translate(cx, y);
        ctx.rotate(rot);
        ctx.scale(1 + 0.1 * squash, 1 - 0.14 * squash);
        ctx.fillStyle = C.white;
        ctx.fillText(gl.ch, 0, 0);
        ctx.restore();

        // 착지 링
        const t0 = start + 0.143 * 0.6;
        const ring = prog(lt, t0, t0 + 0.32);
        if (ring > 0 && ring < 1) {
          const rx = gl.w * (0.3 + 0.55 * EASE.outCubic(ring));
          ctx.save();
          ctx.globalAlpha = 1 - ring;
          ctx.strokeStyle = C.yellow;
          ctx.lineWidth = 2.5 * u;
          ctx.beginPath();
          ctx.ellipse(cx, base + size * 0.03, rx, rx * 0.17, 0, 0, TAU);
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    // ③ 세리프 이탤릭 한 줄 + 궤도 타원
    const aSize = size * (portrait ? 0.36 : 0.3);
    font(ctx, 500, aSize, FONT.serif, 'italic');
    const aText = COPY.s1.accent;
    const aw = ctx.measureText(aText).width;
    const ay = lastBase + aSize * 1.15;
    const rev = EASE.outCubic(prog(lt, 0.86, 1.18));
    if (rev > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(W / 2 - aw / 2 - 24 * u, ay - aSize * 1.1, (aw + 48 * u) * rev, aSize * 1.5);
      ctx.clip();
      ctx.fillStyle = C.yellow;
      ctx.textAlign = 'center';
      ctx.fillText(aText, W / 2, ay + (1 - rev) * 18 * u);
      ctx.restore();
    }
    const orb = prog(lt, 0.98, 1.55);
    if (orb > 0) {
      const a0 = -2.4;
      const sweep = TAU * EASE.inOutCubic(orb);
      const ox = W / 2;
      const oy = ay - aSize * 0.32;
      const rx = aw * 0.6;
      const ry = aSize * 0.5;
      const tilt = -0.07;
      ctx.save();
      ctx.strokeStyle = C.yellow;
      ctx.fillStyle = C.yellow;
      ctx.lineWidth = 2 * u;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.ellipse(ox, oy, rx, ry, tilt, a0, a0 + sweep);
      ctx.stroke();
      const ha = a0 + sweep;
      const ex = rx * Math.cos(ha);
      const ey = ry * Math.sin(ha);
      ctx.beginPath();
      ctx.arc(
        ox + ex * Math.cos(tilt) - ey * Math.sin(tilt),
        oy + ex * Math.sin(tilt) + ey * Math.cos(tilt),
        4.5 * u,
        0,
        TAU,
      );
      ctx.fill();
      ctx.restore();
    }

    // ④ 학부모님 질문 — 타자 치듯
    const koSize = (portrait ? 36 : 32) * u;
    font(ctx, 600, koSize, FONT.sans);
    const ko = Array.from(COPY.s1.ko);
    const kw = ctx.measureText(COPY.s1.ko).width;
    const n = Math.floor(ko.length * prog(lt, 1.08, 1.48));
    const shown = ko.slice(0, n).join('');
    const ky = ay + aSize * 0.55 + koSize * 1.7;
    const kx = W / 2 - kw / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(shown, kx, ky);
    if (lt > 1.02 && (lt < 1.48 || blinkOn(lt))) {
      ctx.fillStyle = C.yellow;
      ctx.fillRect(kx + ctx.measureText(shown).width + 4 * u, ky - koSize * 0.82, koSize * 0.46, koSize);
    }
  }

  /* ════════════════════════════════════════════════════════
     02 IDEA — 파티클
     폭발 → 소용돌이 → 글자 모양으로 수렴 → 가로로 번지며 퇴장.
     위치는 시간의 해석적 함수라서 어느 프레임이든 바로 계산된다(시뮬레이션 누적 없음).
     ════════════════════════════════════════════════════════ */
  const s2Cache = new Map();
  function s2System(f) {
    const key = f.W + 'x' + f.H;
    if (s2Cache.has(key)) return s2Cache.get(key);
    const { W, H, u, portrait } = f;
    const b = buffer('s2-sample', W, H);
    const c = b.ctx;
    c.clearRect(0, 0, W, H);
    const word = COPY.s2.word;
    const size = fit(c, word, 900, FONT.sans, W * (portrait ? 0.84 : 0.62), H * (portrait ? 0.2 : 0.36));
    font(c, 900, size, FONT.sans);
    c.textAlign = 'center';
    c.fillStyle = '#fff';
    const base = H * 0.47 + size * 0.36;
    c.fillText(word, W / 2, base);
    const data = c.getImageData(0, 0, W, H).data;
    const step = Math.max(2, Math.round(6 * u));
    const targets = [];
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 140) targets.push([x, y]);
      }
    }
    const r = rng(2026);
    for (let i = targets.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      const tmp = targets[i];
      targets[i] = targets[j];
      targets[j] = tmp;
    }
    const palette = [C.yellow, C.yellow, C.blue, C.blueLight, C.white];
    const widths = [2.2 * u, 3.4 * u];
    const N = targets.length + Math.round(targets.length * 0.3);
    const P = [];
    const groups = new Map();
    for (let i = 0; i < N; i++) {
      const t = targets[i];
      const p = {
        a: r() * TAU,
        R: (0.08 + Math.pow(r(), 0.6) * 0.95) * f.diag * 0.5,
        spin: 1.3 + r() * 1.3,
        delay: r() * 0.16,
        ph: r() * TAU,
        sm: r(),
        tx: t ? t[0] + (r() - 0.5) * step * 0.6 : null,
        ty: t ? t[1] + (r() - 0.5) * step * 0.6 : null,
      };
      P.push(p);
      const ci = Math.floor(r() * palette.length);
      const wi = r() < 0.7 ? 0 : 1;
      const gk = `${ci}|${wi}|${t ? 0 : 1}`;
      if (!groups.has(gk)) groups.set(gk, { color: palette[ci], width: widths[wi], ambient: !t, idx: [] });
      groups.get(gk).idx.push(i);
    }
    const sys = { P, batches: [...groups.values()], base, size };
    s2Cache.set(key, sys);
    return sys;
  }

  function s2Pos(p, f, lt, out) {
    const { W, H, u } = f;
    const burst = EASE.outExpo(prog(lt, 0, 0.75));
    let r = p.R * (0.03 + 0.97 * burst);
    const sw = EASE.inOutCubic(prog(lt, 0.42, 1.3));
    const ang = p.a + sw * p.spin;
    r *= 1 - 0.3 * sw;
    let x = W / 2 + Math.cos(ang) * r;
    let y = H / 2 + Math.sin(ang) * r * 0.82;
    if (p.tx !== null) {
      const c = EASE.inOutCubic(prog(lt, 0.98 + p.delay, 1.38 + p.delay));
      x = lerp(x, p.tx, c);
      y = lerp(y, p.ty, c);
      if (c >= 1) {
        x += Math.sin(lt * 9 + p.ph) * 0.9 * u;
        y += Math.cos(lt * 7 + p.ph) * 0.9 * u;
      }
    }
    out[0] = x;
    out[1] = y;
  }

  const S2 = {
    label: 'IDEA',
    tone: () => 'w',
    draw(ctx, f, lt) {
      const { W, H, u, portrait } = f;
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, f.diag * 0.55);
      g.addColorStop(0, '#1a2a5c');
      g.addColorStop(0.5, '#10183a');
      g.addColorStop(1, C.night);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const sys = s2System(f);

      // 컷 순간의 링 플래시
      const ring = prog(lt, 0, 0.3);
      if (ring < 1) {
        ctx.save();
        ctx.globalAlpha = 1 - ring;
        ctx.strokeStyle = C.yellow;
        ctx.lineWidth = lerp(10, 1, ring) * u;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, lerp(0.05, 0.75, EASE.outExpo(ring)) * H, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }

      const smear = EASE.inExpo(prog(lt, 1.6, 1.86));
      const ambient = 1 - prog(lt, 0.95, 1.3);
      const a = [0, 0];
      const b = [0, 0];
      const maxL = 160 * u;
      ctx.lineCap = 'square';
      for (const bt of sys.batches) {
        const alpha = bt.ambient ? ambient : 1;
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = bt.color;
        ctx.lineWidth = bt.width;
        ctx.beginPath();
        for (const i of bt.idx) {
          const p = sys.P[i];
          s2Pos(p, f, lt, a);
          s2Pos(p, f, lt - 0.022, b); // 꼬리 = 조금 전 위치 → 모션 블러
          const dx = a[0] - b[0];
          const dy = a[1] - b[1];
          const len = Math.hypot(dx, dy);
          if (len > maxL) {
            b[0] = a[0] - (dx / len) * maxL;
            b[1] = a[1] - (dy / len) * maxL;
          }
          if (smear > 0) {
            a[1] = H / 2 + (a[1] - H / 2) * (1 - 0.82 * smear);
            b[1] = a[1];
            b[0] = a[0] - smear * (0.05 + p.sm * 0.45) * W * (p.sm > 0.5 ? 1 : -1);
          }
          ctx.moveTo(b[0], b[1]);
          ctx.lineTo(a[0] + 0.01, a[1]);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const subA = prog(lt, 1.28, 1.48) * (1 - prog(lt, 1.6, 1.68));
      if (subA > 0) {
        font(ctx, 600, (portrait ? 36 : 32) * u, FONT.sans);
        ctx.globalAlpha = subA * 0.92;
        ctx.fillStyle = C.white;
        ctx.textAlign = 'center';
        ctx.fillText(COPY.s2.ko, W / 2, sys.base + (portrait ? 110 : 92) * u + (1 - subA) * 10 * u);
        ctx.globalAlpha = 1;
      }
    },
  };

  /* ════════════════════════════════════════════════════════
     03 PLAN · MAKE · SHIP · ITERATE — 셰이프 모프 + 이징 그래프
     한 박자마다 배경색이 바뀌고 도형이 다음 도형으로 변한다. 지난 프레임의 외곽선이 잔상으로 남는다.
     ════════════════════════════════════════════════════════ */
  const M = 240; // 극좌표 샘플 수
  const S3_BEATS = [
    { bg: C.blue, grid: 'rgba(255,255,255,0.10)', fill: C.yellow, line: 'rgba(255,255,255,0.65)', text: C.white, shape: 'squircle', rot: 0, ease: 'outBack', easeLabel: 'easeOutBack' },
    { bg: C.paper, grid: 'rgba(27,35,51,0.08)', fill: C.blue, line: 'rgba(27,35,51,0.5)', text: C.ink, shape: 'triangle', rot: TAU / 3, ease: 'outElastic', easeLabel: 'easeOutElastic' },
    { bg: C.yellow, grid: 'rgba(27,35,51,0.09)', fill: C.ink, line: 'rgba(27,35,51,0.55)', text: C.ink, shape: 'flower', rot: TAU / 3 + Math.PI / 8, ease: 'outBounce', easeLabel: 'easeOutBounce' },
    { bg: C.ink, grid: 'rgba(255,255,255,0.07)', fill: C.blue, line: 'rgba(255,255,255,0.5)', text: C.white, shape: 'circle', rot: TAU / 3 + Math.PI / 4, ease: 'outElastic', easeLabel: 'easeOutElastic' },
  ];

  function smoothRing(r, w, passes) {
    const tmp = new Float32Array(r.length);
    for (let pass = 0; pass < passes; pass++) {
      for (let i = 0; i < r.length; i++) {
        let s = 0;
        for (let k = -w; k <= w; k++) s += r[(i + k + r.length) % r.length];
        tmp[i] = s / (2 * w + 1);
      }
      r.set(tmp);
    }
  }
  const RADII = (() => {
    const make = (fn, smoothW) => {
      const r = new Float32Array(M);
      for (let i = 0; i < M; i++) r[i] = fn((i / M) * TAU);
      if (smoothW) smoothRing(r, smoothW, 2);
      return r;
    };
    return {
      circle: make(() => 0.92),
      squircle: make((th) => {
        const n = 5;
        return 0.82 * Math.pow(Math.pow(Math.abs(Math.cos(th)), n) + Math.pow(Math.abs(Math.sin(th)), n), -1 / n);
      }, 1),
      triangle: make((th) => {
        const k = 3;
        const seg = TAU / k;
        const ph = (((th - Math.PI / 2) % seg) + seg) % seg; // 꼭짓점이 아래(π/2)
        return (1.12 * Math.cos(Math.PI / k)) / Math.cos(ph - Math.PI / k);
      }, 6),
      flower: make((th) => 0.9 * (1 + 0.22 * Math.cos(8 * th))),
    };
  })();

  function s3Shape(t) {
    const k = Math.min(3, Math.floor(t / BEAT));
    const cfg = S3_BEATS[k];
    const q = clamp((t - k * BEAT) / BEAT);
    const pe = clamp(q / 0.78); // 박자의 78% 안에 자리 잡는다
    const e = EASE[cfg.ease](pe);
    const to = RADII[cfg.shape];
    const radii = new Float32Array(M);
    const prev = S3_BEATS[k - 1];
    if (!prev) {
      radii.set(to);
      return { radii, rot: lerp(cfg.rot - 1.4, cfg.rot, e), scale: Math.max(0, e), q: pe, e };
    }
    const from = RADII[prev.shape];
    for (let i = 0; i < M; i++) radii[i] = Math.max(0.05, from[i] + (to[i] - from[i]) * e);
    return { radii, rot: lerp(prev.rot, cfg.rot, e), scale: 1, q: pe, e };
  }

  function shapePath(ctx, cx, cy, R, radii, rot) {
    ctx.beginPath();
    for (let i = 0; i <= M; i++) {
      const j = i % M;
      const th = (j / M) * TAU + rot;
      const r = radii[j] * R;
      const x = cx + Math.cos(th) * r;
      const y = cy + Math.sin(th) * r;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.closePath();
  }

  function drawEaseWidget(ctx, f, k, q, e) {
    const { W, H, u, portrait } = f;
    const cfg = S3_BEATS[k];
    const it = COPY.s3[k];
    const x = portrait ? W * 0.09 : W * 0.06;
    const y = portrait ? H * 0.67 : H * 0.57;
    const ga = ctx.globalAlpha;
    ctx.fillStyle = cfg.text;
    ctx.strokeStyle = cfg.text;
    ctx.textAlign = 'left';
    font(ctx, 800, (portrait ? 66 : 62) * u, FONT.sans);
    ctx.fillText(`${it.ko} ${it.en}`, x, y);
    font(ctx, 500, (portrait ? 20 : 18) * u, FONT.mono);
    ctx.globalAlpha = ga * 0.85;
    ctx.fillText(`${cfg.easeLabel}   t ${q.toFixed(2)}   v ${e.toFixed(2)}`, x, y + 40 * u);

    const bw = (portrait ? 340 : 330) * u;
    const bh = (portrait ? 180 : 170) * u;
    const bx = x;
    const by = y + 62 * u;
    ctx.globalAlpha = ga * 0.9;
    ctx.lineWidth = 1.5 * u;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.globalAlpha = ga * 0.25;
    ctx.lineWidth = u;
    ctx.beginPath();
    for (let i = 1; i < 4; i++) {
      ctx.moveTo(bx + (bw * i) / 4, by);
      ctx.lineTo(bx + (bw * i) / 4, by + bh);
    }
    for (let j = 1; j < 3; j++) {
      ctx.moveTo(bx, by + (bh * j) / 3);
      ctx.lineTo(bx + bw, by + (bh * j) / 3);
    }
    ctx.stroke();
    const vy = (v) => by + bh - ((v + 0.2) / 1.6) * bh;
    ctx.globalAlpha = ga * 0.5;
    ctx.setLineDash([4 * u, 4 * u]);
    ctx.beginPath();
    ctx.moveTo(bx, vy(1));
    ctx.lineTo(bx + bw, vy(1));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = ga;
    ctx.lineWidth = 2.2 * u;
    ctx.beginPath();
    const fn = EASE[cfg.ease];
    for (let s = 0; s <= 80; s++) {
      const xx = bx + (bw * s) / 80;
      const yy = vy(fn(s / 80));
      if (s) ctx.lineTo(xx, yy);
      else ctx.moveTo(xx, yy);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bx + bw * q, vy(e), 5.5 * u, 0, TAU);
    ctx.fill();
  }

  const S3 = {
    label: 'PLAN · MAKE · SHIP',
    tone(lt) {
      const k = Math.min(3, Math.floor(lt / BEAT));
      return k === 0 || k === 3 ? 'w' : 'k';
    },
    draw(ctx, f, lt) {
      const { W, H, u, portrait } = f;
      const k = Math.min(3, Math.floor(lt / BEAT));
      const cfg = S3_BEATS[k];
      ctx.fillStyle = cfg.bg;
      ctx.fillRect(0, 0, W, H);
      drawGrid(ctx, f, 60 * u, cfg.grid, Math.max(1, u));

      // 마지막 도형(원)이 화면을 덮으며 다음 씬의 바탕이 된다
      const exp = EASE.inExpo(prog(lt, BAR - 0.24, BAR - 0.02));
      const sx = portrait ? W * 0.5 : W * 0.63;
      const sy = portrait ? H * 0.37 : H * 0.49;
      const cx = lerp(sx, W / 2, exp);
      const cy = lerp(sy, H / 2, exp);
      const R = lerp(portrait ? W * 0.3 : H * 0.27, f.diag * 0.7, exp);

      if (exp < 1) {
        ctx.save();
        ctx.strokeStyle = cfg.line;
        ctx.lineWidth = 1.5 * u;
        ctx.globalAlpha = 0.45 * (1 - exp);
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.1, 0, TAU);
        ctx.stroke();
        ctx.restore();
        // 잔상: 45ms 간격으로 지난 모양의 외곽선
        for (let j = 4; j >= 1; j--) {
          const tg = lt - j * 0.045;
          if (tg < 0) continue;
          const st = s3Shape(tg);
          shapePath(ctx, cx, cy, R * st.scale, st.radii, st.rot);
          ctx.strokeStyle = cfg.line;
          ctx.globalAlpha = (1 - j / 5) * (1 - exp);
          ctx.lineWidth = 1.5 * u;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      const st = s3Shape(lt);
      shapePath(ctx, cx, cy, R * st.scale, st.radii, st.rot);
      ctx.fillStyle = cfg.fill;
      ctx.fill();

      const wa = 1 - prog(lt, BAR - 0.24, BAR - 0.14);
      if (wa > 0) {
        ctx.globalAlpha = wa;
        drawEaseWidget(ctx, f, k, st.q, st.e);
        ctx.globalAlpha = 1;
      }
    },
  };

  /* ════════════════════════════════════════════════════════
     04 LOUNGE — 타일 플립 전환
     파란 타일이 왼쪽부터 한 줄씩 뒤집히며 뒷면의 격자 화면을 드러낸다.
     칸마다 [행][열] 인덱스가 붙고, 박자에 맞춰 작품 카드(실행 화살표)가 하나씩 올라온다.
     나갈 때는 가운데부터 타일이 흩어진다.
     ════════════════════════════════════════════════════════ */
  function s4Grid(f) {
    const cols = f.portrait ? 7 : 12;
    const rows = f.portrait ? 12 : 7;
    return { cols, rows, cw: f.W / cols, ch: f.H / rows };
  }
  function s4Works(f) {
    // 글자와 겹치지 않는 칸만 고른다
    return f.portrait
      ? [[2, 1], [9, 5], [3, 5], [10, 1], [1, 3]]
      : [[1, 2], [5, 9], [1, 10], [5, 1], [0, 6]];
  }
  // 격자 · 라벨 · 글자는 움직이지 않으므로 크기별로 한 번만 그려 둔다
  const s4Bases = new Map();
  function s4Base(f) {
    const key = f.W + 'x' + f.H;
    if (s4Bases.has(key)) return s4Bases.get(key);
    const c = document.createElement('canvas');
    c.width = f.W;
    c.height = f.H;
    const ctx = c.getContext('2d');
    const { W, H, u, portrait } = f;
    const { cols, rows, cw, ch } = s4Grid(f);
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(27,35,51,0.3)';
    ctx.lineWidth = Math.max(1, 1.2 * u);
    ctx.beginPath();
    for (let cc = 1; cc < cols; cc++) {
      ctx.moveTo(Math.round(cc * cw) + 0.5, 0);
      ctx.lineTo(Math.round(cc * cw) + 0.5, H);
    }
    for (let r = 1; r < rows; r++) {
      ctx.moveTo(0, Math.round(r * ch) + 0.5);
      ctx.lineTo(W, Math.round(r * ch) + 0.5);
    }
    ctx.stroke();

    font(ctx, 500, 10.5 * u, FONT.mono);
    ctx.fillStyle = 'rgba(27,35,51,0.45)';
    for (let r = 0; r < rows; r++) {
      for (let cc = 0; cc < cols; cc++) ctx.fillText(`[${r}][${cc}]`, cc * cw + 7 * u, r * ch + 17 * u);
    }

    const word = COPY.s4.word;
    const size = fit(ctx, word, 900, FONT.sans, W * (portrait ? 0.86 : 0.72), H * (portrait ? 0.15 : 0.29));
    font(ctx, 900, size, FONT.sans);
    ctx.fillStyle = C.blue;
    ctx.textAlign = 'center';
    const base = portrait ? H * 0.5 : H * 0.55;
    ctx.fillText(word, W / 2, base);
    font(ctx, 700, (portrait ? 42 : 38) * u, FONT.sans);
    ctx.fillStyle = C.ink;
    ctx.fillText(COPY.s4.ko, W / 2, base + (portrait ? 92 : 86) * u);
    s4Bases.set(key, c);
    return c;
  }

  function s4Face(ctx, f, lt) {
    const { u } = f;
    const { cw, ch } = s4Grid(f);
    ctx.drawImage(s4Base(f), 0, 0);

    // 박자(16분음표)마다 작품 카드가 한 장씩 올라온다
    s4Works(f).forEach(([r, c], i) => {
      const t0 = 0.8 + i * (BEAT / 4);
      const p = prog(lt, t0, t0 + 0.18);
      if (p <= 0) return;
      const s = EASE.outBack(p);
      const pad = 8 * u;
      const x = c * cw + pad;
      const y = r * ch + pad;
      const w = cw - pad * 2;
      const h = ch - pad * 2;
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale(s, s);
      ctx.fillStyle = C.white;
      roundRect(ctx, -w / 2, -h / 2, w, h, 14 * u);
      ctx.fill();
      const m = Math.min(w, h) * 0.34;
      ctx.fillStyle = '#e4ebfb';
      roundRect(ctx, -m / 2, -m / 2 - 8 * u, m, m, m * 0.22);
      ctx.fill();
      chevron(ctx, -m * 0.34, -m * 0.34 - 8 * u, m * 0.68, C.blue, prog(lt, t0 + 0.06, t0 + 0.2));
      font(ctx, 500, 10.5 * u, FONT.mono);
      ctx.fillStyle = C.ink;
      ctx.globalAlpha = 0.6;
      ctx.textAlign = 'center';
      ctx.fillText('RUN', 0, m / 2 + 14 * u);
      ctx.restore();
    });
  }

  const S4_OUT = 1.4;
  const S4 = {
    label: 'LOUNGE',
    tone: (lt) => (lt < 0.6 || lt > 1.62 ? 'w' : 'k'),
    draw(ctx, f, lt) {
      const { W, H, portrait } = f;
      const { cols, rows, cw, ch } = s4Grid(f);
      const face = buffer('s4', W, H);
      s4Face(face.ctx, f, lt);
      const delayOf = (r, c) =>
        0.08 + (portrait ? 0.028 * r + 0.012 * c : 0.028 * c + 0.012 * r) + 0.03 * hash(r * 97 + c);
      const FLIP = 0.3;
      const flipEnd = delayOf(rows - 1, cols - 1) + 0.03 + FLIP;
      if (lt >= flipEnd && lt < S4_OUT) {
        ctx.drawImage(face.c, 0, 0);
        return;
      }
      ctx.fillStyle = lt < S4_OUT ? C.ink : C.night;
      ctx.fillRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cw;
          const y = r * ch;
          if (lt < S4_OUT) {
            // 들어올 때: 가로축으로 뒤집기. 앞면(파랑)이 납작해졌다가 뒷면(격자)이 펴진다
            const d = delayOf(r, c);
            const p = prog(lt, d, d + FLIP);
            if (p <= 0) {
              ctx.fillStyle = C.blue;
              ctx.fillRect(x - 0.5, y - 0.5, cw + 1, ch + 1);
              continue;
            }
            if (p >= 1) {
              ctx.drawImage(face.c, x, y, cw, ch, x, y, cw, ch);
              continue;
            }
            const sy = Math.abs(Math.cos(p * Math.PI));
            const hh = ch * sy;
            const yy = y + (ch - hh) / 2;
            if (p < 0.5) {
              ctx.fillStyle = C.blue;
              ctx.fillRect(x, yy, cw, hh);
              ctx.fillStyle = `rgba(12,17,29,${0.6 * p * 2})`;
              ctx.fillRect(x, yy, cw, hh);
            } else {
              ctx.drawImage(face.c, x, y, cw, ch, x, yy, cw, hh);
              ctx.fillStyle = `rgba(12,17,29,${0.5 * (1 - (p - 0.5) * 2)})`;
              ctx.fillRect(x, yy, cw, hh);
            }
          } else {
            // 나갈 때: 가운데 칸부터 작아지며 돌고 바깥으로 흩어진다
            const dx = (x + cw / 2 - W / 2) / (W / 2);
            const dy = (y + ch / 2 - H / 2) / (H / 2);
            const dist = Math.min(1, Math.hypot(dx, dy) / 1.25);
            const d = S4_OUT + 0.18 * dist + 0.04 * hash(r * 31 + c * 7);
            const e = EASE.inCubic(prog(lt, d, d + 0.25));
            const s = 1 - e;
            if (s <= 0.01) continue;
            ctx.save();
            ctx.translate(x + cw / 2 + dx * e * W * 0.12, y + ch / 2 + dy * e * H * 0.12);
            ctx.rotate((hash(r * 13 + c * 57) - 0.5) * 1.4 * e);
            ctx.scale(s, s);
            ctx.drawImage(face.c, x, y, cw, ch, -cw / 2, -ch / 2, cw, ch);
            ctx.restore();
          }
        }
      }
    },
  };

  /* ════════════════════════════════════════════════════════
     05 grow. — 메타볼
     파란 방울이 붙었다 떨어지며 자라다가 화면을 채운다.
     글자는 방울 밖에서는 흰색, 방울 안에서는 노란색(방울 모양으로 마스크).
     ════════════════════════════════════════════════════════ */
  const S5_BALLS = [
    { x: -0.34, y: -0.04, ax: 0.1, ay: 0.08, fx: 0.9, fy: 1.3, r: 0.16, ph: 0.2 },
    { x: 0.3, y: -0.2, ax: 0.08, ay: 0.06, fx: 1.2, fy: 0.8, r: 0.13, ph: 1.7 },
    { x: 0.05, y: 0.22, ax: 0.14, ay: 0.05, fx: 0.7, fy: 1.1, r: 0.15, ph: 3.1 },
    { x: -0.12, y: -0.24, ax: 0.07, ay: 0.09, fx: 1.4, fy: 0.9, r: 0.11, ph: 4.2 },
    { x: 0.42, y: 0.12, ax: 0.06, ay: 0.1, fx: 1.0, fy: 1.5, r: 0.12, ph: 5.3 },
    { x: -0.45, y: 0.24, ax: 0.05, ay: 0.06, fx: 1.6, fy: 1.2, r: 0.09, ph: 0.9 },
    { x: 0.18, y: -0.02, ax: 0.12, ay: 0.12, fx: 0.8, fy: 0.6, r: 0.1, ph: 2.4 },
  ];
  function s5Balls(f, lt) {
    const { W, H, portrait } = f;
    const S = Math.min(W, H);
    const grow =
      (0.3 + 0.7 * EASE.outBack(prog(lt, 0.02, 0.62))) * (1 + 0.22 * EASE.inOutCubic(prog(lt, 0.6, 1.3)));
    const pulse = 1 + 0.07 * Math.exp(-6 * ((lt % BEAT) / BEAT)); // 박자마다 한 번 숨 쉰다
    const tt = lt * 0.9;
    const list = S5_BALLS.map((b, i) => {
      const bx = (portrait ? b.y : b.x) + b.ax * Math.sin(b.fx * Math.PI * tt + b.ph);
      const by = (portrait ? b.x : b.y) + b.ay * Math.cos(b.fy * Math.PI * tt + b.ph * 1.3);
      return {
        x: W / 2 + bx * S * (portrait ? 1 : 1.35),
        y: H / 2 + by * S * (portrait ? 1.35 : 1),
        r: b.r * S * grow * pulse * (1 + 0.1 * Math.sin(tt * 3 + i)),
      };
    });
    const fill = EASE.inCubic(prog(lt, 1.2, 1.72));
    return { list, fill: fill > 0 ? { x: W * 0.56, y: H * 0.46, r: fill * f.diag * 0.62 } : null };
  }
  let s5Img = null;
  function s5Field(f, balls) {
    const DS = 4; // 1/4 해상도로 계산하고 늘린다 — 가장자리가 부드러워진다
    const fw = Math.ceil(f.W / DS);
    const fh = Math.ceil(f.H / DS);
    const b = buffer('s5-field', fw, fh);
    if (!s5Img || s5Img.width !== fw || s5Img.height !== fh) s5Img = b.ctx.createImageData(fw, fh);
    const d = s5Img.data;
    const bl = balls.list.map((o) => ({ x: o.x / DS, y: o.y / DS, r2: (o.r / DS) * (o.r / DS) }));
    const fl = balls.fill ? { x: balls.fill.x / DS, y: balls.fill.y / DS, r2: (balls.fill.r / DS) ** 2 } : null;
    const c0 = RGB.blue;
    const c1 = RGB.blueDeep;
    const c2 = RGB.blueLight;
    let o = 0;
    for (let y = 0; y < fh; y++) {
      const vy = (y / fh) * 0.7;
      const br = lerp(c0[0], c1[0], vy);
      const bgc = lerp(c0[1], c1[1], vy);
      const bb = lerp(c0[2], c1[2], vy);
      for (let x = 0; x < fw; x++, o += 4) {
        let s = 0;
        for (let i = 0; i < bl.length; i++) {
          const dx = x - bl[i].x;
          const dy = y - bl[i].y;
          s += bl[i].r2 / (dx * dx + dy * dy + 0.5);
        }
        let sf = s;
        if (fl) {
          const dx = x - fl.x;
          const dy = y - fl.y;
          sf += fl.r2 / (dx * dx + dy * dy + 0.5);
        }
        if (sf < 0.7) {
          d[o + 3] = 0;
          continue;
        }
        const sh = clamp((s - 1.3) / 3.5) * 0.4; // 방울 중심일수록 밝게
        d[o] = br + (c2[0] - br) * sh;
        d[o + 1] = bgc + (c2[1] - bgc) * sh;
        d[o + 2] = bb + (c2[2] - bb) * sh;
        d[o + 3] = smoothstep(0.84, 1.1, sf) * 255;
      }
    }
    b.ctx.putImageData(s5Img, 0, 0);
    return b.c;
  }
  function s5Text(ctx, f, lt, color) {
    const { W, H, u, portrait } = f;
    const word = COPY.s5.word;
    const size = fit(ctx, word, 500, FONT.serif, W * (portrait ? 0.8 : 0.6), H * (portrait ? 0.24 : 0.42), 'italic');
    font(ctx, 500, size, FONT.serif, 'italic');
    const g = glyphs(ctx, word);
    const base = portrait ? H * 0.53 : H * 0.58;
    const x0 = W / 2 - g.width / 2;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    g.list.forEach((gl, i) => {
      const p = EASE.outCubic(prog(lt, 0.1 + i * 0.06, 0.4 + i * 0.06));
      if (p <= 0) return;
      ctx.globalAlpha = p;
      ctx.fillText(gl.ch, x0 + gl.x, base + (1 - p) * 40 * u);
    });
    const sa = prog(lt, 0.45, 0.7);
    if (sa > 0) {
      font(ctx, 600, (portrait ? 36 : 32) * u, FONT.sans);
      ctx.globalAlpha = sa;
      ctx.textAlign = 'center';
      ctx.fillText(COPY.s5.ko, W / 2, base + (portrait ? 110 : 96) * u);
    }
    ctx.globalAlpha = 1;
  }
  const S5 = {
    label: 'GROW',
    tone: () => 'w',
    draw(ctx, f, lt) {
      const { W, H } = f;
      ctx.fillStyle = C.night;
      ctx.fillRect(0, 0, W, H);
      const field = s5Field(f, s5Balls(f, lt));
      // 1/4 해상도 장을 쌍선형으로 늘린다 — 방울 가장자리가 부드럽게 번진다
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low';
      ctx.drawImage(field, 0, 0, W, H);
      s5Text(ctx, f, lt, C.white);
      const tb = buffer('s5-text', W, H);
      tb.ctx.clearRect(0, 0, W, H);
      s5Text(tb.ctx, f, lt, C.yellow);
      tb.ctx.globalCompositeOperation = 'destination-in';
      tb.ctx.imageSmoothingEnabled = true;
      tb.ctx.imageSmoothingQuality = 'low';
      tb.ctx.drawImage(field, 0, 0, W, H);
      ctx.drawImage(tb.c, 0, 0);
    },
  };

  /* ════════════════════════════════════════════════════════
     06 196 WORKS — 카운터 + 스피로그래프
     숫자가 올라가는 동안 펜이 하이포트로코이드(R=5, r=3, d=5)를 그린다.
     굴러가는 원과 팔을 옅게 보여 줘서 "수식이 패턴이 되는" 과정이 보인다.
     ════════════════════════════════════════════════════════ */
  const HYPO = (() => {
    const n = 1200;
    const R = 5;
    const r = 3;
    const d = 5;
    const T = 6 * Math.PI;
    const pts = new Float32Array((n + 1) * 2);
    const len = new Float32Array(n + 1);
    for (let i = 0; i <= n; i++) {
      const t = (T * i) / n;
      const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
      const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
      pts[i * 2] = y / 7; // -90° 돌려서 뾰족한 끝이 위로
      pts[i * 2 + 1] = -x / 7;
      if (i) len[i] = len[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]);
    }
    return { n, pts, len, total: len[n], T, R, r, d };
  })();
  function hypoAt(s) {
    // 길이 s 지점의 인덱스(이분 탐색)
    const { len, n } = HYPO;
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (len[mid] < s) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  const S6 = {
    label: '196 WORKS',
    tone: () => 'k',
    draw(ctx, f, lt) {
      const { W, H, u, portrait } = f;
      ctx.fillStyle = C.yellow;
      ctx.fillRect(0, 0, W, H);

      // 사인파
      const wy = portrait ? H * 0.86 : H * 0.84;
      const reveal = EASE.outCubic(prog(lt, 0, 0.45));
      const pulse = 1 + 0.5 * Math.exp(-7 * ((lt % BEAT) / BEAT));
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W * reveal, H);
      ctx.clip();
      ctx.strokeStyle = C.ink;
      const waves = [
        [26, 0.42, 0, 3.5, 1],
        [16, 0.3, 1.3, 1.2, 0.55],
        [30, 0.52, 2.1, 1.2, 0.45],
        [12, 0.24, 3.7, 1.2, 0.5],
        [22, 0.36, 4.4, 1.2, 0.4],
      ];
      for (const [amp, wl, ph, lw, al] of waves) {
        ctx.globalAlpha = al;
        ctx.lineWidth = lw * u;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6 * u) {
          const y = wy + Math.sin((x / (W * wl)) * TAU - lt * TAU * 0.9 + ph) * amp * u * pulse;
          if (x) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 카운터
      const x0 = portrait ? W * 0.09 : W * 0.075;
      const base = portrait ? H * 0.27 : H * 0.46;
      const n = Math.round(COPY.s6.value * EASE.outCubic(prog(lt, 0.04, 1.0)));
      ctx.fillStyle = C.ink;
      ctx.textAlign = 'left';
      font(ctx, 700, (portrait ? 0.3 * W : 0.25 * H), FONT.mono);
      ctx.fillText(String(n).padStart(3, '0'), x0 - 6 * u, base);
      font(ctx, 600, (portrait ? 30 : 27) * u, FONT.mono);
      drawTracked(ctx, COPY.s6.unit, x0, base + 64 * u, 0.28 * (portrait ? 30 : 27) * u, 'left');
      font(ctx, 700, (portrait ? 42 : 38) * u, FONT.sans);
      ctx.fillText(COPY.s6.ko, x0, base + 120 * u);
      font(ctx, 500, (portrait ? 17 : 15) * u, FONT.mono);
      ctx.globalAlpha = 0.72;
      ctx.fillText(COPY.s6.note, x0, base + 162 * u);
      ctx.globalAlpha = 1;

      // 스피로그래프
      const cx = portrait ? W * 0.5 : W * 0.69;
      const cy = portrait ? H * 0.58 : H * 0.43;
      const sc = portrait ? W * 0.36 : H * 0.34;
      const head = EASE.inOutSine(prog(lt, 0.05, 1.3)) * HYPO.total;
      const tail = EASE.inOutCubic(prog(lt, 1.12, 1.86)) * HYPO.total;
      const hi = hypoAt(head);
      const ti = hypoAt(tail);
      const P = (i) => [cx + HYPO.pts[i * 2] * sc, cy + HYPO.pts[i * 2 + 1] * sc];

      const guide = prog(lt, 0.05, 0.2) * (1 - prog(lt, 1.2, 1.4));
      if (guide > 0 && hi > 0) {
        // 고정 원(R)과 굴러가는 원(r), 팔(d)
        const t = (HYPO.T * hi) / HYPO.n;
        const k = sc / 7;
        const gx = (HYPO.R - HYPO.r) * Math.cos(t);
        const gy = (HYPO.R - HYPO.r) * Math.sin(t);
        const rcx = cx + gy * k;
        const rcy = cy - gx * k;
        const [px, py] = P(hi);
        ctx.save();
        ctx.globalAlpha = guide * 0.35;
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 1.2 * u;
        ctx.setLineDash([5 * u, 5 * u]);
        ctx.beginPath();
        ctx.arc(cx, cy, HYPO.R * k, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(rcx, rcy, HYPO.r * k, 0, TAU);
        ctx.moveTo(rcx, rcy);
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.fillStyle = C.ink;
        ctx.beginPath();
        ctx.arc(rcx, rcy, 3 * u, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      if (hi > ti) {
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 5 * u;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        const [sx, sy] = P(ti);
        ctx.moveTo(sx, sy);
        for (let i = ti + 1; i <= hi; i++) {
          const [x, y] = P(i);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        const [hx, hy] = P(hi);
        ctx.fillStyle = C.white;
        ctx.lineWidth = 2.5 * u;
        ctx.beginPath();
        ctx.arc(hx, hy, 8 * u, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
    },
  };

  /* ════════════════════════════════════════════════════════
     07 MONTAGE — 글리치 몽타주
     앞 씬들을 16분음표 → 8분음표 → 한 박자로 점점 길게 끊어 되감는다.
     RGB 분리 · 가로 띠 밀기 · 4분할. 마지막은 타이틀이 흔들리다 멎고, 잉크색 원이 화면을 닫는다.
     ════════════════════════════════════════════════════════ */
  const Q = BEAT / 4; // 16분음표
  const CUTS = [
    { t0: 0, t1: Q, scene: 0, at: 1.55, fx: 'rgb' },
    { t0: Q, t1: 2 * Q, scene: 1, at: 1.5, fx: 'rgb' },
    { t0: 2 * Q, t1: 3 * Q, scene: 2, at: 0.3, fx: 'slice' },
    { t0: 3 * Q, t1: BEAT, scene: 2, at: BEAT + 0.3, fx: 'rgb' },
    { t0: BEAT, t1: BEAT * 1.5, scene: 3, at: 1.2, fx: 'rgb-in' },
    { t0: BEAT * 1.5, t1: BEAT * 2, scene: 4, at: 0.9, fx: 'slice' },
    { t0: BEAT * 2, t1: BEAT * 2.5, scene: 5, at: 1.0, fx: 'rgb-in' },
    { t0: BEAT * 2.5, t1: BEAT * 3, quad: [[1, 1.5], [2, BEAT * 2 + 0.3], [4, 0.9], [5, 1.0]] },
    { t0: BEAT * 3, t1: BAR, title: true },
  ];
  const cutAt = (lt) => CUTS.find((c) => lt < c.t1) || CUTS[CUTS.length - 1];

  function s7Title(ctx, f, tl, lt) {
    const { W, H, u, portrait } = f;
    const b = buffer('s7-title', W, H);
    const c = b.ctx;
    c.fillStyle = C.blue;
    c.fillRect(0, 0, W, H);
    drawGrid(c, f, 60 * u, 'rgba(255,255,255,0.08)', Math.max(1, u));
    const size = fit(c, COPY.s7.word, 900, FONT.sans, W * 0.84, H * (portrait ? 0.14 : 0.3));
    font(c, 900, size, FONT.sans);
    c.fillStyle = C.white;
    c.textAlign = 'center';
    const base = H / 2 + size * 0.3;
    c.fillText(COPY.s7.word, W / 2, base);
    font(c, 600, 26 * u, FONT.mono);
    drawTracked(c, COPY.s7.sub, W / 2, base + 84 * u, 26 * u * 0.7, 'center');

    const g = 1 - EASE.outCubic(prog(tl, 0, 0.26));
    if (g > 0.02) {
      const sl = buffer('s7-slice', W, H);
      sliceGlitch(sl.ctx, b.c, f, g, Math.floor(lt * FPS));
      rgbSplit(ctx, sl.c, f, g);
    } else {
      ctx.drawImage(b.c, 0, 0);
    }
    const iris = EASE.inCubic(prog(lt, BAR - 0.19, BAR - 0.01));
    if (iris > 0) {
      const r = iris * f.diag * 0.56;
      ctx.fillStyle = C.ink;
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, r, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = C.yellow;
      ctx.lineWidth = 6 * u;
      ctx.stroke();
    }
  }

  const S7 = {
    label: 'MONTAGE',
    tone(lt) {
      const cut = cutAt(lt);
      if (cut.title || cut.quad) return 'w';
      const sc = SCENES[cut.scene];
      return sc.tone(cut.at + (lt - cut.t0) * 0.6);
    },
    draw(ctx, f, lt) {
      const { W, H } = f;
      const cut = cutAt(lt);
      const tl = lt - cut.t0;
      if (cut.title) return s7Title(ctx, f, tl, lt);
      if (cut.quad) {
        const hw = Math.floor(W / 2);
        const hh = Math.floor(H / 2);
        const qf = frame(hw, hh);
        cut.quad.forEach(([si, at], i) => {
          const b = buffer('s7-q' + i, hw, hh);
          SCENES[si].draw(b.ctx, qf, at + tl * 0.6);
          reset(b.ctx);
          ctx.drawImage(b.c, (i % 2) * (W - hw), Math.floor(i / 2) * (H - hh));
        });
        ctx.fillStyle = C.ink;
        ctx.fillRect(hw - 2 * f.u, 0, 4 * f.u, H);
        ctx.fillRect(0, hh - 2 * f.u, W, 4 * f.u);
        return;
      }
      const src = buffer('s7-src', W, H);
      SCENES[cut.scene].draw(src.ctx, f, cut.at + tl * 0.6);
      reset(src.ctx);
      const k = tl / (cut.t1 - cut.t0);
      if (cut.fx === 'rgb') rgbSplit(ctx, src.c, f, 1 - k * 0.6);
      else if (cut.fx === 'rgb-in') rgbSplit(ctx, src.c, f, Math.max(0, 1 - k * 2));
      else sliceGlitch(ctx, src.c, f, 1 - k * 0.7, Math.floor(lt * FPS));
      // 컷마다 한 번 번쩍
      const flash = 1 - prog(tl, 0, 0.05);
      if (flash > 0) {
        ctx.fillStyle = C.white;
        ctx.globalAlpha = flash * 0.3;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    },
  };

  /* ════════════════════════════════════════════════════════
     08 렛츠코딩 — 엔드카드
     커서가 깜빡이다 워드마크가 한 글자씩 튀어 오르고, 밑줄이 그어진 뒤 정보가 순서대로 올라온다.
     나갈 때 밑줄이 화면 가로로 늘어나 가운데로 내려온다 → 01의 첫 프레임(노란 선)과 이어져 무한 루프.
     ════════════════════════════════════════════════════════ */
  function s8Layout(ctx, f) {
    const { W, H, u, portrait } = f;
    const word = COPY.s8.wordmark;
    const size = portrait ? fit(ctx, word, 900, FONT.sans, W * 0.56, H * 0.12) : H * 0.165;
    font(ctx, 900, size, FONT.sans);
    const g = glyphs(ctx, word);
    const cap = size * 0.74;
    const markS = cap * 0.98;
    const gap = size * 0.16;
    const blockW = markS + gap + g.width;
    const tagSize = (portrait ? 42 : 36) * u;
    font(ctx, 700, tagSize, FONT.sans);
    const tagLines = portrait ? COPY.s8.tagline.split(/(?<=,)\s/) : [COPY.s8.tagline];
    const tagW = Math.max(...tagLines.map((l) => ctx.measureText(l).width));
    const groupW = Math.max(blockW, tagW);
    const x0 = portrait ? W * 0.1 : W / 2 - groupW / 2;
    const base = portrait ? H * 0.4 : H * 0.44;
    const ulY = base + size * 0.17;
    const pillY = ulY + (portrait ? 68 : 60) * u;
    const tagY = pillY + (portrait ? 70 : 62) * u;
    const ctaY = tagY + (tagLines.length - 1) * tagSize * 1.35 + (portrait ? 64 : 56) * u;
    return { size, g, cap, markS, gap, blockW, x0, base, ulY, pillY, tagY, ctaY, tagSize, tagLines, textX: x0 + markS + gap };
  }

  const S8 = {
    label: "LET'S CODING",
    tone: () => 'w',
    draw(ctx, f, lt) {
      const { W, H, u, portrait } = f;
      ctx.fillStyle = C.ink;
      ctx.fillRect(0, 0, W, H);
      const L = s8Layout(ctx, f);
      const fade = 1 - prog(lt, 1.6, 1.7);
      ctx.globalAlpha = fade;

      // 마크
      const mp = prog(lt, 0.1, 0.5);
      if (mp > 0) {
        const s = spring(mp, 7, 12);
        const mx = L.x0;
        const my = L.base - L.cap;
        ctx.save();
        ctx.translate(mx + L.markS / 2, my + L.markS / 2);
        ctx.scale(s, s);
        ctx.fillStyle = C.blue;
        roundRect(ctx, -L.markS / 2, -L.markS / 2, L.markS, L.markS, L.markS * 0.24);
        ctx.fill();
        chevron(ctx, -L.markS * 0.34, -L.markS * 0.34, L.markS * 0.68, C.white, prog(lt, 0.2, 0.42));
        ctx.restore();
      }

      // 워드마크 — 음절마다 튀어 오른다
      font(ctx, 900, L.size, FONT.sans);
      ctx.textAlign = 'left';
      let typed = 0;
      L.g.list.forEach((gl, i) => {
        const st = 0.26 + i * 0.075;
        const p = prog(lt, st, st + 0.42);
        if (p <= 0) return;
        typed = i + 1;
        const s = 0.55 + 0.45 * spring(p, 8, 14);
        ctx.save();
        ctx.globalAlpha = fade * Math.min(1, p * 6);
        ctx.translate(L.textX + gl.x + gl.w / 2, L.base + (1 - spring(p, 8, 14)) * 40 * u);
        ctx.scale(s, s);
        ctx.fillStyle = C.white;
        ctx.textAlign = 'center';
        ctx.fillText(gl.ch, 0, 0);
        ctx.restore();
      });

      // 커서
      if (lt < 0.62 && (lt < 0.26 || lt > 0.55 ? blinkOn(lt) : true)) {
        const last = L.g.list[typed - 1];
        const cxp = L.textX + (last ? last.x + last.w : 0) + 10 * u;
        ctx.fillStyle = C.yellow;
        ctx.fillRect(cxp, L.base - L.cap * 0.95, L.size * 0.08, L.cap * 1.02);
      }

      // 모노 캡션 · 태그라인 · CTA
      const pa = EASE.outCubic(prog(lt, 0.78, 1.0));
      if (pa > 0) {
        font(ctx, 600, (portrait ? 23 : 21) * u, FONT.mono);
        ctx.fillStyle = C.white;
        ctx.globalAlpha = fade * pa * 0.82;
        drawTracked(ctx, COPY.s8.pillars, L.x0, L.pillY + (1 - pa) * 12 * u, 0.3 * (portrait ? 23 : 21) * u, 'left');
      }
      const ta = EASE.outCubic(prog(lt, 0.92, 1.14));
      if (ta > 0) {
        font(ctx, 700, L.tagSize, FONT.sans);
        ctx.fillStyle = C.white;
        ctx.globalAlpha = fade * ta;
        L.tagLines.forEach((line, i) => ctx.fillText(line, L.x0, L.tagY + i * L.tagSize * 1.35 + (1 - ta) * 12 * u));
      }
      const ctaN = Math.floor(Array.from(COPY.s8.cta).length * prog(lt, 1.1, 1.5));
      if (lt > 1.06) {
        font(ctx, 500, (portrait ? 24 : 21) * u, FONT.mono);
        ctx.fillStyle = C.yellow;
        ctx.globalAlpha = fade;
        const shown = Array.from(COPY.s8.cta).slice(0, ctaN).join('');
        ctx.fillText(shown, L.x0, L.ctaY);
        if (lt < 1.5 || blinkOn(lt)) {
          const cs = (portrait ? 24 : 21) * u;
          ctx.fillRect(L.x0 + ctx.measureText(shown).width + 4 * u, L.ctaY - cs * 0.8, cs * 0.55, cs);
        }
      }
      ctx.globalAlpha = 1;

      // 밑줄 → 나갈 때 화면 가로 선이 되어 가운데로
      const e = EASE.inOutCubic(prog(lt, 1.62, BAR));
      if (e > 0) {
        const lx0 = lerp(L.x0, 0, e);
        const lx1 = lerp(L.x0 + L.blockW, W, e);
        const ly = lerp(L.ulY, H / 2, e);
        const lw = lerp(6 * u, 4 * u, e);
        ctx.fillStyle = C.yellow;
        ctx.fillRect(lx0, ly - lw / 2, lx1 - lx0, lw);
      } else {
        const ul = EASE.outCubic(prog(lt, 0.6, 0.86));
        if (ul > 0) {
          ctx.fillStyle = C.yellow;
          ctx.fillRect(L.x0, L.ulY - 3 * u, L.blockW * ul, 6 * u);
        }
      }
    },
  };

  const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8];

  /* ── HUD ─────────────────────────────────────────────────
     방송 모니터처럼: 제목 · 사양 · 타임코드 · 박자 표시 · 씬 번호 · 진행 막대 */
  const pad2 = (n) => String(n).padStart(2, '0');
  function timecode(t) {
    const fr = Math.floor(t * FPS + 1e-6);
    return `00:00:${pad2(Math.floor(fr / FPS))}:${pad2(fr % FPS)}`;
  }
  function drawHUD(ctx, f, t, idx, tone) {
    const { W, H, u, portrait } = f;
    const m = (portrait ? 56 : 46) * u;
    const fs = (portrait ? 17 : 15) * u;
    const tr = fs * 0.14;
    ctx.save();
    ctx.fillStyle = tone === 'k' ? 'rgba(27,35,51,0.92)' : 'rgba(255,255,255,0.92)';
    font(ctx, 500, fs, FONT.mono);
    ctx.textBaseline = 'top';
    drawTracked(ctx, COPY.hudLeft, m, m, tr, 'left');
    drawTracked(ctx, COPY.hudRight, W - m, m, tr, 'right');
    ctx.textBaseline = 'alphabetic';
    drawTracked(ctx, 'TC ' + timecode(t), m, H - m, tr, 'left');
    drawTracked(ctx, `${pad2(idx + 1)}/${pad2(SCENE_COUNT)}   ${SCENES[idx].label}`, W - m, H - m, tr, 'right');
    const beat = Math.floor(t / BEAT + 1e-6) % 4;
    const sq = 7 * u;
    const gap = 7 * u;
    const total = 4 * sq + 3 * gap;
    for (let k = 0; k < 4; k++) {
      ctx.globalAlpha = k === beat ? 1 : 0.3;
      ctx.fillRect(W / 2 - total / 2 + k * (sq + gap), H - m - sq, sq, sq);
    }
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, H - 3 * u, W * (t / DURATION), 3 * u);
    ctx.restore();
  }

  /* ── 공개 API ──────────────────────────────────────────── */
  function create(canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    return {
      canvas,
      render(t) {
        t = ((t % DURATION) + DURATION) % DURATION;
        const f = frame(canvas.width, canvas.height);
        const idx = Math.min(SCENE_COUNT - 1, Math.floor(t / BAR + 1e-9));
        const lt = t - idx * BAR;
        reset(ctx);
        ctx.save();
        SCENES[idx].draw(ctx, f, lt);
        ctx.restore();
        reset(ctx);
        drawHUD(ctx, f, t, idx, SCENES[idx].tone(lt));
        return { idx, lt };
      },
    };
  }

  /** 쓰이는 모든 글자와 굵기를 미리 받는다. Pretendard는 unicode-range 서브셋이라 글자를 넘겨야 한다. */
  function allText() {
    const parts = [];
    const walk = (v) => {
      if (typeof v === 'string') parts.push(v);
      else if (v && typeof v === 'object') Object.values(v).forEach(walk);
    };
    walk(COPY);
    SCENES.forEach((s) => parts.push(s.label));
    S3_BEATS.forEach((b) => parts.push(b.easeLabel));
    parts.push('0123456789 TC:/[]·.,tv RUN');
    return parts.join(' ');
  }
  async function loadFonts() {
    if (!document.fonts || !document.fonts.load) return;
    const text = allText();
    const specs = [
      `900 64px ${FONT.sans}`,
      `800 64px ${FONT.sans}`,
      `700 64px ${FONT.sans}`,
      `600 64px ${FONT.sans}`,
      `500 64px ${FONT.sans}`,
      `500 64px ${FONT.mono}`,
      `600 64px ${FONT.mono}`,
      `700 64px ${FONT.mono}`,
      `italic 500 64px ${FONT.serif}`,
    ];
    await Promise.all(specs.map((s) => document.fonts.load(s, text).catch(() => [])));
    await document.fonts.ready;
    s2Cache.clear(); // 글꼴이 바뀌었으면 파티클 목표점과 격자 화면을 다시 만든다
    s4Bases.clear();
  }

  /** 세 글꼴이 실제로 내려받아졌는지. 하나라도 false면 대체 글꼴로 그려지고 있다는 뜻이다. */
  function fontStatus() {
    const got = { 'Pretendard Variable': false, 'IBM Plex Mono': false, 'IBM Plex Serif': false };
    if (document.fonts) {
      document.fonts.forEach((ff) => {
        const fam = ff.family.replace(/["']/g, '');
        if (fam in got && ff.status === 'loaded') got[fam] = true;
      });
    }
    return got;
  }

  root.LetsCodingReel = {
    create,
    loadFonts,
    fontStatus,
    BPM,
    BEAT,
    BAR,
    FPS,
    DURATION,
    COPY,
    scenes: SCENES.map((s, i) => ({ index: i, label: s.label, start: i * BAR, end: (i + 1) * BAR })),
    timecode,
  };
})(typeof window !== 'undefined' ? window : globalThis);
