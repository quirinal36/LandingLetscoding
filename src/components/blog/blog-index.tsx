import Link from "next/link";
import { AuthControls } from "@/components/blog/auth-controls";
import { ToolsSection } from "@/components/blog/tools-section";
import { JsonLd } from "@/components/product";
import { BLOG_CATEGORIES, PINNED_SLUG, categoryHref, formatDate, getPosts, type BlogCategory, type BlogPost } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";
import { getViewer } from "@/lib/supabase/server";

/* 블로그 목록. 왼쪽 메뉴로 칼럼·정보·도구 갈래를 오가고, 갈래마다 주소가 따로 있다(/blog, /blog/category/…). */

const CATEGORIES = Object.keys(BLOG_CATEGORIES) as BlogCategory[];

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group flex h-full flex-col overflow-hidden transition-transform hover:-translate-y-0.5">
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover.src}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
          style={post.slug === "about-letscoding-company" ? { objectPosition: "center 10%" } : undefined}
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

function CategoryMenu({ current, counts }: { current: BlogCategory; counts: Record<BlogCategory, number> }) {
  return (
    <nav aria-label="블로그 갈래" className="md:sticky md:top-24">
      {/* 좁은 화면에서는 가로 탭, 넓은 화면에서는 왼쪽 세로 메뉴 */}
      <ul className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
        {CATEGORIES.map((c) => {
          const active = c === current;
          return (
            <li key={c} className="shrink-0">
              <Link
                href={categoryHref(c)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between gap-3 rounded-full px-4 py-2 text-[0.9375rem] transition-colors md:rounded-xl ${
                  active ? "bg-accent-soft font-semibold text-accent-ink" : "text-ink-soft hover:bg-fill hover:text-ink"
                }`}
              >
                <span>{BLOG_CATEGORIES[c].label}</span>
                <span className={`text-xs ${active ? "text-accent-ink/70" : "text-ink-faint"}`}>{counts[c]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export async function BlogIndex({ category, auth }: { category: BlogCategory; auth?: string }) {
  const { isAdmin, supabase } = await getViewer();
  const drafts = isAdmin ? await supabase.schema("landing").from("blog_posts").select("slug,title").eq("is_published", false).order("updated_at", { ascending: false }) : null;
  const all = await getPosts();
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, all.filter((p) => p.category === c).length])) as Record<BlogCategory, number>;
  const posts = all.filter((p) => p.category === category);
  const pinned = category === "column" ? posts.find((p) => p.slug === PINNED_SLUG) : undefined;
  const rest = posts.filter((p) => p !== pinned);
  const { label, description } = BLOG_CATEGORIES[category];
  const url = `${COMPANY.url}${categoryHref(category)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: category === "column" ? "렛츠코딩 블로그" : `렛츠코딩 블로그 ${label}`,
          url,
          inLanguage: "ko-KR",
          publisher: { "@type": "Organization", "@id": `${COMPANY.url}/#organization`, name: COMPANY.name, url: COMPANY.url, logo: `${COMPANY.url}/icon.png` },
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${COMPANY.url}/blog/${p.slug}`, datePublished: p.publishedAt })),
        }}
      />

      <h1 className="text-3xl font-semibold tracking-[-0.025em] md:text-4xl">렛츠코딩 블로그</h1>
      <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
        AI 시대에 아이들이 무엇을 배워야 하는지, 코딩 교육 현장에서 보고 겪은 것을 씁니다.
      </p>

      <div className="mt-6"><AuthControls /></div>
      {auth && <p role="alert" className="mt-4 text-sm text-red-700">{auth === "logout-failed" ? "로그아웃하지 못했습니다. 다시 시도해 주세요." : "카카오 로그인을 완료하지 못했습니다. 다시 시도해 주세요."}</p>}
      {isAdmin && drafts?.error && <p role="alert" className="mt-4 text-red-700">초안 목록을 불러오지 못했습니다.</p>}
      {isAdmin && !!drafts?.data?.length && <section className="card mt-8 p-6" aria-label="관리자 초안">
        <h2 className="font-semibold">초안</h2>
        <ul className="mt-3 space-y-3">{drafts.data.map(post => <li key={post.slug}><Link href={`/blog/editor?slug=${encodeURIComponent(post.slug)}`} className="underline underline-offset-4">{post.title} · 수정</Link></li>)}</ul>
      </section>}

      <div className="mt-12 grid gap-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12">
        <aside>
          <CategoryMenu current={category} counts={counts} />
        </aside>

        <div>
          {pinned && (
            <Link href={`/blog/${pinned.slug}`} className="card mb-12 block p-7 transition-transform hover:-translate-y-0.5 md:p-9">
              <span className="text-sm font-semibold text-accent-ink">고정 글</span>
              <span className="mt-2 block text-xl font-semibold md:text-2xl">{pinned.title}</span>
              <span className="mt-2 block max-w-[60ch] leading-relaxed text-ink-soft [word-break:keep-all]">{pinned.summary}</span>
            </Link>
          )}

          <section aria-labelledby="category-title">
            <h2 id="category-title" className="text-xl font-semibold md:text-2xl">{label}</h2>
            <p className="mt-1 mb-6 text-[0.9375rem] text-ink-soft [word-break:keep-all]">{description}</p>
            {category === "tools" ? (
              <ToolsSection posts={rest} />
            ) : rest.length === 0 ? (
              <p className="card p-6 text-ink-soft">아직 글이 없습니다.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.slug}>
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="mt-16 text-sm text-ink-faint">
            새 글은{" "}
            <a href="/blog/feed.xml" className="underline underline-offset-4">
              RSS
            </a>
            로도 받아 보실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
