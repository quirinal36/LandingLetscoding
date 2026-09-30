"use client";

import { useEffect } from "react";

/*
  [data-reveal] 요소가 화면에 들어오면 data-shown 을 붙인다. 페이지에 하나만 둔다.
  html 에 .js 를 붙인 뒤에만 숨김 상태가 걸리므로, 자바스크립트가 없어도 내용은 보인다.
  [data-count] 요소는 들어올 때 일의 자리만 0부터 하나씩 올려 실제 집계값까지 올라간 뒤 0으로 이어져 반복한다.
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
    const animations: Animation[] = [];
    const count = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const from = Math.floor(target / 10) * 10;
      const steps = target - from;
      if (!steps) return;
      const numbers = Array.from({ length: steps + 1 }, (_, i) =>
        format.format(from + i).padStart(format.format(target).length, " "));
      numbers.push(numbers[0]); // Duplicate the first row for a seamless upward loop.
      const cycleSteps = steps + 1;
      const keyframes: Keyframe[] = [];
      for (let i = 0; i <= cycleSteps; i++) {
        const transform = `translateY(${-i * 1.15}em)`;
        keyframes.push({ transform, offset: i / cycleSteps, easing: "ease-in-out" });
        if (i < cycleSteps) keyframes.push({ transform, offset: (i + 0.35) / cycleSteps, easing: "ease-in-out" });
      }
      // Fixed digits stay still. Only changing digit columns move up one row.
      el.replaceChildren(...Array.from(numbers[steps], (_, column) => {
        const cell = document.createElement("span");
        cell.className = "text-gold inline-block h-[1.15em] overflow-hidden align-top leading-[1.15]";
        const digits = numbers.map(number => number[column]);
        if (digits.every(digit => digit === digits[0])) {
          cell.textContent = digits[0];
        } else {
          const strip = document.createElement("span");
          strip.className = "block";
          strip.replaceChildren(...digits.map(digit => {
            const row = document.createElement("span");
            row.className = "text-gold block h-[1.15em] leading-[1.15] whitespace-pre";
            row.textContent = digit;
            return row;
          }));
          cell.append(strip);
          animations.push(strip.animate(keyframes, { duration: cycleSteps * 850, iterations: Infinity }));
        }
        return cell;
      }));
    };

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
    return () => {
      io.disconnect();
      animations.forEach(animation => animation.cancel());
      counters.forEach(el => { el.textContent = format.format(Number(el.dataset.count)); });
    };
  }, []);

  return null;
}
