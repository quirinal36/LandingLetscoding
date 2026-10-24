import type { ReactNode } from "react";
import { formatTime, type Chapter, type Segment } from "@/lib/guide";

/* 교재 본문. 서버 컴포넌트라 본문 전체가 초기 HTML에 실린다. */

const URL_PATTERN = /https?:\/\/[^\s]+/g;

function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_PATTERN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <a key={start} href={m[0]} target="_blank" rel="noopener" className="break-all text-accent-ink underline underline-offset-4">
        {m[0]}
      </a>,
    );
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Segments({ body }: { body: Segment[] }) {
  return (
    <>
      {body.map((s, i) => {
        switch (s.kind) {
          case "heading":
            return <h3 key={i} className="mt-8 mb-3 text-lg font-semibold tracking-[-0.01em]">{s.text}</h3>;
          case "quote":
            return (
              <blockquote key={i} className="card my-6 border-l-4 border-accent-ink/60 px-5 py-4 leading-relaxed text-ink-soft">
                {linkify(s.text)}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="my-8">
                {/* DB의 외부 이미지는 원본 비율로 표시한다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} loading="lazy" className="h-auto w-full rounded-2xl" />
                {s.alt && <figcaption className="mt-2 text-sm text-ink-faint">{s.alt}</figcaption>}
              </figure>
            );
          case "code":
            return (
              <pre key={i} className="card my-6 overflow-x-auto p-5 text-sm leading-relaxed whitespace-pre-wrap">
                <code>{s.text}</code>
              </pre>
            );
          case "list":
            return s.ordered ? (
              <ol key={i} className="my-5 list-decimal space-y-2 pl-6 leading-relaxed text-ink-soft marker:font-mono marker:text-ink-faint">
                {s.items.map((item, j) => <li key={j}>{linkify(item)}</li>)}
              </ol>
            ) : (
              <ul key={i} className="my-5 list-disc space-y-2 pl-6 leading-relaxed text-ink-soft marker:text-ink-faint">
                {s.items.map((item, j) => <li key={j}>{linkify(item)}</li>)}
              </ul>
            );
          default:
            return <p key={i} className="mb-5 leading-[1.85] whitespace-pre-wrap text-ink-soft">{linkify(s.text)}</p>;
        }
      })}
    </>
  );
}

/** 소제목 단위로 본문을 그린다. id는 c1, c2… 로 목차와 영상 챕터가 같은 번호를 쓴다. */
export function LessonBody({ chapters }: { chapters: Chapter[] }) {
  if (chapters.length === 0) {
    return <p className="card p-6 text-ink-soft">이 편의 내용은 준비 중입니다. 목차의 다른 편을 먼저 보셔도 됩니다.</p>;
  }
  return (
    <div className="text-[1.0625rem] [word-break:keep-all] md:text-lg">
      {chapters.map((chapter, i) => (
        <section key={i} id={`c${i + 1}`} className="scroll-mt-24 border-t border-separator pt-8 pb-4 first:border-t-0 first:pt-0">
          <h2 className="mb-5 flex items-baseline gap-3 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
            <span className="font-mono text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
            <span>{chapter.title}</span>
            {chapter.start !== null && <span className="ml-auto shrink-0 font-mono text-sm font-normal text-ink-faint">{formatTime(chapter.start)}</span>}
          </h2>
          {chapter.body.length === 0 ? (
            <p className="text-base text-ink-faint">내용 준비 중</p>
          ) : (
            <Segments body={chapter.body} />
          )}
        </section>
      ))}
    </div>
  );
}
