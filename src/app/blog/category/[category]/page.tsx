import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogIndex } from "@/components/blog/blog-index";
import { BLOG_CATEGORIES, isBlogCategory } from "@/lib/blog";
import { TOOLS_DESCRIPTION } from "@/lib/tools";

type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ auth?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isBlogCategory(category)) return {};
  const { label, description } = BLOG_CATEGORIES[category];
  return { title: `블로그 ${label}`, description: category === "tools" ? TOOLS_DESCRIPTION : description };
}

export default async function Page({ params, searchParams }: Props) {
  const { category } = await params;
  if (!isBlogCategory(category)) notFound();
  // 칼럼은 블로그 첫 화면이 맡는다.
  if (category === "column") redirect("/blog");
  const { auth } = await searchParams;
  return <BlogIndex category={category} auth={auth} />;
}
