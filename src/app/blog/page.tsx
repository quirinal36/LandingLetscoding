import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/product";
import { BLOG_CATEGORIES, PINNED_SLUG, formatDate, getPosts, type BlogCategory, type BlogPost } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";

export const metadata: Metadata = {
  title: "블로그",
  description: "AI 시대 코딩 교육에 대해 렛츠코딩앤플레이학원 원장이 현장에서 보고 겪은 것을 씁니다. 칼럼과 AI 도구 정보 글.",
};

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-0.5">
      {post.cover && (
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.size.width}
          height={post.cover.size.height}
          sizes="(min-width: 768px) 360px, 100vw"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold leading-snug [word-break:keep-all]">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft [word-break:keep-all]">{post.summary}</p>
        <p className="mt-auto pt-4 text-xs text-ink-faint">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · 약 {post.readingMinutes}분
        </p>
      </div>
    </Link>
  );
}

export default function Page() {
  const posts = getPosts();
  const pinned = posts.find((p) => p.slug === PINNED_SLUG);
  const rest = posts.filter((p) => p !== pinned);
  const groups = (Object.keys(BLOG_CATEGORIES) as BlogCategory[])
    .map((c) => ({ c, posts: rest.filter((p) => p.category === c) }))
    .filter((g) => g.posts.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "렛츠코딩 블로그",
          url: `${COMPANY.url}/blog`,
          inLanguage: "ko-KR",
          publisher: { "@type": "Organization", "@id": `${COMPANY.url}/#organization`, name: COMPANY.name, url: COMPANY.url, logo: `${COMPANY.url}/icon.png` },
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${COMPANY.url}/blog/${p.slug}`, datePublished: p.publishedAt })),
        }}
      />

      <h1 className="text-3xl font-semibold tracking-[-0.025em] md:text-4xl">렛츠코딩 블로그</h1>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
        AI 시대에 아이들이 무엇을 배워야 하는지, 코딩 교육 현장에서 보고 겪은 것을 씁니다.
      </p>

      {pinned && (
        <Link href={`/blog/${pinned.slug}`} className="card mt-10 block p-7 transition-transform hover:-translate-y-0.5 md:p-9">
          <span className="text-sm font-semibold text-accent-ink">고정 글</span>
          <span className="mt-2 block text-xl font-semibold md:text-2xl">{pinned.title}</span>
          <span className="mt-2 block max-w-[60ch] leading-relaxed text-ink-soft [word-break:keep-all]">{pinned.summary}</span>
        </Link>
      )}

      {groups.map(({ c, posts }) => (
        <section key={c} className="mt-16">
          <h2 className="text-xl font-semibold md:text-2xl">{BLOG_CATEGORIES[c].label}</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">{BLOG_CATEGORIES[c].description}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-16 text-sm text-ink-faint">
        새 글은{" "}
        <a href="/blog/feed.xml" className="underline underline-offset-4">
          RSS
        </a>
        로도 받아 보실 수 있습니다.
      </p>
    </div>
  );
}
