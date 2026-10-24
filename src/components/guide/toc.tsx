import Link from "next/link";
import { flattenGuide, type Session } from "@/lib/guide";
import { cn } from "@/lib/cn";
import { Dot } from "@/components/ui";
import { LessonChips } from "./chips";

/** 가이드 첫 화면의 전체 목차. 세션마다 편을 번호 순으로 늘어놓는다. */
export function GuideIndex({ sessions, editable }: { sessions: Session[]; editable: boolean }) {
  return (
    <div className="space-y-14">
      {sessions.map((session, si) => (
        <section key={session.slug} id={session.slug} aria-labelledby={`session-${session.slug}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id={`session-${session.slug}`} className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">
              <span className="mr-2 font-mono text-base text-ink-faint">{si + 1}부</span>
              {session.title}
            </h2>
            {editable && (
              <Link href={`/guide/editor/session?slug=${encodeURIComponent(session.slug)}`} className="text-sm text-ink-soft underline underline-offset-4">
                세션 수정
              </Link>
            )}
          </div>
          {session.description && <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-soft">{session.description}</p>}
          {session.lessons.length === 0 ? (
            <p className="card mt-5 p-5 text-sm text-ink-faint">아직 편이 없습니다.</p>
          ) : (
            <ol className="mt-5 grid gap-3">
              {session.lessons.map((lesson, li) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/guide/${lesson.slug}`}
                    className="card flex gap-4 p-5 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="w-10 shrink-0 pt-0.5 font-mono text-sm text-ink-faint">{si + 1}.{li + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{lesson.title}</span>
                      {lesson.summary && <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">{lesson.summary}</span>}
                      <LessonChips lesson={lesson} className="mt-3" />
                    </span>
                  </Link>
                  {editable && (
                    <div className="mt-1 text-right">
                      <Link href={`/guide/editor?slug=${encodeURIComponent(lesson.slug)}`} className="text-xs text-ink-soft underline underline-offset-4">
                        수정
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  );
}

type SidebarProps = { sessions: Session[]; currentSlug: string; chapters: { title: string }[] };

/** 편 페이지 옆의 목차. 현재 편 아래에 소제목까지 펼친다. */
export function GuideSidebar({ sessions, currentSlug, chapters }: SidebarProps) {
  const refs = flattenGuide(sessions);
  return (
    <nav aria-label="가이드 목차" className="text-sm">
      <Link href="/guide" className="block font-semibold text-ink hover:text-accent-ink">가이드 목차</Link>
      <ol className="mt-4 space-y-5">
        {sessions.map((session, si) => (
          <li key={session.slug}>
            <p className="mb-1.5 text-xs font-semibold text-ink-faint">{si + 1}부 · {session.title}</p>
            <ol className="space-y-0.5">
              {session.lessons.map((lesson) => {
                const ref = refs.find((r) => r.lesson.slug === lesson.slug)!;
                const current = lesson.slug === currentSlug;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/guide/${lesson.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={cn("menu-row items-start gap-2 rounded-lg px-2 py-1.5 leading-snug", current ? "card font-semibold" : "text-ink-soft hover:text-ink")}
                    >
                      <span className="mt-1.5 shrink-0"><Dot on={current} /></span>
                      <span><span className="mr-1.5 font-mono text-xs text-ink-faint">{ref.number}</span>{lesson.title}{!lesson.isComplete && <span className="ml-1 text-xs font-normal text-ink-faint">준비 중</span>}</span>
                    </Link>
                    {current && chapters.length > 0 && (
                      <ol className="mt-1 mb-2 ml-7 space-y-0.5 border-l border-separator pl-3">
                        {chapters.map((chapter, ci) => (
                          <li key={ci}>
                            <a href={`#c${ci + 1}`} className="block py-1 text-[0.8125rem] leading-snug text-ink-soft hover:text-ink">
                              {chapter.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
