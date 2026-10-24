import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getViewer } from "@/lib/supabase/server";
import { getGuide, toEditableLesson, type EditableLesson } from "@/lib/guide";
import { GuideAuthControls } from "@/components/guide/auth-controls";
import { LessonEditor, type SessionOption } from "@/components/guide/lesson-editor";

export const metadata: Metadata = { title: "가이드 편 관리", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { user, isAdmin, supabase } = await getViewer();
  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-5 text-2xl font-semibold">관리자 로그인이 필요합니다.</h1>
        <GuideAuthControls next="/guide" placement="bottom" />
      </div>
    );
  }
  const { slug } = await searchParams;
  const sessions: SessionOption[] = (await getGuide()).map((s) => ({
    id: s.id, slug: s.slug, title: s.title, maxSort: s.lessons.reduce((max, l) => Math.max(max, l.sortOrder), 0),
  }));
  let lesson: EditableLesson | undefined;
  if (slug) {
    const { data, error } = await supabase.schema("landing").from("guide_lessons")
      .select("id,session_id,slug,title,summary,audience,youtube_id,target_minutes,is_complete,chapters,sort_order,updated_at,guide_lesson_notes(notes)")
      .eq("slug", slug).maybeSingle();
    if (error) throw new Error("편집할 편을 불러오지 못했습니다.");
    if (!data) notFound();
    const notesRow = Array.isArray(data.guide_lesson_notes) ? data.guide_lesson_notes[0] : data.guide_lesson_notes;
    lesson = toEditableLesson(data as Record<string, unknown>, typeof notesRow?.notes === "string" ? notesRow.notes : "");
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <h1 className="text-3xl font-semibold">{lesson ? "가이드 편 수정" : "가이드 편 작성"}</h1>
      {sessions.length === 0 && <p role="alert" className="mt-4 text-red-700">세션이 없습니다. 먼저 새 세션을 만들어 주세요.</p>}
      <LessonEditor key={lesson?.id ?? "new"} sessions={sessions} lesson={lesson} />
    </div>
  );
}
