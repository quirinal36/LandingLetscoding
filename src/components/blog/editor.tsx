"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePost } from "@/app/blog/actions";
import { type Block, type EditablePost, type EditorValues } from "@/lib/blog";
import { Button, ButtonLink } from "@/components/ui";
import { DeletePost } from "./delete-post";

const fieldClass = "mt-2 w-full rounded-xl border border-black/20 bg-white p-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
export function BlogEditor({ post }: { post?: EditablePost }) {
  const [values, setValues] = useState<EditorValues>(post ?? {
    slug: "", title: "", summary: "", category: "column", author_name: "", author_title: "",
    cover_image_url: "", is_published: false, blocks: [{ type: "text", content: "" }],
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const updateBlock = (index: number, change: Partial<Block>) => setValues(v => ({ ...v, blocks: v.blocks.map((b, i) => i === index ? { ...b, ...change } : b) }));
  const moveBlock = (index: number, direction: number) => setValues(v => {
    const blocks = [...v.blocks];
    [blocks[index], blocks[index + direction]] = [blocks[index + direction], blocks[index]];
    return { ...v, blocks };
  });
  return <form className="mt-8 space-y-6" onSubmit={event => {
    event.preventDefault(); setError("");
    startTransition(async () => {
      try {
        const result = await savePost(values, post?.id, post?.updated_at);
        if (result.error) { setError(result.error); return; }
        router.push(result.published ? `/blog/${result.slug}` : "/blog"); router.refresh();
      } catch { setError("저장하지 못했습니다. 입력 내용은 유지됩니다. 로그인 상태와 연결을 확인해 주세요."); }
    });
  }}>
    <fieldset disabled={pending} className="space-y-6 disabled:opacity-60">
      <div className="grid gap-5 sm:grid-cols-2">
        {([
          ["title", "제목", 200, true], ["slug", "글 주소", 80, true],
          ["author_name", "작성자 이름", 100, true], ["author_title", "작성자 직함", 100, false],
        ] as const).map(([key, label, max, required]) => <label key={key} className="block text-sm font-medium">
          {label}{required ? " *" : ""}
          <input className={fieldClass} value={values[key]} required={required} maxLength={max} minLength={key === "slug" ? 3 : undefined}
            pattern={key === "slug" ? "[a-z0-9]+(-[a-z0-9]+)*" : undefined}
            onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
          {key === "slug" && <span className="mt-1 block text-xs text-ink-soft">영문 소문자·숫자·하이픈, 3~80자. 수정하면 글 주소도 바뀝니다.</span>}
        </label>)}
      </div>
      <label className="block text-sm font-medium">요약
        <textarea className={fieldClass} rows={3} maxLength={1000} value={values.summary} onChange={e => setValues(v => ({ ...v, summary: e.target.value }))} />
      </label>
      <label className="block text-sm font-medium">글 갈래
        <select className={fieldClass} value={values.category} onChange={e => setValues(v => ({ ...v, category: e.target.value as EditorValues["category"] }))}>
          <option value="column">칼럼</option><option value="info">정보</option>
        </select>
      </label>
      <label className="block text-sm font-medium">대표 이미지 주소
        <input className={fieldClass} value={values.cover_image_url} maxLength={4000} placeholder="https://… 또는 /blog/…" onChange={e => setValues(v => ({ ...v, cover_image_url: e.target.value }))} />
      </label>
      <div>
        <h2 className="text-xl font-semibold">본문</h2>
        <p className="mt-2 text-sm text-ink-soft">텍스트에서 ## 소제목, &gt; 인용문을 사용할 수 있습니다. 이미지 주소와 설명은 이미지 블록에 입력하세요.</p>
        <div className="mt-4 space-y-5">
          {values.blocks.map((block, index) => <fieldset key={index} className="card p-5">
            <legend className="px-2 text-sm font-semibold">{index + 1}. {block.type === "image" ? "이미지" : block.type === "prompt" ? "코드·프롬프트" : "텍스트"}</legend>
            {block.type === "image" ? <>
              <label className="block text-sm">이미지 주소<input className={fieldClass} required value={block.url ?? ""} onChange={e => updateBlock(index, { url: e.target.value })} /></label>
              <label className="mt-3 block text-sm">이미지 설명<input className={fieldClass} maxLength={1000} value={block.alt ?? ""} onChange={e => updateBlock(index, { alt: e.target.value })} /></label>
            </> : <label className="block text-sm">내용<textarea className={fieldClass} rows={10} required value={block.content ?? ""} onChange={e => updateBlock(index, { content: e.target.value })} /></label>}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" disabled={index === 0} aria-label={`${index + 1}번 블록 위로 이동`} onClick={() => moveBlock(index, -1)}>위로</Button>
              <Button size="sm" disabled={index === values.blocks.length - 1} aria-label={`${index + 1}번 블록 아래로 이동`} onClick={() => moveBlock(index, 1)}>아래로</Button>
              <Button size="sm" onClick={() => {
                const content = block.type === "image" ? block.url : block.content;
                if (content && !window.confirm("이 본문 블록을 지울까요?")) return;
                setValues(v => ({ ...v, blocks: v.blocks.filter((_, i) => i !== index) }));
              }}>블록 삭제</Button>
            </div>
          </fieldset>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {([['text', '텍스트 추가'], ['image', '이미지 추가'], ['prompt', '코드·프롬프트 추가']] as const).map(([type, label]) =>
            <Button key={type} size="sm" disabled={values.blocks.length >= 100} onClick={() => setValues(v => ({ ...v, blocks: [...v.blocks, type === "image" ? { type, url: "", alt: "" } : { type, content: "" }] }))}>{label}</Button>)}
        </div>
      </div>
      <label className="flex min-h-11 items-center gap-3 font-medium"><input type="checkbox" className="size-5" checked={values.is_published} onChange={e => setValues(v => ({ ...v, is_published: e.target.checked }))} />공개하기 <span className="text-sm font-normal text-ink-soft">해제하면 관리자만 볼 수 있는 초안으로 저장됩니다.</span></label>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" tone="accent">{pending ? "저장 중…" : values.is_published ? "공개 저장" : "초안 저장"}</Button>
        <ButtonLink href="/blog">목록으로</ButtonLink>
      </div>
    </fieldset>
    {post && !pending && <DeletePost id={post.id} updatedAt={post.updated_at} title={post.title} />}
  </form>;
}
