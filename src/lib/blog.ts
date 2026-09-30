export const BLOG_CATEGORIES = {
  column: { label: "칼럼", description: "코딩 교육 현장에서 보고 겪은 것을 원장이 직접 씁니다." },
  info: { label: "정보", description: "도구와 서비스가 실제로 어떻게 동작하는지 확인해서 정리합니다." },
} as const;
export type BlogCategory = keyof typeof BLOG_CATEGORIES;

/** 목록 맨 위에 고정하는 교육 사명 선언서. 없는 slug면 고정 배너가 나오지 않는다. */
export const PINNED_SLUG = "why-we-teach";

export type Segment =
  | { kind: "heading"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "image"; src: string; alt: string }
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
  cover: { src: string } | null;
  body: Segment[];
  readingMinutes: number;
};

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
      segments.push({ kind: "image", alt: image[1], src: imageUrl(image[2]) });
    } else if (line.startsWith("## ")) {
      flush();
      segments.push({ kind: "heading", text: line.slice(3).trim() });
    } else if (line.startsWith("> ")) {
      flush();
      segments.push({ kind: "quote", text: line.slice(2).trim() });
    } else if (line.trim() === "") flush();
    else paragraph.push(line);
  }
  if (code) throw new Error("Unclosed blog code block");
  flush();
  return segments;
}

/** 한국어 성인 평균 분당 500자. 라운지와 같은 기준. */
function readingMinutes(body: Segment[]) {
  const chars = body.reduce((n, s) => (s.kind === "image" ? n : n + s.text.replace(/\s+/g, "").length), 0);
  return Math.max(1, Math.round(chars / 500));
}

/** DB 이미지 URL은 사이트 내부 경로 또는 HTTPS만 렌더링한다. */
function imageUrl(value: unknown): string {
  if (typeof value !== "string" || !value || (!/^\/(?!\/)/.test(value) && !/^https:\/\//.test(value))) {
    throw new Error("Invalid blog image URL");
  }
  return value;
}

export function decodePost(value: unknown): BlogPost {
  if (!value || typeof value !== "object") throw new Error("Invalid blog post");
  const row = value as Record<string, unknown>;
  const text = (key: string) => {
    if (typeof row[key] !== "string") throw new Error(`Invalid blog field: ${key}`);
    return row[key] as string;
  };
  const slug = text("slug");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid blog slug");
  const category = text("category");
  if (category !== "column" && category !== "info") throw new Error("Invalid blog category");
  if (!Array.isArray(row.blocks)) throw new Error("Invalid blog blocks");
  const body = row.blocks.flatMap((value: unknown): Segment[] => {
    if (!value || typeof value !== "object") throw new Error("Invalid blog block");
    const block = value as Record<string, unknown>;
    if (block.type === "image") return [{ kind: "image", src: imageUrl(block.url), alt: typeof block.alt === "string" ? block.alt : "" }];
    if (typeof block.content !== "string") throw new Error("Invalid blog block content");
    if (block.type === "text") return parseBody(block.content);
    if (block.type === "prompt") return [{ kind: "code", text: block.content }];
    throw new Error("Unsupported blog block type");
  });
  const publishedAt = row.published_at ?? row.created_at;
  const updatedAt = text("updated_at");
  if (typeof publishedAt !== "string" || !Number.isFinite(Date.parse(publishedAt)) || !Number.isFinite(Date.parse(updatedAt))) {
    throw new Error("Invalid blog date");
  }
  return {
    slug, title: text("title"), summary: text("summary"), category,
    author: text("author_name"), authorTitle: text("author_title"), publishedAt, updatedAt,
    cover: row.cover_image_url == null ? null : { src: imageUrl(row.cover_image_url) },
    body, readingMinutes: readingMinutes(body),
  };
}

/** 공개 글만 요청마다 읽는다. DB 장애를 빈 목록/404로 숨기지 않는다. */
export async function getPosts(): Promise<BlogPost[]> {
  const base = process.env.LETSCODING_LOUNGE_SUPABASE_URL;
  const key = process.env.LETSCODING_LOUNGE_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error("Missing blog Supabase environment variables");
  const url = new URL("/rest/v1/blog_posts", base);
  url.searchParams.set("select", "slug,title,summary,category,blocks,cover_image_url,author_name,author_title,published_at,created_at,updated_at");
  url.searchParams.set("is_published", "eq.true");
  url.searchParams.set("order", "published_at.desc.nullslast,slug.asc");
  const posts: BlogPost[] = [];
  // PostgREST의 응답 상한에 걸려 오래된 글이 목록·사이트맵에서 빠지지 않도록 나눠 읽는다.
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: key, "Accept-Profile": "landing" }, cache: "no-store",
    });
    if (!response.ok) throw new Error(`Blog database request failed (${response.status})`);
    const rows: unknown = await response.json();
    if (!Array.isArray(rows)) throw new Error("Invalid blog database response");
    posts.push(...rows.map(decodePost));
    if (rows.length < limit) return posts;
  }
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" });
}

export type Block = { type: "text" | "image" | "prompt"; content?: string; url?: string; alt?: string };
export type EditorValues = {
  slug: string; title: string; summary: string; category: "column" | "info";
  author_name: string; author_title: string; cover_image_url: string;
  is_published: boolean; blocks: Block[];
};
export type EditablePost = EditorValues & { id: string; updated_at: string };
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function imageURL(value: string) {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try { if (new URL(value).protocol === "https:") return value; } catch {}
  throw new Error("이미지는 사이트 내부 경로나 HTTPS 주소를 입력해 주세요.");
}

export function validatePost(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new Error("글 내용을 확인해 주세요.");
  const p = payload as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    if (typeof p[key] !== "string") throw new Error("입력한 글 정보를 확인해 주세요.");
    const value = (p[key] as string).trim();
    if (value.length > max || (required && !value)) throw new Error(`${key}: 필수 값과 최대 길이(${max}자)를 확인해 주세요.`);
    return value;
  };
  const slug = text("slug", 80, true);
  if (slug.length < 3 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug === "editor") throw new Error("글 주소는 3~80자의 영문 소문자·숫자·하이픈으로 입력해 주세요. editor는 사용할 수 없습니다.");
  if (p.category !== "column" && p.category !== "info") throw new Error("글 갈래를 선택해 주세요.");
  if (typeof p.is_published !== "boolean") throw new Error("공개 여부를 확인해 주세요.");
  if (!Array.isArray(p.blocks) || !p.blocks.length || p.blocks.length > 100 || JSON.stringify(p.blocks).length > 300_000) throw new Error("본문은 1~100개 블록, 총 30만 자 이내로 작성해 주세요.");
  const blocks: Block[] = p.blocks.map((b: unknown) => {
    if (!b || typeof b !== "object") throw new Error("본문 블록을 확인해 주세요.");
    const block = b as Record<string, unknown>;
    if (block.type === "image" && typeof block.url === "string") {
      if (block.alt != null && (typeof block.alt !== "string" || block.alt.length > 1000)) throw new Error("이미지 설명은 1,000자 이내로 입력해 주세요.");
      return { type: "image", url: imageURL(block.url.trim()), alt: (block.alt as string) ?? "" };
    }
    if ((block.type !== "text" && block.type !== "prompt") || typeof block.content !== "string" || !block.content.trim()) throw new Error("비어 있는 본문 블록을 채우거나 삭제해 주세요.");
    if (block.type === "text") {
      try { parseBody(block.content); } catch { throw new Error("본문의 코드 블록 또는 이미지 문법을 확인해 주세요."); }
    }
    return { type: block.type, content: block.content };
  });
  const cover = text("cover_image_url", 4000);
  return { slug, title: text("title", 200, true), summary: text("summary", 1000), category: p.category,
    author_name: text("author_name", 100, true), author_title: text("author_title", 100),
    cover_image_url: cover ? imageURL(cover) : null, is_published: p.is_published, blocks };
}
