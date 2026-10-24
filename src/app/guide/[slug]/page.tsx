import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/product";
import { GuideAuthControls } from "@/components/guide/auth-controls";
import { LessonChips } from "@/components/guide/chips";
import { LessonBody } from "@/components/guide/lesson-body";
import { GuideSidebar } from "@/components/guide/toc";
import { GuideVideo } from "@/components/guide/video";
import { GUIDE_TITLE, findLesson, formatDate, getGuide, youtubeThumbnail, youtubeWatchUrl } from "@/lib/guide";
import { COMPANY } from "@/lib/nav";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = findLesson(await getGuide(), (await params).slug);
  if (!found) return {};
  const { lesson, session, number } = found.current;
  const title = `${number} ${lesson.title}`;
  const description = lesson.summary || `${session.title} · ${GUIDE_TITLE}`;
  const image = lesson.youtubeId ? { url: youtubeThumbnail(lesson.youtubeId) } : { url: "/landing/og.jpg", width: 1897, height: 990 };
  return {
    title,
    description,
    // 본문이 아직 없는 편은 색인에서 뺀다. 링크는 계속 따라가게 둔다.
    robots: lesson.hasContent ? undefined : { index: false, follow: true },
    openGraph: {
      type: "article", locale: "ko_KR", siteName: COMPANY.short, title, description, url: "./",
      modifiedTime: lesson.updatedAt, section: session.title, images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const sessions = await getGuide();
  const found = findLesson(sessions, slug);
  if (!found) notFound();
  const { current, prev, next } = found;
  const { lesson, session, sessionNumber, number } = current;
  const url = `${COMPANY.url}/guide/${lesson.slug}`;
  const editHref = `/guide/editor?slug=${encodeURIComponent(lesson.slug)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: lesson.title,
          description: lesson.summary,
          url,
          mainEntityOfPage: url,
          inLanguage: "ko-KR",
          articleSection: session.title,
          isPartOf: { "@type": "CreativeWorkSeries", name: GUIDE_TITLE, url: `${COMPANY.url}/guide` },
          position: current.index + 1,
          dateModified: lesson.updatedAt,
          publisher: { "@type": "Organization", "@id": `${COMPANY.url}/#organization`, name: COMPANY.name, url: COMPANY.url, logo: `${COMPANY.url}/icon.png` },
          ...(lesson.youtubeId && {
            video: {
              "@type": "VideoObject", name: lesson.title, description: lesson.summary || lesson.title,
              thumbnailUrl: youtubeThumbnail(lesson.youtubeId), embedUrl: `https://www.youtube-nocookie.com/embed/${lesson.youtubeId}`,
              contentUrl: youtubeWatchUrl(lesson.youtubeId), uploadDate: lesson.updatedAt,
            },
          }),
        }}
      />

      {/* 데스크톱 옆 목차 */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-6">
          <GuideSidebar sessions={sessions} currentSlug={lesson.slug} chapters={lesson.chapters} />
        </div>
      </aside>

      <article className="min-w-0 max-w-3xl">
        <nav aria-label="현재 위치" className="flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
          <Link href="/guide" className="hover:text-ink">가이드</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/guide#${session.slug}`} className="hover:text-ink">{sessionNumber}부 {session.title}</Link>
        </nav>

        {/* 모바일 목차 */}
        <details className="card mt-5 lg:hidden">
          <summary className="cursor-pointer px-5 py-3.5 font-semibold">목차</summary>
          <div className="hairline border-t px-5 py-4">
            <GuideSidebar sessions={sessions} currentSlug={lesson.slug} chapters={lesson.chapters} />
          </div>
        </details>

        <div className="mt-6"><GuideAuthControls next={`/guide/${lesson.slug}`} editHref={editHref} placement="top" /></div>

        <header className="mt-8 mb-10">
          <p className="font-mono text-sm text-ink-faint">{number}</p>
          <h1 className="mt-1 text-3xl leading-tight font-semibold tracking-[-0.025em] [word-break:keep-all] md:text-[2.5rem]">{lesson.title}</h1>
          {lesson.summary && <p className="mt-5 text-lg leading-relaxed text-ink-soft [word-break:keep-all]">{lesson.summary}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <LessonChips lesson={lesson} />
            <span className="text-xs text-ink-faint">수정 <time dateTime={lesson.updatedAt}>{formatDate(lesson.updatedAt)}</time></span>
          </div>
        </header>

        {lesson.youtubeId ? (
          <div className="mb-12">
            <GuideVideo youtubeId={lesson.youtubeId} title={lesson.title} chapters={lesson.chapters.map((c) => ({ title: c.title, start: c.start }))} />
          </div>
        ) : lesson.targetMinutes != null ? (
          <p className="track mb-12 px-5 py-4 text-sm leading-relaxed text-ink-soft">
            이 편의 영상은 준비 중입니다. 아래 글로 먼저 따라 하실 수 있고, 영상이 올라오면 이 자리에 보입니다.
          </p>
        ) : null}

        <LessonBody chapters={lesson.chapters} />

        <nav aria-label="이전·다음 편" className="hairline mt-16 grid gap-3 border-t pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/guide/${prev.lesson.slug}`} className="card block p-5 transition-transform hover:-translate-y-0.5">
              <span className="text-xs font-semibold text-ink-faint">← 이전 · {prev.number}</span>
              <span className="mt-1 block font-semibold [word-break:keep-all]">{prev.lesson.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/guide/${next.lesson.slug}`} className="card block p-5 text-right transition-transform hover:-translate-y-0.5 sm:col-start-2">
              <span className="text-xs font-semibold text-ink-faint">다음 · {next.number} →</span>
              <span className="mt-1 block font-semibold [word-break:keep-all]">{next.lesson.title}</span>
            </Link>
          ) : (
            <Link href="/guide" className="card block p-5 text-right transition-transform hover:-translate-y-0.5 sm:col-start-2">
              <span className="text-xs font-semibold text-ink-faint">마지막 편입니다</span>
              <span className="mt-1 block font-semibold">목차로 돌아가기</span>
            </Link>
          )}
        </nav>

        <footer className="mt-14">
          <div className="card p-6">
            <p className="font-semibold">따라 하다가 막히셨나요?</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">도입 상담에서 화면을 함께 보며 설정을 도와드립니다.</p>
            <Link href="/seminar/inquiry" className="link-chevron mt-4 inline-block text-sm">도입문의</Link>
          </div>
          <div className="mt-8"><GuideAuthControls next={`/guide/${lesson.slug}`} placement="bottom" /></div>
        </footer>
      </article>
    </div>
  );
}
