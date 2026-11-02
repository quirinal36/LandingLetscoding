import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/product";
import { getPosts } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";
import { TOOLS, TOOLS_DESCRIPTION, TOOLS_TITLE, toolName } from "@/lib/tools";

export const metadata: Metadata = {
  title: TOOLS_TITLE,
  description: TOOLS_DESCRIPTION,
};

// 글 공개 여부를 요청마다 확인한다. 빌드가 DB에 의존하지 않게 한다.
export const dynamic = "force-dynamic";

/** 공개된 글의 slug. DB를 못 읽으면 null을 돌려주고 모든 카드를 링크로 둔다. */
async function readPublished(): Promise<Set<string> | null> {
  try {
    return new Set((await getPosts()).map((p) => p.slug));
  } catch (error) {
    console.error("tools: 블로그 글을 읽지 못해 공개 여부 표시를 생략한다", error);
    return null;
  }
}

const FLOW = [
  { step: "설명 녹음", tool: "Whisper", result: "글과 시간표(자막)" },
  { step: "장면 구성", tool: "Hyperframes", result: "Node.js가 실행하고 FFmpeg가 MP4로 굳힘" },
  { step: "편집", tool: "Concat", result: "하이라이트 순서와 속도 조정" },
  { step: "장면 추가", tool: "kie.ai", result: "광고용 영상 장면 생성" },
];

export default async function Page() {
  const published = await readPublished();
  const isOpen = (slug: string) => !published || published.has(slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: TOOLS_TITLE,
          description: TOOLS_DESCRIPTION,
          url: `${COMPANY.url}/tools`,
          inLanguage: "ko-KR",
          numberOfItems: TOOLS.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${COMPANY.url}/blog/${t.slug}` })),
        }}
      />

      {/* 표지 */}
      <header className="card p-7 md:p-10">
        <p className="text-sm font-semibold text-accent-ink">수업 도구 안내</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">{TOOLS_TITLE}</h1>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-soft [word-break:keep-all]">{TOOLS_DESCRIPTION}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-faint [word-break:keep-all]">
          모든 글은 윈도우(PowerShell)를 기준으로 쓰고, 맥은 글 끝에 따로 적었습니다. 위에서부터 순서대로 설치하면 먼저 필요한 프로그램이 항상 앞에 있습니다.
        </p>
      </header>

      {/* 도구들이 이어지는 흐름 */}
      <section className="mt-14" aria-labelledby="flow">
        <h2 id="flow" className="text-xl font-semibold md:text-2xl">도구들은 이렇게 이어집니다</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((f, i) => (
            <li key={f.tool} className="card p-5">
              <p className="text-xs text-ink-faint">{i + 1}. {f.step}</p>
              <p className="mt-1 font-semibold">{f.tool}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft [word-break:keep-all]">{f.result}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft [word-break:keep-all]">
          Git은 공개된 프로그램과 예제를 내려받을 때, Aside 브라우저는 AI가 웹사이트에서 대신 작업할 때 씁니다.
        </p>
      </section>

      {/* 시리즈 목록 */}
      <section className="mt-14" aria-labelledby="series">
        <h2 id="series" className="text-xl font-semibold md:text-2xl">설치 순서대로 읽기</h2>
        <ol className="mt-6 space-y-3">
          {TOOLS.map((t, i) => {
            const body = (
              <>
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-xs text-ink-faint">{t.when}</span>
                  {!isOpen(t.slug) && <span className="text-xs font-semibold text-ink-faint">준비 중</span>}
                </span>
                <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-soft [word-break:keep-all]">{t.summary}</span>
                {t.requires.length > 0 && (
                  <span className="mt-2 block text-sm text-accent-ink">먼저 설치: {t.requires.map(toolName).join(", ")}</span>
                )}
              </>
            );
            return (
              <li key={t.slug}>
                {isOpen(t.slug) ? (
                  <Link href={`/blog/${t.slug}`} className="card block p-5 transition-transform hover:-translate-y-0.5">{body}</Link>
                ) : (
                  <div className="card block p-5 opacity-70">{body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* 설치 확인 */}
      <section className="mt-14" aria-labelledby="check">
        <h2 id="check" className="text-xl font-semibold md:text-2xl">수업 전 설치 확인</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft [word-break:keep-all]">
          시작 메뉴에서 PowerShell을 열고 한 줄씩 입력해 보세요. 버전이나 도움말이 나오면 설치된 것입니다. 설치한 직후라면 PowerShell 창을 새로 열어야 명령을 찾습니다.
        </p>
        <pre className="card mt-5 overflow-x-auto p-5 text-sm leading-relaxed">
          <code>{TOOLS.filter((t) => t.check).map((t) => t.check).join("\n")}</code>
        </pre>
        <p className="mt-3 text-sm text-ink-faint [word-break:keep-all]">
          Node.js는 v22 이상, Python은 3.11이어야 합니다. npm -v에서 “스크립트를 실행할 수 없으므로” 오류가 나면 Node.js 글의 스크립트 실행 허용 단계를 진행하세요. Aside와 Concat은 설치 파일로 설치하고, kie.ai는 계정과 API 키만 준비합니다.
        </p>
      </section>
    </div>
  );
}
