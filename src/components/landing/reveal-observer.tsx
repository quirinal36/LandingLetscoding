"use client";

import { useEffect } from "react";

/*
  [data-reveal] 요소가 화면에 들어오면 data-shown 을 붙인다. 페이지에 하나만 둔다.
  html 에 .js 를 붙인 뒤에만 숨김 상태가 걸리므로, 자바스크립트가 없어도 내용은 보인다.
  [data-count] 요소는 들어올 때 0에서 목표 숫자까지 올라간다.
*/
export function RevealObserver() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    if (reduced) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }

    const format = new Intl.NumberFormat("ko-KR");
    const count = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = format.format(Math.round(target * eased));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    counters.forEach((el) => (el.textContent = "0"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.dataset.count !== undefined) count(el);
          else el.setAttribute("data-shown", "");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    counters.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
