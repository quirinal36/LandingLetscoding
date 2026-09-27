"use client";

import { useEffect, useRef, useState } from "react";

/*
  폰 안에서 도는 무음 영상. 원장님이 만든 30초 라운지 쇼츠다.
  - 화면에 들어오면 재생, 나가면 멈춘다.
  - 소리는 없다. 소리 켜기 버튼도 없다. 영상은 분위기이지 설명이 아니다.
  - 동작 줄이기 설정이면 포스터만 보여 준다.
  React 는 SSR 에서 muted 속성을 빼먹는 일이 있어 ref 로 직접 건다.
*/
export function PhoneVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setStill(true));
      return;
    }
    v.muted = true;
    v.defaultMuted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => setStill(true));
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="phone">
      <div className="phone-screen">
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="size-full object-cover" />
        ) : (
          <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" className="size-full object-cover" aria-label="렛츠코딩 라운지 소개 영상. 학생들이 만든 게임과 웹사이트가 차례로 나온다" />
        )}
      </div>
      <span className="phone-notch" aria-hidden="true" />
    </div>
  );
}
