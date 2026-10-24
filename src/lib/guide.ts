/* 온보딩 가이드. 세션 > 편(lesson) > 소제목(chapter) > 내용(blocks) 계층.
   데이터는 landing.guide_sessions / guide_lessons 에서 요청마다 읽는다. */

export const GUIDE_TITLE = "렛츠코딩 라운지 온보딩 가이드";
export const GUIDE_DESCRIPTION =
  "도입을 결정한 학원이 기관 설정부터 학생 과제, 교사 검토, 작품 공유까지 순서대로 따라 하는 가이드입니다. 영상과 교재를 함께 봅니다.";

/** 어느 화면에서 하는 작업인지. DB는 길이만 검사하고 허용 값은 여기서 정한다. */
export const AUDIENCES = ["전체", "관리자", "교사", "학생", "학생·교사"] as const;
export type Audience = (typeof AUDIENCES)[number];

export type Segment =
  | { kind: "heading"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "code"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

export type Chapter = { title: string; start: number | null; body: Segment[] };

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audience: string;
  youtubeId: string | null;
  /** 목표 길이(분). null이면 영상 없이 글로만 운영하는 편. */
  targetMinutes: number | null;
  isComplete: boolean;
  chapters: Chapter[];
  sortOrder: number;
  updatedAt: string;
  /** 본문 블록이 하나라도 있으면 검색 색인 대상이다. */
  hasContent: boolean;
};

export type Session = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  updatedAt: string;
  lessons: Lesson[];
};

/** 목차 번호가 붙은 편. number는 "2.3"처럼 세션 순서.편 순서다. */
export type LessonRef = { lesson: Lesson; session: Session; sessionNumber: number; number: string; index: number };

const IMAGE_LINE = /^!\[(.*)\]\((\S+)(?: "[^"]*")?\)$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** DB 이미지 URL은 사이트 내부 경로 또는 HTTPS만 렌더링한다. */
function imageUrl(value: unknown): string {
  if (typeof value !== "string" || !value || value.includes("\\") || (!/^\/(?!\/)/.test(value) && !/^https:\/\//.test(value))) {
    throw new Error("Invalid guide image URL");
  }
  return value;
}

/** 블로그 본문 문법에 목록(- , 1. )을 더한 것. ## 소소제목, > 강조, ``` 코드, ![설명](주소). */
export function parseGuideText(text: string): Segment[] {
  const segments: Segment[] = [];
  let paragraph: string[] = [];
  let code: string[] | null = null;
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) segments.push({ kind: "paragraph", text: paragraph.join("\n") });
    paragraph = [];
  };
  const flushList = () => {
    if (list) segments.push({ kind: "list", ordered: list.ordered, items: list.items });
    list = null;
  };
  const flush = () => { flushParagraph(); flushList(); };

  for (const line of text.split("\n")) {
    if (code) {
      if (line.startsWith("```")) { segments.push({ kind: "code", text: code.join("\n") }); code = null; }
      else code.push(line);
      continue;
    }
    const image = line.match(IMAGE_LINE);
    const bullet = line.match(/^- (.+)$/);
    const numbered = line.match(/^\d+\. (.+)$/);
    if (line.startsWith("```")) { flush(); code = []; }
    else if (image) { flush(); segments.push({ kind: "image", alt: image[1], src: imageUrl(image[2]) }); }
    else if (line.startsWith("## ")) { flush(); segments.push({ kind: "heading", text: line.slice(3).trim() }); }
    else if (line.startsWith("> ")) { flush(); segments.push({ kind: "quote", text: line.slice(2).trim() }); }
    else if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1].trim());
    } else if (line.trim() === "") flush();
    else paragraph.push(line);
  }
  if (code) throw new Error("Unclosed guide code block");
  flush();
  return segments;
}

/* ── 유튜브 ───────────────────────────────────────────── */

/** 유튜브 주소(watch, youtu.be, shorts, embed, live) 또는 11자 ID에서 ID를 꺼낸다. 아니면 null. */
export function parseYoutubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (YOUTUBE_ID.test(value)) return value;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else id = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})(?:[/?]|$)/)?.[1] ?? null;
  }
  return id && YOUTUBE_ID.test(id) ? id : null;
}

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** 초 → "m:ss" 또는 "h:mm:ss". */
export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/** "12:34", "1:02:03", "90" → 초. 빈 값은 null. 형식이 틀리면 예외. */
export function parseTime(value: string): number | null {
  const text = value.trim();
  if (!text) return null;
  if (!/^\d+(:[0-5]?\d){0,2}$/.test(text)) throw new Error("시작 시간은 mm:ss 또는 h:mm:ss 형식으로 입력해 주세요.");
  const seconds = text.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  if (seconds > 86_400) throw new Error("시작 시간은 24시간을 넘을 수 없습니다.");
  return seconds;
}

/* ── DB 행 해석 ───────────────────────────────────────── */

function text(row: Record<string, unknown>, key: string, label = "guide") {
  if (typeof row[key] !== "string") throw new Error(`Invalid ${label} field: ${key}`);
  return row[key] as string;
}

function decodeChapter(value: unknown): Chapter {
  if (!value || typeof value !== "object") throw new Error("Invalid guide chapter");
  const chapter = value as Record<string, unknown>;
  const title = text(chapter, "title", "chapter");
  const start = chapter.start == null ? null : chapter.start;
  if (start !== null && (typeof start !== "number" || !Number.isInteger(start) || start < 0)) throw new Error("Invalid guide chapter start");
  const blocks = chapter.blocks ?? [];
  if (!Array.isArray(blocks)) throw new Error("Invalid guide chapter blocks");
  const body = blocks.flatMap((item: unknown): Segment[] => {
    if (!item || typeof item !== "object") throw new Error("Invalid guide block");
    const block = item as Record<string, unknown>;
    if (block.type === "image") return [{ kind: "image", src: imageUrl(block.url), alt: typeof block.alt === "string" ? block.alt : "" }];
    if (typeof block.content !== "string") throw new Error("Invalid guide block content");
    if (block.type === "text") return parseGuideText(block.content);
    if (block.type === "prompt") return [{ kind: "code", text: block.content }];
    throw new Error("Unsupported guide block type");
  });
  return { title, start, body };
}

export function decodeLesson(value: unknown): Lesson {
  if (!value || typeof value !== "object") throw new Error("Invalid guide lesson");
  const row = value as Record<string, unknown>;
  const slug = text(row, "slug");
  if (!SLUG.test(slug)) throw new Error("Invalid guide lesson slug");
  const youtubeId = row.youtube_id == null ? null : row.youtube_id;
  if (youtubeId !== null && (typeof youtubeId !== "string" || !YOUTUBE_ID.test(youtubeId))) throw new Error("Invalid guide youtube id");
  const targetMinutes = row.target_minutes == null ? null : row.target_minutes;
  if (targetMinutes !== null && (typeof targetMinutes !== "number" || !Number.isInteger(targetMinutes))) throw new Error("Invalid guide target minutes");
  if (typeof row.is_complete !== "boolean") throw new Error("Invalid guide completion flag");
  if (!Array.isArray(row.chapters)) throw new Error("Invalid guide chapters");
  if (typeof row.sort_order !== "number") throw new Error("Invalid guide sort order");
  const updatedAt = text(row, "updated_at");
  if (!Number.isFinite(Date.parse(updatedAt))) throw new Error("Invalid guide date");
  const chapters = row.chapters.map(decodeChapter);
  return {
    id: text(row, "id"), slug, title: text(row, "title"), summary: text(row, "summary"), audience: text(row, "audience"),
    youtubeId, targetMinutes, isComplete: row.is_complete, chapters, sortOrder: row.sort_order, updatedAt,
    hasContent: chapters.some((c) => c.body.length > 0),
  };
}

export function decodeSession(value: unknown): Session {
  if (!value || typeof value !== "object") throw new Error("Invalid guide session");
  const row = value as Record<string, unknown>;
  const slug = text(row, "slug", "session");
  if (!SLUG.test(slug)) throw new Error("Invalid guide session slug");
  if (typeof row.sort_order !== "number") throw new Error("Invalid guide session sort order");
  const lessons = row.guide_lessons ?? [];
  if (!Array.isArray(lessons)) throw new Error("Invalid guide session lessons");
  const updatedAt = text(row, "updated_at", "session");
  if (!Number.isFinite(Date.parse(updatedAt))) throw new Error("Invalid guide session date");
  return {
    id: text(row, "id", "session"), slug, title: text(row, "title", "session"), description: text(row, "description", "session"),
    sortOrder: row.sort_order, updatedAt,
    // PostgREST 내장 정렬에 기대지 않고 한 번 더 정렬한다.
    lessons: lessons.map(decodeLesson).sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ko")),
  };
}

const SELECT = "id,slug,title,description,sort_order,updated_at,guide_lessons(id,slug,title,summary,audience,youtube_id,target_minutes,is_complete,chapters,sort_order,updated_at)";

/** 세션과 편을 요청마다 읽는다. 준비 중인 편도 포함한다. DB 장애를 빈 목록으로 숨기지 않는다. */
export async function getGuide(): Promise<Session[]> {
  const base = process.env.LETSCODING_LOUNGE_SUPABASE_URL;
  const key = process.env.LETSCODING_LOUNGE_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error("Missing guide Supabase environment variables");
  const url = new URL("/rest/v1/guide_sessions", base);
  url.searchParams.set("select", SELECT);
  url.searchParams.set("order", "sort_order.asc,title.asc");
  url.searchParams.set("guide_lessons.order", "sort_order.asc,title.asc");
  url.searchParams.set("limit", "200");
  const response = await fetch(url, { headers: { apikey: key, "Accept-Profile": "landing" }, cache: "no-store" });
  if (!response.ok) throw new Error(`Guide database request failed (${response.status})`);
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error("Invalid guide database response");
  return rows.map(decodeSession).sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ko"));
}

export function flattenGuide(sessions: Session[]): LessonRef[] {
  const refs: LessonRef[] = [];
  sessions.forEach((session, si) =>
    session.lessons.forEach((lesson, li) =>
      refs.push({ lesson, session, sessionNumber: si + 1, number: `${si + 1}.${li + 1}`, index: refs.length }),
    ),
  );
  return refs;
}

export function findLesson(sessions: Session[], slug: string) {
  const refs = flattenGuide(sessions);
  const index = refs.findIndex((r) => r.lesson.slug === slug);
  if (index < 0) return undefined;
  return { current: refs[index], prev: refs[index - 1], next: refs[index + 1], refs };
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" });
}

/** 편 길이 표시. 영상 없는 편은 "글 자료". */
export function lengthLabel(lesson: Pick<Lesson, "targetMinutes">) {
  return lesson.targetMinutes == null ? "글 자료" : `영상 약 ${lesson.targetMinutes}분`;
}

/* ── 편집기 ───────────────────────────────────────────── */

export type EditorBlock = { type: "text" | "image" | "prompt"; content?: string; url?: string; alt?: string };
export type EditorChapter = { title: string; start: string; blocks: EditorBlock[] };
export type LessonEditorValues = {
  session_id: string; slug: string; title: string; summary: string; audience: Audience;
  youtube_url: string; target_minutes: string; is_complete: boolean; sort_order: string;
  chapters: EditorChapter[]; notes: string;
};
export type EditableLesson = LessonEditorValues & { id: string; updated_at: string };
export type SessionEditorValues = { slug: string; title: string; description: string; sort_order: string };
export type EditableSession = SessionEditorValues & { id: string; updated_at: string };

/** DB 행을 편집기 값으로 바꾼다. 챕터 시작 시간은 mm:ss 문자열로 보여 준다. */
export function toEditableLesson(row: Record<string, unknown>, notes: string): EditableLesson {
  const chapters = Array.isArray(row.chapters) ? (row.chapters as Record<string, unknown>[]) : [];
  return {
    id: String(row.id), updated_at: String(row.updated_at), session_id: String(row.session_id),
    slug: String(row.slug), title: String(row.title), summary: String(row.summary ?? ""),
    audience: (AUDIENCES as readonly string[]).includes(String(row.audience)) ? (row.audience as Audience) : "전체",
    youtube_url: typeof row.youtube_id === "string" ? youtubeWatchUrl(row.youtube_id) : "",
    target_minutes: row.target_minutes == null ? "" : String(row.target_minutes),
    is_complete: row.is_complete === true, sort_order: String(row.sort_order ?? 0),
    chapters: chapters.map((c) => ({
      title: String(c.title ?? ""),
      start: typeof c.start === "number" ? formatTime(c.start) : "",
      blocks: Array.isArray(c.blocks) ? (c.blocks as EditorBlock[]) : [],
    })),
    notes,
  };
}

function imageURLInput(value: string) {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;
  try { if (new URL(value).protocol === "https:") return value; } catch {}
  throw new Error("이미지는 사이트 내부 경로나 HTTPS 주소를 입력해 주세요.");
}

function textField(p: Record<string, unknown>, key: string, label: string, max: number, required = false) {
  if (typeof p[key] !== "string") throw new Error(`${label}을(를) 확인해 주세요.`);
  const value = (p[key] as string).trim();
  if (required && !value) throw new Error(`${label}을(를) 입력해 주세요.`);
  if (value.length > max) throw new Error(`${label}은(는) ${max.toLocaleString("ko-KR")}자 이내로 입력해 주세요.`);
  return value;
}

function integerField(value: unknown, label: string, min: number, max: number, optional = false): number | null {
  if (optional && (value === "" || value == null)) return null;
  const n = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${label}은(는) ${min}~${max} 사이의 정수로 입력해 주세요.`);
  return n;
}

function validateBlocks(value: unknown): EditorBlock[] {
  if (!Array.isArray(value) || value.length > 60) throw new Error("소제목 하나의 본문은 60개 블록 이내로 작성해 주세요.");
  return value.map((b: unknown) => {
    if (!b || typeof b !== "object") throw new Error("본문 블록을 확인해 주세요.");
    const block = b as Record<string, unknown>;
    if (block.type === "image" && typeof block.url === "string") {
      if (block.alt != null && (typeof block.alt !== "string" || block.alt.length > 1000)) throw new Error("이미지 설명은 1,000자 이내로 입력해 주세요.");
      return { type: "image" as const, url: imageURLInput(block.url.trim()), alt: (block.alt as string) ?? "" };
    }
    if ((block.type !== "text" && block.type !== "prompt") || typeof block.content !== "string" || !block.content.trim()) {
      throw new Error("비어 있는 본문 블록을 채우거나 삭제해 주세요.");
    }
    if (block.type === "text") {
      try { parseGuideText(block.content); } catch { throw new Error("본문의 코드 블록 또는 이미지 문법을 확인해 주세요."); }
    }
    return { type: block.type, content: block.content };
  });
}

/** 편집기 입력을 DB 열로 바꾼다. 틀리면 사용자에게 보여 줄 메시지로 예외를 던진다. */
export function validateLesson(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new Error("입력 내용을 확인해 주세요.");
  const p = payload as Record<string, unknown>;
  if (typeof p.session_id !== "string" || !UUID.test(p.session_id)) throw new Error("세션을 선택해 주세요.");
  const slug = textField(p, "slug", "편 주소", 80, true);
  if (slug.length < 2 || !SLUG.test(slug) || slug === "editor") throw new Error("편 주소는 2~80자의 영문 소문자·숫자·하이픈으로 입력해 주세요. editor는 사용할 수 없습니다.");
  if (!(AUDIENCES as readonly string[]).includes(p.audience as string)) throw new Error("화면(대상)을 선택해 주세요.");
  if (typeof p.is_complete !== "boolean") throw new Error("완성 여부를 확인해 주세요.");
  const youtubeInput = textField(p, "youtube_url", "유튜브 주소", 500);
  const youtube_id = youtubeInput ? parseYoutubeId(youtubeInput) : null;
  if (youtubeInput && !youtube_id) throw new Error("유튜브 주소를 확인해 주세요. watch, youtu.be, shorts 주소를 지원합니다.");
  if (!Array.isArray(p.chapters) || p.chapters.length > 40) throw new Error("소제목은 40개 이내로 작성해 주세요.");
  const chapters = p.chapters.map((c: unknown, i: number) => {
    if (!c || typeof c !== "object") throw new Error("소제목을 확인해 주세요.");
    const chapter = c as Record<string, unknown>;
    const title = textField(chapter, "title", `${i + 1}번 소제목`, 120, true);
    if (typeof chapter.start !== "string") throw new Error(`${i + 1}번 소제목의 시작 시간을 확인해 주세요.`);
    const start = parseTime(chapter.start);
    return { title, start, blocks: validateBlocks(chapter.blocks ?? []) };
  });
  if (JSON.stringify(chapters).length > 400_000) throw new Error("본문은 총 40만 자 이내로 작성해 주세요.");
  return {
    session_id: p.session_id, slug, title: textField(p, "title", "제목", 200, true), summary: textField(p, "summary", "요약", 1000),
    audience: p.audience as Audience, youtube_id,
    target_minutes: integerField(p.target_minutes, "목표 길이(분)", 1, 180, true),
    is_complete: p.is_complete, chapters, sort_order: integerField(p.sort_order, "순서", 0, 100_000) as number,
    notes: textField(p, "notes", "촬영 메모", 20_000),
  };
}

export function validateSession(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new Error("입력 내용을 확인해 주세요.");
  const p = payload as Record<string, unknown>;
  const slug = textField(p, "slug", "세션 주소", 60, true);
  if (slug.length < 2 || !SLUG.test(slug)) throw new Error("세션 주소는 2~60자의 영문 소문자·숫자·하이픈으로 입력해 주세요.");
  return {
    slug, title: textField(p, "title", "세션 제목", 120, true), description: textField(p, "description", "설명", 1000),
    sort_order: integerField(p.sort_order, "순서", 0, 100_000) as number,
  };
}
