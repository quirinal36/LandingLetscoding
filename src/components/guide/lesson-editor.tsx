"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteLesson, saveLesson } from "@/app/guide/actions";
import { AUDIENCES, type Audience, type EditableLesson, type EditorBlock, type EditorChapter, type LessonEditorValues } from "@/lib/guide";
import { Button, ButtonLink } from "@/components/ui";

export type SessionOption = { id: string; slug: string; title: string; maxSort: number };

const field = "mt-2 w-full rounded-xl border border-black/20 bg-white p-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

function swap<T>(items: T[], index: number, direction: number) {
  const next = [...items];
  [next[index], next[index + direction]] = [next[index + direction], next[index]];
  return next;
}

export function LessonEditor({ sessions, lesson }: { sessions: SessionOption[]; lesson?: EditableLesson }) {
  const [values, setValues] = useState<LessonEditorValues>(lesson ?? {
    session_id: sessions[0]?.id ?? "", slug: "", title: "", summary: "", audience: "전체",
    youtube_url: "", target_minutes: "", is_complete: false, sort_order: String((sessions[0]?.maxSort ?? 0) + 10),
    chapters: [{ title: "", start: "", blocks: [{ type: "text", content: "" }] }], notes: "",
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const setChapter = (index: number, change: Partial<EditorChapter>) =>
    setValues((v) => ({ ...v, chapters: v.chapters.map((c, i) => (i === index ? { ...c, ...change } : c)) }));
  const setBlock = (ci: number, bi: number, change: Partial<EditorBlock>) =>
    setChapter(ci, { blocks: values.chapters[ci].blocks.map((b, i) => (i === bi ? { ...b, ...change } : b)) });

  return (
    <form className="mt-8 space-y-8" onSubmit={(event) => {
      event.preventDefault(); setError("");
      startTransition(async () => {
        try {
          const result = await saveLesson(values, lesson?.id, lesson?.updated_at);
          if (result.error) { setError(result.error); if (!result.slug) return; }
          router.push(`/guide/${result.slug}`); router.refresh();
        } catch { setError("저장하지 못했습니다. 입력 내용은 유지됩니다. 로그인 상태와 연결을 확인해 주세요."); }
      });
    }}>
      <fieldset disabled={pending} className="space-y-8 disabled:opacity-60">
        <section className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">세션 *
            <select className={field} required value={values.session_id} onChange={(e) => {
              const session = sessions.find((s) => s.id === e.target.value);
              setValues((v) => ({ ...v, session_id: e.target.value, sort_order: lesson ? v.sort_order : String((session?.maxSort ?? 0) + 10) }));
            }}>
              {sessions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <span className="mt-1 block text-xs text-ink-soft">세션이 없으면 먼저 <Link href="/guide/editor/session" className="underline">새 세션</Link>을 만듭니다.</span>
          </label>
          <label className="block text-sm font-medium">순서 *
            <input className={field} type="number" min={0} max={100000} required value={values.sort_order} onChange={(e) => setValues((v) => ({ ...v, sort_order: e.target.value }))} />
            <span className="mt-1 block text-xs text-ink-soft">세션 안에서 작은 수가 먼저 옵니다. 새 편은 마지막 다음 번호가 기본값입니다.</span>
          </label>
          <label className="block text-sm font-medium">제목 *
            <input className={field} required maxLength={200} value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} />
          </label>
          <label className="block text-sm font-medium">편 주소 *
            <input className={field} required minLength={2} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={values.slug} onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))} />
            <span className="mt-1 block text-xs text-ink-soft">영문 소문자·숫자·하이픈. /guide/주소 로 열립니다.</span>
          </label>
          <label className="block text-sm font-medium">화면(대상) *
            <select className={field} value={values.audience} onChange={(e) => setValues((v) => ({ ...v, audience: e.target.value as Audience }))}>
              {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">목표 길이(분)
            <input className={field} type="number" min={1} max={180} value={values.target_minutes} placeholder="비우면 글 자료" onChange={(e) => setValues((v) => ({ ...v, target_minutes: e.target.value }))} />
          </label>
        </section>

        <label className="block text-sm font-medium">요약
          <textarea className={field} rows={3} maxLength={1000} value={values.summary} onChange={(e) => setValues((v) => ({ ...v, summary: e.target.value }))} />
        </label>

        <label className="block text-sm font-medium">유튜브 주소
          <input className={field} maxLength={500} placeholder="https://www.youtube.com/watch?v=… 또는 https://youtu.be/…" value={values.youtube_url} onChange={(e) => setValues((v) => ({ ...v, youtube_url: e.target.value }))} />
          <span className="mt-1 block text-xs text-ink-soft">영상을 올린 뒤 주소를 붙여 넣습니다. 비워 두면 영상 없이 글만 보입니다.</span>
        </label>

        <section>
          <h2 className="text-xl font-semibold">소제목과 내용</h2>
          <p className="mt-2 text-sm text-ink-soft">소제목은 영상 챕터와 같은 단위입니다. 시작 시간을 mm:ss로 적으면 영상에서 그 지점으로 이동합니다. 텍스트에서 ## 소소제목, &gt; 강조, - 목록, 1. 번호 목록을 쓸 수 있습니다.</p>
          <div className="mt-5 space-y-6">
            {values.chapters.map((chapter, ci) => (
              <fieldset key={ci} className="card p-5">
                <legend className="px-2 text-sm font-semibold">소제목 {ci + 1}</legend>
                <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
                  <label className="block text-sm">제목 *
                    <input className={field} required maxLength={120} value={chapter.title} onChange={(e) => setChapter(ci, { title: e.target.value })} />
                  </label>
                  <label className="block text-sm">시작 시간
                    <input className={field} placeholder="mm:ss" pattern="\d+(:[0-5]?\d){0,2}" value={chapter.start} onChange={(e) => setChapter(ci, { start: e.target.value })} />
                  </label>
                </div>
                <div className="mt-4 space-y-4">
                  {chapter.blocks.map((block, bi) => (
                    <div key={bi} className="track p-4">
                      <p className="text-xs font-semibold text-ink-soft">{bi + 1}. {block.type === "image" ? "이미지" : block.type === "prompt" ? "코드·요청문" : "텍스트"}</p>
                      {block.type === "image" ? (
                        <>
                          <label className="mt-2 block text-sm">이미지 주소 *<input className={field} required value={block.url ?? ""} onChange={(e) => setBlock(ci, bi, { url: e.target.value })} /></label>
                          <label className="mt-3 block text-sm">이미지 설명<input className={field} maxLength={1000} value={block.alt ?? ""} onChange={(e) => setBlock(ci, bi, { alt: e.target.value })} /></label>
                        </>
                      ) : (
                        <label className="mt-2 block text-sm">내용 *<textarea className={field} rows={block.type === "prompt" ? 4 : 8} required value={block.content ?? ""} onChange={(e) => setBlock(ci, bi, { content: e.target.value })} /></label>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" disabled={bi === 0} onClick={() => setChapter(ci, { blocks: swap(chapter.blocks, bi, -1) })}>위로</Button>
                        <Button size="sm" disabled={bi === chapter.blocks.length - 1} onClick={() => setChapter(ci, { blocks: swap(chapter.blocks, bi, 1) })}>아래로</Button>
                        <Button size="sm" onClick={() => {
                          const filled = block.type === "image" ? block.url : block.content;
                          if (filled && !window.confirm("이 블록을 지울까요?")) return;
                          setChapter(ci, { blocks: chapter.blocks.filter((_, i) => i !== bi) });
                        }}>블록 삭제</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {([["text", "텍스트 추가"], ["image", "이미지 추가"], ["prompt", "코드·요청문 추가"]] as const).map(([type, label]) => (
                    <Button key={type} size="sm" disabled={chapter.blocks.length >= 60} onClick={() => setChapter(ci, { blocks: [...chapter.blocks, type === "image" ? { type, url: "", alt: "" } : { type, content: "" }] })}>{label}</Button>
                  ))}
                </div>
                <div className="hairline mt-5 flex flex-wrap gap-2 border-t pt-4">
                  <Button size="sm" disabled={ci === 0} onClick={() => setValues((v) => ({ ...v, chapters: swap(v.chapters, ci, -1) }))}>소제목 위로</Button>
                  <Button size="sm" disabled={ci === values.chapters.length - 1} onClick={() => setValues((v) => ({ ...v, chapters: swap(v.chapters, ci, 1) }))}>소제목 아래로</Button>
                  <Button size="sm" className="text-red-700" onClick={() => {
                    if ((chapter.title || chapter.blocks.some((b) => b.content || b.url)) && !window.confirm(`소제목 ${ci + 1}과 그 내용을 지울까요?`)) return;
                    setValues((v) => ({ ...v, chapters: v.chapters.filter((_, i) => i !== ci) }));
                  }}>소제목 삭제</Button>
                </div>
              </fieldset>
            ))}
          </div>
          <div className="mt-4">
            <Button size="sm" disabled={values.chapters.length >= 40} onClick={() => setValues((v) => ({ ...v, chapters: [...v.chapters, { title: "", start: "", blocks: [{ type: "text", content: "" }] }] }))}>소제목 추가</Button>
          </div>
        </section>

        <label className="block text-sm font-medium">촬영 메모 <span className="font-normal text-ink-soft">(관리자만 봅니다)</span>
          <textarea className={`${field} font-mono text-sm`} rows={10} maxLength={20000} value={values.notes} placeholder="화면 기준 대본, 준비물, 주의할 점" onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))} />
        </label>

        <label className="flex min-h-11 items-center gap-3 font-medium">
          <input type="checkbox" className="size-5" checked={values.is_complete} onChange={(e) => setValues((v) => ({ ...v, is_complete: e.target.checked }))} />
          완성 <span className="text-sm font-normal text-ink-soft">해제하면 목차에 ‘준비 중’으로 표시됩니다. 준비 중인 편도 누구나 볼 수 있습니다.</span>
        </label>

        {error && <p role="alert" className="text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" tone="accent">{pending ? "저장 중…" : "저장"}</Button>
          <ButtonLink href={lesson ? `/guide/${lesson.slug}` : "/guide"}>{lesson ? "편 보기" : "목차로"}</ButtonLink>
        </div>
      </fieldset>
      {lesson && !pending && <DeleteLesson id={lesson.id} updatedAt={lesson.updated_at} title={lesson.title} />}
    </form>
  );
}

function DeleteLesson({ id, updatedAt, title }: { id: string; updatedAt: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="hairline border-t pt-6">
      <Button size="sm" className="text-red-700" disabled={pending} onClick={() => {
        if (!window.confirm(`“${title}” 편을 삭제할까요? 촬영 메모도 함께 지워지며 복구할 수 없습니다.`)) return;
        setError("");
        startTransition(async () => {
          try {
            const result = await deleteLesson(id, updatedAt);
            if (result.error) { setError(result.error); return; }
            router.push("/guide"); router.refresh();
          } catch { setError("삭제하지 못했습니다. 로그인 상태와 연결을 확인해 주세요."); }
        });
      }}>{pending ? "삭제 중…" : "이 편 삭제"}</Button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
