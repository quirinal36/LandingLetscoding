import { getViewer } from "@/lib/supabase/server";
import { loginWithKakao, logout } from "@/app/auth/actions";
import { Button, ButtonLink } from "@/components/ui";

type Props = {
  /** 로그인·로그아웃 뒤 돌아갈 가이드 경로. */
  next: string;
  /** 현재 편의 수정 화면. 편 페이지에서만 준다. */
  editHref?: string;
  /** top은 관리자에게만 편집 버튼을 보여 주고, bottom은 로그인·로그아웃을 맡는다. */
  placement: "top" | "bottom";
};

/** 가이드의 관리자 컨트롤. 블로그와 같은 계정·권한을 쓴다. */
export async function GuideAuthControls({ next, editHref, placement }: Props) {
  const { user, isAdmin, error } = await getViewer();
  if (placement === "top") {
    if (!isAdmin) return null;
    return (
      <div className="card flex flex-wrap items-center gap-3 p-4" aria-label="관리자 메뉴">
        <span className="text-sm font-semibold text-ink-soft">관리자</span>
        {editHref && <ButtonLink href={editHref} size="sm" tone="accent">이 편 수정</ButtonLink>}
        <ButtonLink href="/guide/editor" size="sm">새 편 작성</ButtonLink>
        <ButtonLink href="/guide/editor/session" size="sm">새 세션</ButtonLink>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-ink-faint">
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {user ? (
        <>
          <span>{isAdmin ? "관리자로 로그인했습니다." : "가이드 관리는 관리자 계정으로 이용할 수 있습니다."}</span>
          <form action={logout}>
            <input type="hidden" name="next" value={next} />
            <Button type="submit" size="sm">로그아웃</Button>
          </form>
        </>
      ) : (
        <form action={loginWithKakao} className="flex flex-wrap items-center gap-3">
          <span>가이드를 편집하는 관리자는 여기서 로그인합니다.</span>
          <input type="hidden" name="next" value={next} />
          <Button type="submit" size="sm">관리자 로그인</Button>
        </form>
      )}
    </div>
  );
}
