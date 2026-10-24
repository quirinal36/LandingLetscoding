"use client";

import { useState } from "react";
import { formatTime, youtubeWatchUrl } from "@/lib/guide";

type Props = { youtubeId: string; title: string; chapters: { title: string; start: number | null }[] };

/** 유튜브 영상과 챕터 이동. 챕터를 누르면 그 시점부터 다시 불러온다. */
export function GuideVideo({ youtubeId, title, chapters }: Props) {
  const [start, setStart] = useState(0);
  const [plays, setPlays] = useState(0);
  const timed = chapters.map((c, i) => ({ ...c, index: i })).filter((c) => c.start !== null);
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&start=${start}${plays ? "&autoplay=1" : ""}`;
  return (
    <figure className="card overflow-hidden">
      <div className="aspect-video w-full bg-fill">
        <iframe
          key={`${start}-${plays}`}
          src={src}
          title={title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
        <span className="text-ink-soft">{timed.length > 0 ? "소제목을 누르면 그 지점부터 재생됩니다." : "영상 소제목 시간은 준비 중입니다."}</span>
        <a href={youtubeWatchUrl(youtubeId)} target="_blank" rel="noopener" className="text-accent-ink underline underline-offset-4">유튜브에서 보기</a>
      </figcaption>
      {timed.length > 0 && (
        <ol className="hairline grid gap-0.5 border-t px-2 py-2 sm:grid-cols-2">
          {timed.map((c) => (
            <li key={c.index}>
              <button
                type="button"
                onClick={() => { setStart(c.start!); setPlays((n) => n + 1); }}
                className="menu-row w-full items-baseline gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-fill"
              >
                <span className="shrink-0 font-mono text-xs text-ink-faint">{formatTime(c.start!)}</span>
                <span className="text-ink-soft">{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}
