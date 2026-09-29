import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { COMPANY } from "@/lib/nav";

/** 색인할 페이지만 싣는다. 준비 중 페이지(STUB_ROBOTS)는 내용이 채워지면 여기에 추가한다. */
const PAGES = ["/", "/about", "/about/philosophy", "/solutions/lounge", "/solutions/python", "/seminar/inquiry", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    ...PAGES.map((path) => ({
      url: new URL(path, COMPANY.url).toString(),
      lastModified: path === "/blog" && posts[0] ? new Date(posts[0].updatedAt) : new Date(),
    })),
    // 글은 실제로 고친 날을 lastmod로 준다. 빌드 날짜를 주면 검색엔진이 lastmod를 믿지 않게 된다.
    ...posts.map((p) => ({ url: `${COMPANY.url}/blog/${p.slug}`, lastModified: new Date(p.updatedAt) })),
  ];
}
