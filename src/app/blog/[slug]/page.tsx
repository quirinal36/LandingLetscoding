import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/article-body";
import { JsonLd } from "@/components/product";
import { ButtonLink } from "@/components/ui";
import { BLOG_CATEGORIES, formatDate, getPost, getPosts } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";

type Props = { params: Promise<{ slug: string }> };

/** 글은 빌드 때 전부 굽는다. 목록에 없는 slug는 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  // openGraph·twitter는 레이아웃 값과 합쳐지지 않고 통째로 바뀐다. 그래서 siteName·locale·card까지 다시 쓴다.
  const image = post.cover ? { url: post.cover.src, ...post.cover.size } : { url: "/landing/og.jpg", width: 1897, height: 990 };
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: COMPANY.short,
      title: post.title,
      description: post.summary,
      url: "./",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, images: [image.url] },
  };
}

export default async function Page({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const url = `${COMPANY.url}/blog/${post.slug}`;
  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          url,
          mainEntityOfPage: url,
          inLanguage: "ko-KR",
          articleSection: BLOG_CATEGORIES[post.category].label,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          ...(post.cover && { image: [`${COMPANY.url}${post.cover.src}`] }),
          author: { "@type": "Person", name: post.author, jobTitle: post.authorTitle },
          publisher: { "@type": "Organization", "@id": `${COMPANY.url}/#organization`, name: COMPANY.name, url: COMPANY.url, logo: `${COMPANY.url}/icon.png` },
        }}
      />

      <Link href="/blog" className="text-sm text-ink-soft hover:text-ink">
        ← 렛츠코딩 블로그
      </Link>

      <header className="mt-8 mb-10">
        <p className="text-sm font-semibold text-accent-ink">{BLOG_CATEGORIES[post.category].label}</p>
        <h1 className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.025em] [word-break:keep-all] md:text-[2.5rem]">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft [word-break:keep-all]">{post.summary}</p>
        <p className="mt-6 flex flex-wrap gap-x-2 text-sm text-ink-faint">
          <span className="font-medium text-ink-soft">{post.author}</span>
          <span>{post.authorTitle}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>약 {post.readingMinutes}분</span>
        </p>
      </header>

      {post.cover && (
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.size.width}
          height={post.cover.size.height}
          sizes="(min-width: 768px) 720px, 100vw"
          priority
          className="mb-12 w-full rounded-2xl"
        />
      )}

      <ArticleBody body={post.body} />

      <footer className="mt-16 border-t border-black/10 pt-10">
        <div className="card p-7">
          <p className="font-semibold">코딩 학원을 운영하고 계신가요?</p>
          <p className="mt-2 leading-relaxed text-ink-soft">
            글에 나온 수업은 렛츠코딩 라운지에서 진행합니다. 첫 반 하나로 4주 동안 무료로 써 보실 수 있습니다.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/solutions/lounge" tone="accent" size="sm" className="pill">
              렛츠코딩 라운지 알아보기
            </ButtonLink>
            <Link href="/seminar/inquiry" className="link-chevron text-sm">
              도입문의
            </Link>
          </div>
        </div>

        {others.length > 0 && (
          <nav className="mt-12" aria-label="다른 글">
            <h2 className="font-semibold">다른 글</h2>
            <ul className="mt-4 grid gap-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="card block p-5 hover:-translate-y-0.5 transition-transform">
                    <span className="text-xs font-semibold text-accent-ink">{BLOG_CATEGORIES[p.category].label}</span>
                    <span className="mt-1 block font-semibold [word-break:keep-all]">{p.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </footer>
    </article>
  );
}
