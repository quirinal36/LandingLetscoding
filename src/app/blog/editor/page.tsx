import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getViewer } from "@/lib/supabase/server";
import { AuthControls } from "@/components/blog/auth-controls";
import { BlogEditor } from "@/components/blog/editor";
import type { EditablePost } from "@/lib/blog";

export const metadata: Metadata = { title: "블로그 글 관리", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
  const { user, isAdmin, supabase } = await getViewer();
  if (!user || !isAdmin) return <div className="mx-auto max-w-3xl px-4 py-16">
    <h1 className="mb-5 text-2xl font-semibold">관리자 로그인이 필요합니다.</h1><AuthControls />
  </div>;
  const { slug } = await searchParams;
  let post: EditablePost | undefined;
  if (slug) {
    const { data, error } = await supabase.schema("landing").from("blog_posts").select("id,slug,title,summary,category,author_name,author_title,cover_image_url,is_published,blocks,updated_at").eq("slug", slug).maybeSingle();
    if (error) throw new Error("편집할 글을 불러오지 못했습니다.");
    if (!data) notFound();
    post = { ...data, cover_image_url: data.cover_image_url ?? "" } as EditablePost;
  }
  return <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
    <h1 className="text-3xl font-semibold">{post ? "블로그 글 수정" : "블로그 글 작성"}</h1>
    <BlogEditor key={post?.id ?? "new"} post={post} />
  </div>;
}
