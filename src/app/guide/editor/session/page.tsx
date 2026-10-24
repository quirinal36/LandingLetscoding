import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getViewer } from "@/lib/supabase/server";
import { getGuide, type EditableSession } from "@/lib/guide";
import { GuideAuthControls } from "@/components/guide/auth-controls";
import { SessionEditor } from "@/components/guide/session-editor";

export const metadata: Metadata = { title: "가이드 세션 관리", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { user, isAdmin } = await getViewer();
  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-5 text-2xl font-semibold">관리자 로그인이 필요합니다.</h1>
        <GuideAuthControls next="/guide" placement="bottom" />
      </div>
    );
  }
  const { slug } = await searchParams;
  const sessions = await getGuide();
  const nextSort = sessions.reduce((max, s) => Math.max(max, s.sortOrder), 0) + 10;
  let session: EditableSession | undefined;
  let lessonCount = 0;
  if (slug) {
    const found = sessions.find((s) => s.slug === slug);
    if (!found) notFound();
    session = { id: found.id, updated_at: found.updatedAt, slug: found.slug, title: found.title, description: found.description, sort_order: String(found.sortOrder) };
    lessonCount = found.lessons.length;
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <h1 className="text-3xl font-semibold">{session ? "가이드 세션 수정" : "가이드 세션 추가"}</h1>
      <p className="mt-3 text-ink-soft">세션은 편을 묶는 가장 큰 단위입니다. 클론코딩 시연처럼 순서 없이 쌓이는 묶음도 세션 하나로 둡니다.</p>
      <SessionEditor key={session?.id ?? "new"} session={session} nextSort={nextSort} lessonCount={lessonCount} />
    </div>
  );
}
