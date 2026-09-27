import Image from "next/image";
import WORKS from "@/lib/works.json";
import { PointerField } from "@/components/landing/pointer-field";

/*
  카드의 강 — 히어로 아래에서 실제 학생 작품 썸네일이 세 줄로 흐른다.
  1) 바탕: 줄마다 방향과 속도가 다른 선형 흐름. 멈추지 않는다. 마우스를 올려도 계속 흐른다.
  2) 위에: 마우스 자리에 따라 판이 기울고(rotate), 줄이 서로 다른 폭으로 미끄러진다(시차).
     PointerField 가 --mx, --my 를 주고, CSS 가 그 값으로 움직인다.
  동작 줄이기 설정이면 둘 다 꺼지고 정지 화면이 남는다.

  출처: lounge.letscoding.kr/works/nana — 공개 사용이 허용된 나나쌤 소유 작품만.
*/

type Work = { slug: string; title: string; kind: string; href: string };
const ALL = WORKS as Work[];

function Row({ items, speed, reverse = false, drift }: { items: Work[]; speed: number; reverse?: boolean; drift: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="river-row" style={{ "--dur": `${speed}s`, "--dir": reverse ? "reverse" : "normal", "--drift": `${drift}px` } as React.CSSProperties}>
      <ul className="river-track">
        {doubled.map((w, i) => (
          <li key={`${w.slug}-${i}`} className="river-card" aria-hidden={i >= items.length ? true : undefined}>
            <Image src={`/landing/works/${w.slug}.webp`} alt={i < items.length ? `${w.title} · ${w.kind}` : ""} width={560} height={315} sizes="260px" className="size-full object-cover" />
            <span className="river-label">{w.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CardRiver() {
  const third = Math.ceil(ALL.length / 3);
  const rows = [ALL.slice(0, third), ALL.slice(third, third * 2), ALL.slice(third * 2)];
  return (
    <PointerField className="river">
      <div className="river-tilt" aria-label="렛츠코딩 라운지에 올라온 학생 작품들">
        <Row items={rows[0]} speed={44} reverse drift={-70} />
        <Row items={rows[1]} speed={56} drift={90} />
        <Row items={rows[2]} speed={48} reverse drift={-50} />
      </div>
    </PointerField>
  );
}
