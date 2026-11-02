import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { TOOLS, toolName } from "@/lib/tools";

/* 블로그 '도구' 갈래 본문. 시리즈를 설치 순서대로 보여 주고, 도구가 이어지는 흐름과 설치 확인 명령을 함께 둔다. */

const FLOW = [
  { step: "설명 녹음", tool: "Whisper", result: "글과 시간표(자막)" },
  { step: "장면 구성", tool: "Hyperframes", result: "Node.js가 실행하고 FFmpeg가 MP4로 굳힘" },
  { step: "편집", tool: "Concat", result: "하이라이트 순서와 속도 조정" },
  { step: "장면 추가", tool: "kie.ai", result: "광고용 영상 장면 생성" },
];

export function ToolsSection({ posts }: { posts: BlogPost[] }) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  // 시리즈에 없는 도구 글은 시리즈 뒤에 최신순으로 붙인다.
  const extra = posts.filter((p) => !TOOLS.some((t) => t.slug === p.slug));

  return (
    <>
      <p className="text-sm leading-relaxed text-ink-faint [word-break:keep-all]">
        모든 글은 윈도우(PowerShell)를 기준으로 쓰고, 맥은 글 끝에 따로 적었습니다. 위에서부터 순서대로 설치하면 먼저 필요한 프로그램이 항상 앞에 있습니다.
      </p>

      <section className="mt-10" aria-labelledby="flow">
        <h3 id="flow" className="text-lg font-semibold">도구들은 이렇게 이어집니다</h3>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <section className="mt-12" aria-labelledby="series">
        <h3 id="series" className="text-lg font-semibold">설치 순서대로 읽기</h3>
        <ol className="mt-4 space-y-3">
          {TOOLS.map((t, i) => {
            const post = bySlug.get(t.slug);
            const body = (
              <>
                <span className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-xs text-ink-faint">{t.when}</span>
                  {!post && <span className="text-xs font-semibold text-ink-faint">준비 중</span>}
                </span>
                <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-soft [word-break:keep-all]">{t.summary}</span>
                {t.requires.length > 0 && (
                  <span className="mt-2 block text-sm text-accent-ink">먼저 설치: {t.requires.map(toolName).join(", ")}</span>
                )}
              </>
            );
            return (
              <li key={t.slug}>
                {post ? (
                  <Link href={`/blog/${t.slug}`} className="card block p-5 transition-transform hover:-translate-y-0.5">{body}</Link>
                ) : (
                  <div className="card block p-5 opacity-70">{body}</div>
                )}
              </li>
            );
          })}
          {extra.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="card block p-5 transition-transform hover:-translate-y-0.5">
                <span className="font-semibold [word-break:keep-all]">{p.title}</span>
                <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-soft [word-break:keep-all]">{p.summary}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="check">
        <h3 id="check" className="text-lg font-semibold">수업 전 설치 확인</h3>
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
    </>
  );
}
