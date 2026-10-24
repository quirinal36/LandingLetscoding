import type { Metadata } from "next";
import Link from "next/link";
import { getViewer } from "@/lib/supabase/server";
import { JsonLd } from "@/components/product";
import { ButtonLink } from "@/components/ui";
import { GuideAuthControls } from "@/components/guide/auth-controls";
import { GuideIndex } from "@/components/guide/toc";
import { GUIDE_DESCRIPTION, GUIDE_TITLE, flattenGuide, getGuide } from "@/lib/guide";
import { COMPANY } from "@/lib/nav";

export const metadata: Metadata = {
  title: "온보딩 가이드",
  description: GUIDE_DESCRIPTION,
};

export default async function Page({ searchParams }: { searchParams: Promise<{ auth?: string }> }) {
  const { auth } = await searchParams;
  const [{ isAdmin }, sessions] = await Promise.all([getViewer(), getGuide()]);
  const refs = flattenGuide(sessions);
  const complete = refs.filter((r) => r.lesson.isComplete).length;
  const first = refs[0];
  const clone = sessions.find((s) => s.slug === "clone");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: GUIDE_TITLE,
          description: GUIDE_DESCRIPTION,
          url: `${COMPANY.url}/guide`,
          inLanguage: "ko-KR",
          numberOfItems: refs.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: refs.map((r) => ({ "@type": "ListItem", position: r.index + 1, name: r.lesson.title, url: `${COMPANY.url}/guide/${r.lesson.slug}` })),
        }}
      />

      {/* 표지 */}
      <header className="card p-7 md:p-10">
        <p className="text-sm font-semibold text-accent-ink">온보딩 가이드</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">{GUIDE_TITLE}</h1>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{GUIDE_DESCRIPTION}</p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div><dt className="inline text-ink-faint">세션 </dt><dd className="inline font-semibold">{sessions.length}</dd></div>
          <div><dt className="inline text-ink-faint">편 </dt><dd className="inline font-semibold">{refs.length}</dd></div>
          <div><dt className="inline text-ink-faint">완성 </dt><dd className="inline font-semibold">{complete}</dd></div>
        </dl>
        <p className="mt-3 text-sm leading-relaxed text-ink-faint">
          준비 중인 편도 목차에 보입니다. 영상이 올라오고 내용이 확정되면 ‘준비 중’ 표시가 사라집니다.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {first && <ButtonLink href={`/guide/${first.lesson.slug}`} tone="accent" className="pill">첫 편부터 보기</ButtonLink>}
          {clone && <Link href={`#${clone.slug}`} className="link-chevron text-sm">클론코딩 수업 시연으로</Link>}
        </div>
      </header>

      <div className="mt-6"><GuideAuthControls next="/guide" placement="top" /></div>
      {auth && <p role="alert" className="mt-4 text-sm text-red-700">{auth === "logout-failed" ? "로그아웃하지 못했습니다. 다시 시도해 주세요." : "카카오 로그인을 완료하지 못했습니다. 다시 시도해 주세요."}</p>}

      <div className="mt-14">
        {sessions.length === 0 ? (
          <p className="card p-6 text-ink-soft">아직 세션이 없습니다.</p>
        ) : (
          <GuideIndex sessions={sessions} editable={isAdmin} />
        )}
      </div>

      <footer className="hairline mt-20 border-t pt-8">
        <GuideAuthControls next="/guide" placement="bottom" />
      </footer>
    </div>
  );
}
