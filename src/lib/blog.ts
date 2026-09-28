import fs from "node:fs";
import path from "node:path";

/*
  블로그 — content/blog/<slug>.md 한 파일이 글 한 편이다. 빌드 때 읽어 정적 HTML로 굽는다.
  2026.9 렛츠코딩 라운지(lounge.letscoding.kr/blog)에서 옮겨 왔고, slug를 그대로 두어 라운지가
  /blog/<slug> → www.letscoding.kr/blog/<slug> 로 1:1 영구 이동할 수 있게 했다.

  파일 모양:
    ---
    title: "..."            ← 값은 JSON 문자열
    summary: "..."          ← 목록 카드·meta description·og:description
    category: "column"      ← column(칼럼) | info(정보)
    author: "..."
    authorTitle: "..."
    publishedAt: "ISO"
    updatedAt: "ISO"
    cover: "/blog/<slug>/1.png"   (선택)
    coverSize: "1800x1004"        (cover가 있으면 필수)
    ---
    본문 — 라운지 편집기의 최소 문법을 그대로 쓴다.
      ## 소제목 / > 인용 / 빈 줄로 문단 구분
      ![설명](/blog/<slug>/2.png "1800x1268")   이미지 한 줄. 따옴표 안은 가로x세로
      ``` 로 감싼 블록 — 프롬프트·코드
*/

export const BLOG_CATEGORIES = {
  column: { label: "칼럼", description: "코딩 교육 현장에서 보고 겪은 것을 원장이 직접 씁니다." },
  info: { label: "정보", description: "도구와 서비스가 실제로 어떻게 동작하는지 확인해서 정리합니다." },
} as const;
export type BlogCategory = keyof typeof BLOG_CATEGORIES;

/** 목록 맨 위에 고정하는 교육 사명 선언서. 없는 slug면 고정 배너가 나오지 않는다. */
export const PINNED_SLUG = "why-we-teach";

export type Size = { width: number; height: number };

export type Segment =
  | { kind: "heading"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "image"; src: string; alt: string; size: Size }
  | { kind: "code"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: BlogCategory;
  author: string;
  authorTitle: string;
  publishedAt: string;
  updatedAt: string;
  cover: { src: string; size: Size } | null;
  body: Segment[];
  readingMinutes: number;
};

const DIR = path.join(process.cwd(), "content/blog");

function parseSize(value: string): Size {
  const [width, height] = value.split("x").map(Number);
  return { width, height };
}

const IMAGE_LINE = /^!\[(.*)\]\((\S+) "(\d+x\d+)"\)$/;

export function parseBody(body: string): Segment[] {
  const segments: Segment[] = [];
  let paragraph: string[] = [];
  let code: string[] | null = null;

  const flush = () => {
    if (paragraph.length) segments.push({ kind: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };

  for (const line of body.split("\n")) {
    if (code) {
      if (line.startsWith("```")) {
        segments.push({ kind: "code", text: code.join("\n") });
        code = null;
      } else code.push(line);
      continue;
    }
    const image = line.match(IMAGE_LINE);
    if (line.startsWith("```")) {
      flush();
      code = [];
    } else if (image) {
      flush();
      segments.push({ kind: "image", alt: image[1], src: image[2], size: parseSize(image[3]) });
    } else if (line.startsWith("## ")) {
      flush();
      segments.push({ kind: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("> ")) {
      flush();
      segments.push({ kind: "quote", text: line.slice(2).trim() });
    } else if (line.trim() === "") flush();
    else paragraph.push(line);
  }
  flush();
  return segments;
}

/** 한국어 성인 평균 분당 500자. 라운지와 같은 기준. */
function readingMinutes(body: Segment[]) {
  const chars = body.reduce((n, s) => (s.kind === "image" ? n : n + s.text.replace(/\s+/g, "").length), 0);
  return Math.max(1, Math.round(chars / 500));
}

function readPost(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error(`content/blog/${slug}.md: 머리말(---)이 없습니다`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(": ");
    if (i > 0) meta[line.slice(0, i)] = JSON.parse(line.slice(i + 2));
  }
  const body = parseBody(raw.slice(match[0].length));
  return {
    slug,
    title: meta.title,
    summary: meta.summary,
    category: meta.category as BlogCategory,
    author: meta.author,
    authorTitle: meta.authorTitle,
    publishedAt: meta.publishedAt,
    updatedAt: meta.updatedAt,
    cover: meta.cover ? { src: meta.cover, size: parseSize(meta.coverSize) } : null,
    body,
    readingMinutes: readingMinutes(body),
  };
}

let cache: BlogPost[] | null = null;

/** 발행일 최신순. */
export function getPosts(): BlogPost[] {
  cache ??= fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readPost(f.slice(0, -3)))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return cache;
}

export function getPost(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" });
}
