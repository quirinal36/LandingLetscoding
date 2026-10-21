import type { MetadataRoute } from "next";
import { getPosts, type BlogPost } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";

/** 색인할 페이지만 싣는다. 준비 중 페이지(STUB_ROBOTS)는 내용이 채워지면 여기에 추가한다. */
const PAGES = ["/", "/about", "/about/philosophy", "/solutions/lounge", "/solutions/python", "/seminar/inquiry", "/blog"];

// 빌드 때 미리 만들지 않고 요청마다 만든다. 빌드가 DB에 의존하지 않고, 새 글도 다음 배포 없이 실린다.
export const dynamic = "force-dynamic";

/** 블로그 DB를 못 읽어도 사이트맵 전체를 실패시키지 않는다. 고정 페이지만 내보내고 원인은 로그에 남긴다. */
async function readPosts(): Promise<BlogPost[]> {
  try {
    return await getPosts();
  } catch (error) {
    console.error("sitemap: 블로그 글을 읽지 못해 고정 페이지만 내보낸다", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await readPosts();
  return [
    ...PAGES.map((path) => ({
      url: new URL(path, COMPANY.url).toString(),
      lastModified: path === "/blog" && posts[0] ? new Date(Math.max(...posts.map((p) => Date.parse(p.updatedAt)))) : new Date(),
    })),
    // 글은 실제로 고친 날을 lastmod로 준다. 빌드 날짜를 주면 검색엔진이 lastmod를 믿지 않게 된다.
    ...posts.map((p) => ({ url: `${COMPANY.url}/blog/${p.slug}`, lastModified: new Date(p.updatedAt) })),
  ];
}
