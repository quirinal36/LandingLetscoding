"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/blog/actions";
import { Button } from "@/components/ui";

export function DeletePost({ id, updatedAt, title }: { id: string; updatedAt: string; title: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  return <div>
    <Button size="sm" className="text-red-700" disabled={pending} onClick={() => {
      if (!window.confirm(`“${title}” 글을 삭제할까요? 삭제한 글은 복구할 수 없습니다.`)) return;
      setError("");
      startTransition(async () => {
        try {
          const result = await deletePost(id, updatedAt);
          if (result.error) { setError(result.error); return; }
          router.push("/blog"); router.refresh();
        } catch { setError("삭제하지 못했습니다. 로그인 상태와 연결을 확인해 주세요."); }
      });
    }}>{pending ? "삭제 중…" : "삭제"}</Button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}
