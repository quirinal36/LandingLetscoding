"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSession, saveSession } from "@/app/guide/actions";
import type { EditableSession, SessionEditorValues } from "@/lib/guide";
import { Button, ButtonLink } from "@/components/ui";

const field = "mt-2 w-full rounded-xl border border-black/20 bg-white p-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export function SessionEditor({ session, nextSort, lessonCount }: { session?: EditableSession; nextSort: number; lessonCount: number }) {
  const [values, setValues] = useState<SessionEditorValues>(session ?? { slug: "", title: "", description: "", sort_order: String(nextSort) });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <form className="mt-8 space-y-6" onSubmit={(event) => {
      event.preventDefault(); setError("");
      startTransition(async () => {
        try {
          const result = await saveSession(values, session?.id, session?.updated_at);
          if (result.error) { setError(result.error); return; }
          router.push(`/guide#${result.slug}`); router.refresh();
        } catch { setError("저장하지 못했습니다. 입력 내용은 유지됩니다. 로그인 상태와 연결을 확인해 주세요."); }
      });
    }}>
      <fieldset disabled={pending} className="space-y-6 disabled:opacity-60">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">세션 제목 *
            <input className={field} required maxLength={120} value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} />
          </label>
          <label className="block text-sm font-medium">세션 주소 *
            <input className={field} required minLength={2} maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={values.slug} onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))} />
            <span className="mt-1 block text-xs text-ink-soft">영문 소문자·숫자·하이픈. 목차의 바로가기 이름으로 쓰입니다.</span>
          </label>
        </div>
        <label className="block text-sm font-medium">설명
          <textarea className={field} rows={3} maxLength={1000} value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />
        </label>
        <label className="block text-sm font-medium">순서 *
          <input className={field} type="number" min={0} max={100000} required value={values.sort_order} onChange={(e) => setValues((v) => ({ ...v, sort_order: e.target.value }))} />
          <span className="mt-1 block text-xs text-ink-soft">작은 수가 먼저 옵니다. 새 세션은 마지막 다음 번호가 기본값입니다.</span>
        </label>
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" tone="accent">{pending ? "저장 중…" : "저장"}</Button>
          <ButtonLink href="/guide">목차로</ButtonLink>
        </div>
      </fieldset>
      {session && !pending && (
        <div className="hairline border-t pt-6">
          {lessonCount > 0 ? (
            <p className="text-sm text-ink-soft">편이 {lessonCount}개 남아 있어 삭제할 수 없습니다. 편을 다른 세션으로 옮기거나 삭제한 뒤 지울 수 있습니다.</p>
          ) : (
            <Button size="sm" className="text-red-700" onClick={() => {
              if (!window.confirm(`“${session.title}” 세션을 삭제할까요?`)) return;
              setError("");
              startTransition(async () => {
                try {
                  const result = await deleteSession(session.id, session.updated_at);
                  if (result.error) { setError(result.error); return; }
                  router.push("/guide"); router.refresh();
                } catch { setError("삭제하지 못했습니다. 로그인 상태와 연결을 확인해 주세요."); }
              });
            }}>세션 삭제</Button>
          )}
        </div>
      )}
    </form>
  );
}
