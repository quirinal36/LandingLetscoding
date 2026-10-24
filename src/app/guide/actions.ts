"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/supabase/server";
import { UUID, validateLesson, validateSession } from "@/lib/guide";

const LOGIN_REQUIRED = "관리자 로그인 후 다시 시도해 주세요.";
const SAVE_FAILED = "저장하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도해 주세요.";

function revalidateGuide(...slugs: (string | undefined)[]) {
  revalidatePath("/guide");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) if (slug) revalidatePath(`/guide/${slug}`);
}

export async function saveLesson(payload: unknown, id?: string, updatedAt?: string) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user || !isAdmin) return { error: LOGIN_REQUIRED };
  let parsed;
  try { parsed = validateLesson(payload); } catch (error) {
    return { error: error instanceof Error ? error.message : "입력 내용을 확인해 주세요." };
  }
  const { notes, ...values } = parsed;
  const table = supabase.schema("landing").from("guide_lessons");
  let original: { slug: string; updated_at: string } | null = null;
  if (id) {
    if (!UUID.test(id) || !updatedAt || !Number.isFinite(Date.parse(updatedAt))) return { error: "수정할 편 정보를 확인해 주세요." };
    const result = await table.select("slug,updated_at").eq("id", id).maybeSingle();
    if (result.error) return { error: "원본을 확인하지 못했습니다." };
    if (!result.data) return { error: "편이 삭제되었거나 접근 권한이 없습니다." };
    original = result.data;
    if (original.updated_at !== updatedAt) return { error: "다른 곳에서 내용이 변경되었습니다. 새로고침 후 다시 수정해 주세요." };
  }
  const result = id
    ? await table.update(values).eq("id", id).eq("updated_at", updatedAt!).select("id,slug").maybeSingle()
    : await table.insert(values).select("id,slug").single();
  if (result.error) {
    if (result.error.code === "23505") return { error: "이미 사용 중인 편 주소입니다." };
    if (result.error.code === "23503") return { error: "선택한 세션이 없습니다. 새로고침 후 다시 선택해 주세요." };
    return { error: SAVE_FAILED };
  }
  if (!result.data) return { error: "편이 변경되거나 삭제되었습니다. 새로고침 후 확인해 주세요." };
  const saved = result.data as { id: string; slug: string };
  const notesResult = await supabase.schema("landing").from("guide_lesson_notes").upsert({ lesson_id: saved.id, notes });
  revalidateGuide(original?.slug, saved.slug);
  if (notesResult.error) return { error: "본문은 저장했지만 촬영 메모를 저장하지 못했습니다. 메모를 다시 저장해 주세요.", slug: saved.slug };
  return { slug: saved.slug };
}

export async function deleteLesson(id: string, updatedAt: string) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user || !isAdmin) return { error: LOGIN_REQUIRED };
  if (!UUID.test(id) || !Number.isFinite(Date.parse(updatedAt))) return { error: "삭제할 편 정보를 확인해 주세요." };
  const { data, error } = await supabase.schema("landing").from("guide_lessons").delete()
    .eq("id", id).eq("updated_at", updatedAt).select("slug").maybeSingle();
  if (error) return { error: "삭제하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  if (!data) return { error: "편이 변경되거나 이미 삭제되었습니다. 새로고침 후 확인해 주세요." };
  revalidateGuide(data.slug);
  return { success: true };
}

export async function saveSession(payload: unknown, id?: string, updatedAt?: string) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user || !isAdmin) return { error: LOGIN_REQUIRED };
  let values;
  try { values = validateSession(payload); } catch (error) {
    return { error: error instanceof Error ? error.message : "입력 내용을 확인해 주세요." };
  }
  const table = supabase.schema("landing").from("guide_sessions");
  if (id) {
    if (!UUID.test(id) || !updatedAt || !Number.isFinite(Date.parse(updatedAt))) return { error: "수정할 세션 정보를 확인해 주세요." };
    const result = await table.select("updated_at").eq("id", id).maybeSingle();
    if (result.error) return { error: "원본을 확인하지 못했습니다." };
    if (!result.data) return { error: "세션이 삭제되었거나 접근 권한이 없습니다." };
    if (result.data.updated_at !== updatedAt) return { error: "다른 곳에서 내용이 변경되었습니다. 새로고침 후 다시 수정해 주세요." };
  }
  const result = id
    ? await table.update(values).eq("id", id).eq("updated_at", updatedAt!).select("slug").maybeSingle()
    : await table.insert(values).select("slug").single();
  if (result.error) return { error: result.error.code === "23505" ? "이미 사용 중인 세션 주소입니다." : SAVE_FAILED };
  if (!result.data) return { error: "세션이 변경되거나 삭제되었습니다. 새로고침 후 확인해 주세요." };
  revalidateGuide();
  return { slug: result.data.slug as string };
}

export async function deleteSession(id: string, updatedAt: string) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user || !isAdmin) return { error: LOGIN_REQUIRED };
  if (!UUID.test(id) || !Number.isFinite(Date.parse(updatedAt))) return { error: "삭제할 세션 정보를 확인해 주세요." };
  const { data, error } = await supabase.schema("landing").from("guide_sessions").delete()
    .eq("id", id).eq("updated_at", updatedAt).select("slug").maybeSingle();
  if (error) return { error: error.code === "23503" ? "편이 남아 있는 세션은 삭제할 수 없습니다. 편을 먼저 옮기거나 삭제해 주세요." : "삭제하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  if (!data) return { error: "세션이 변경되거나 이미 삭제되었습니다. 새로고침 후 확인해 주세요." };
  revalidateGuide();
  return { success: true };
}
