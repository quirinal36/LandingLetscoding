import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";

export const metadata: Metadata = {
  title: "블로그",
  description: "AI 시대 코딩 교육에 대해 렛츠코딩앤플레이학원 원장이 현장에서 보고 겪은 것을 씁니다. 칼럼, AI 도구 정보, 수업 도구 안내 글.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ auth?: string }> }) {
  const { auth } = await searchParams;
  return <BlogIndex category="column" auth={auth} />;
}
