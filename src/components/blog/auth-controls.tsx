import { getViewer } from "@/lib/supabase/server";
import { loginWithKakao, logout } from "@/app/auth/actions";
import { Button, ButtonLink } from "@/components/ui";
import { DeletePost } from "@/components/blog/delete-post";

export async function AuthControls({ slug }: { slug?: string }) {
  const { user, isAdmin, error, supabase } = await getViewer();
  let post = null;
  if (isAdmin && slug) {
    const result = await supabase.schema("landing").from("blog_posts").select("id,updated_at,title").eq("slug", slug).maybeSingle();
    post = result.data;
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {isAdmin && <ButtonLink href="/blog/editor" size="sm" tone="accent">글 작성</ButtonLink>}
      {isAdmin && post && <>
        <ButtonLink href={`/blog/editor?slug=${encodeURIComponent(slug!)}`} size="sm">수정</ButtonLink>
        <DeletePost id={post.id} updatedAt={post.updated_at} title={post.title} />
      </>}
      {user ? <>
        {!isAdmin && !error && <span className="text-sm text-ink-soft">글 관리는 관리자 계정으로 이용할 수 있습니다.</span>}
        <form action={logout}><Button type="submit" size="sm">로그아웃</Button></form>
      </> : <form action={loginWithKakao}>
        <Button type="submit" size="sm" className="border-transparent bg-[#FEE500] text-[#191919]">카카오 로그인</Button>
      </form>}
    </div>
  );
}
