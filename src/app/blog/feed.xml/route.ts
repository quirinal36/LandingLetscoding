import { getPosts } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";

/** 블로그 RSS. 빌드 때 한 번 만든다. 네이버 서치어드바이저에 RSS로도 제출할 수 있다. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const posts = getPosts();
  const items = posts
    .map((p) => {
      const link = `${COMPANY.url}/blog/${p.slug}`;
      return `<item><title>${esc(p.title)}</title><link>${link}</link><guid>${link}</guid><description>${esc(p.summary)}</description><dc:creator>${esc(p.author)}</dc:creator><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate></item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>렛츠코딩 블로그</title>
<link>${COMPANY.url}/blog</link>
<atom:link href="${COMPANY.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>
<description>AI 시대 코딩 교육에 대해 코딩 학원 원장이 현장에서 보고 겪은 것을 씁니다.</description>
<language>ko</language>
<lastBuildDate>${new Date(posts[0]?.updatedAt ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
