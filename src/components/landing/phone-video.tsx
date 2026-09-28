"use client";

import { useEffect, useRef, useState } from "react";

/*
  폰 안에서 도는 무음 영상. 원장님이 만든 30초 라운지 쇼츠다.
  - 화면에 들어오면 재생, 나가면 멈춘다.
  - 소리는 없다. 소리 켜기 버튼도 없다. 영상은 분위기이지 설명이 아니다.
  - 동작 줄이기 설정이면 저절로 돌지 않는다. 포스터 위에 재생 버튼을 두고, 누르면 돈다.
    윈도우는 「애니메이션 효과」가 꺼진 PC가 흔해서, 포스터만 남기면 영상이 고장 난 것처럼 보인다.
  - 자동 재생이 거부되면(저전력 모드 등) 같은 버튼으로 넘어간다.
  React 는 SSR 에서 muted 속성을 빼먹는 일이 있어 ref 로 직접 건다.
*/
export function PhoneVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setManual(true));
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => setManual(true));
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  return (
    <div className="phone">
      <div className="phone-screen">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="size-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label="렛츠코딩 라운지 소개 영상. 학생들이 만든 게임과 웹사이트가 차례로 나온다"
        />
        {manual && (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "영상 멈추기" : "영상 재생"}
            className={`phone-play ${playing ? "phone-play-on" : ""}`}
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
              {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5.5v13l11-6.5z" />}
            </svg>
          </button>
        )}
      </div>
      <span className="phone-notch" aria-hidden="true" />
    </div>
  );
}
