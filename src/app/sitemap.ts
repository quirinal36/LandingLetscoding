import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/nav";

/** 색인할 페이지만 싣는다. 준비 중 페이지(STUB_ROBOTS)는 내용이 채워지면 여기에 추가한다. */
const PAGES = ["/", "/solutions/lounge", "/solutions/python", "/seminar/inquiry"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: new URL(path, COMPANY.url).toString(),
    lastModified: new Date(),
  }));
}
