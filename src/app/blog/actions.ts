"use server";

import { revalidatePath } from "next/cache";
import { getViewer } from "@/lib/supabase/server";
import { UUID, validatePost } from "@/lib/blog";

export async function savePost(payload: unknown, id?: string, updatedAt?: string) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user || !isAdmin) return { error: "관리자 로그인 후 다시 시도해 주세요." };
  let values;
  try { values = validatePost(payload); } catch (error) {
    return { error: error instanceof Error ? error.message : "입력 내용을 확인해 주세요." };
  }
  const table = supabase.schema("landing").from("blog_posts");
  let original = null;
  if (id) {
    if (!UUID.test(id) || !updatedAt || !Number.isFinite(Date.parse(updatedAt))) return { error: "수정할 글 정보를 확인해 주세요." };
    const result = await table.select("slug,published_at,updated_at").eq("id", id).maybeSingle();
    if (result.error) return { error: "원본 글을 확인하지 못했습니다." };
    if (!result.data) return { error: "글이 삭제되었거나 접근 권한이 없습니다." };
    original = result.data;
    if (original.updated_at !== updatedAt) return { error: "다른 곳에서 글이 변경되었습니다. 새로고침 후 다시 수정해 주세요." };
  }
  const published_at = original?.published_at ?? (values.is_published ? new Date().toISOString() : null);
  const result = id
    ? await table.update({ ...values, published_at }).eq("id", id).eq("updated_at", updatedAt!).select("slug").maybeSingle()
    : await table.insert({ ...values, published_at, author_id: user.id }).select("slug").single();
  if (result.error) return { error: result.error.code === "23505" ? "이미 사용 중인 글 주소입니다." : "저장하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도해 주세요." };
  if (!result.data) return { error: "글이 변경되거나 삭제되었습니다. 새로고침 후 확인해 주세요." };
  revalidatePath("/blog");
  if (original) revalidatePath(`/blog/${original.slug}`);
  revalidatePath(`/blog/${result.data.slug}`);
  return { slug: result.data.slug as string, published: values.is_published };
}

export async function deletePost(id: string, updatedAt: string) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user || !isAdmin) return { error: "관리자 로그인 후 다시 시도해 주세요." };
  if (!UUID.test(id) || !Number.isFinite(Date.parse(updatedAt))) return { error: "삭제할 글 정보를 확인해 주세요." };
  const { data, error } = await supabase.schema("landing").from("blog_posts").delete()
    .eq("id", id).eq("updated_at", updatedAt).select("slug").maybeSingle();
  if (error) return { error: "삭제하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  if (!data) return { error: "글이 변경되거나 이미 삭제되었습니다. 새로고침 후 확인해 주세요." };
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  return { success: true };
}
