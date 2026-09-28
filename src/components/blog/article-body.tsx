import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getPost, type Segment } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";

/* 글 본문. 서버 컴포넌트라 본문 전체가 초기 HTML에 실린다(크롤러가 JS 없이 읽는다). */

const URL = /https?:\/\/[^\s]+/g;
const OWN_POST = new RegExp(`^${COMPANY.url.replace(/\./g, "\\.")}/blog/([a-z0-9-]+)$`);

/** 우리 블로그 주소는 글 제목으로 된 내부 링크로, 나머지 주소는 새 창 링크로 바꾼다. */
function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(URL)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    const url = m[0];
    const own = url.match(OWN_POST);
    const post = own ? getPost(own[1]) : undefined;
    out.push(
      post ? (
        <Link key={start} href={`/blog/${post.slug}`} className="font-medium text-accent-ink underline underline-offset-4">
          {post.title}
        </Link>
      ) : (
        <a key={start} href={url} target="_blank" rel="noopener" className="break-all text-accent-ink underline underline-offset-4">
          {url}
        </a>
      ),
    );
    last = start + url.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function ArticleBody({ body }: { body: Segment[] }) {
  return (
    <div className="[word-break:keep-all]">
      {body.map((s, i) => {
        switch (s.kind) {
          case "heading":
            return (
              <h2 key={i} className="mt-14 mb-4 text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                {s.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote key={i} className="my-8 border-l-4 border-accent-ink/60 pl-5 text-lg leading-relaxed text-ink-soft">
                {linkify(s.text)}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="my-10">
                <Image src={s.src} alt={s.alt} width={s.size.width} height={s.size.height} sizes="(min-width: 768px) 720px, 100vw" className="w-full rounded-2xl" />
              </figure>
            );
          case "code":
            return (
              <pre key={i} className="card my-8 overflow-x-auto p-5 text-sm leading-relaxed">
                <code>{s.text}</code>
              </pre>
            );
          default:
            return (
              <p key={i} className="mb-6 text-[1.0625rem] leading-[1.9] whitespace-pre-wrap text-ink-soft md:text-lg">
                {linkify(s.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
