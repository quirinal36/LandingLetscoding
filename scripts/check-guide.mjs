import assert from 'node:assert/strict';
import {
  decodeSession, findLesson, flattenGuide, formatTime, getGuide, parseGuideText, parseTime,
  parseYoutubeId, toEditableLesson, validateLesson, validateSession,
} from '../src/lib/guide.ts';

// 본문 문법: 소소제목, 문단, 강조, 목록, 코드, 이미지
const segments = parseGuideText('## 소제목\n\n문단 한 줄\n둘째 줄\n\n> 강조\n\n- 하나\n- 둘\n\n1. 첫째\n2. 둘째\n\n```\n요청문\n```\n\n![설명](https://example.com/a.png)');
assert.deepEqual(segments.map(s => s.kind), ['heading', 'paragraph', 'quote', 'list', 'list', 'code', 'image']);
assert.equal(segments[3].ordered, false); assert.deepEqual(segments[3].items, ['하나', '둘']);
assert.equal(segments[4].ordered, true); assert.deepEqual(segments[4].items, ['첫째', '둘째']);
assert.throws(() => parseGuideText('```\nunclosed'));
assert.throws(() => parseGuideText('![x](javascript:alert(1))'));

// 유튜브 주소 해석
for (const input of [
  'dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s', 'https://youtu.be/dQw4w9WgXcQ?si=abc',
  'https://youtube.com/shorts/dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
]) assert.equal(parseYoutubeId(input), 'dQw4w9WgXcQ', input);
for (const input of ['', 'https://vimeo.com/123', 'https://www.youtube.com/watch?v=short', 'javascript:alert(1)', 'https://evil.example/watch?v=dQw4w9WgXcQ']) assert.equal(parseYoutubeId(input), null, input);

// 시간 표기
assert.equal(parseTime(''), null); assert.equal(parseTime('90'), 90); assert.equal(parseTime('12:34'), 754); assert.equal(parseTime('1:02:03'), 3723);
assert.throws(() => parseTime('1:99')); assert.throws(() => parseTime('abc'));
assert.equal(formatTime(754), '12:34'); assert.equal(formatTime(3723), '1:02:03'); assert.equal(formatTime(5), '0:05');

// DB 행 해석
const lessonRow = {
  id: '11111111-1111-4111-8111-111111111111', slug: 'overview', title: '한눈에 보기', summary: '요약', audience: '전체',
  youtube_id: null, target_minutes: 10, is_complete: false, sort_order: 10, updated_at: '2026-10-25T00:00:00Z',
  chapters: [{ title: '완성작부터 보기', start: null, blocks: [{ type: 'text', content: '본문' }] }, { title: '빈 소제목', start: 30, blocks: [] }],
};
const sessionRow = { id: '22222222-2222-4222-8222-222222222222', slug: 'start', title: '시작하기 전에', description: '설명', sort_order: 10, updated_at: '2026-10-25T00:00:00Z',
  guide_lessons: [{ ...lessonRow, slug: 'second', sort_order: 20 }, lessonRow] };
const session = decodeSession(sessionRow);
assert.deepEqual(session.lessons.map(l => l.slug), ['overview', 'second'], '편은 sort_order 순으로 다시 정렬한다');
assert.equal(session.lessons[0].hasContent, true);
assert.equal(session.lessons[0].chapters[1].start, 30);
assert.throws(() => decodeSession({ ...sessionRow, guide_lessons: [{ ...lessonRow, youtube_id: 'bad' }] }));
assert.throws(() => decodeSession({ ...sessionRow, guide_lessons: [{ ...lessonRow, chapters: [{ title: 1 }] }] }));
assert.throws(() => decodeSession({ ...sessionRow, guide_lessons: [{ ...lessonRow, chapters: [{ title: 'x', blocks: [{ type: 'html', content: '<b>' }] }] }] }));

const refs = flattenGuide([session, { ...session, id: 'x', slug: 'next', lessons: [{ ...session.lessons[0], slug: 'third' }] }]);
assert.deepEqual(refs.map(r => r.number), ['1.1', '1.2', '2.1']);
const found = findLesson([session], 'second');
assert.equal(found.prev.lesson.slug, 'overview'); assert.equal(found.next, undefined);
assert.equal(findLesson([session], 'missing'), undefined);

// 편집기 변환
const editable = toEditableLesson({ ...lessonRow, session_id: sessionRow.id, youtube_id: 'dQw4w9WgXcQ' }, '메모');
assert.equal(editable.youtube_url, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
assert.equal(editable.chapters[1].start, '0:30'); assert.equal(editable.target_minutes, '10'); assert.equal(editable.notes, '메모');

// 데이터 조회
const originalFetch = globalThis.fetch;
process.env.LETSCODING_LOUNGE_SUPABASE_URL = 'https://example.supabase.co';
process.env.LETSCODING_LOUNGE_SUPABASE_ANON_KEY = 'test-key';
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers['Accept-Profile'], 'landing');
    assert.equal(options.cache, 'no-store');
    assert.match(url.searchParams.get('select'), /guide_lessons\(/);
    return Response.json([{ ...sessionRow, slug: 'later', sort_order: 20 }, sessionRow]);
  };
  const sessions = await getGuide();
  assert.deepEqual(sessions.map(s => s.slug), ['start', 'later']);
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(getGuide, /503/);
  globalThis.fetch = async () => Response.json({});
  await assert.rejects(getGuide, /Invalid/);
} finally { globalThis.fetch = originalFetch; }
console.log('Guide parsing, decoding, numbering and fetch checks passed.');

// 편집기 입력 검증
const payload = {
  session_id: sessionRow.id, slug: 'new-lesson', title: '제목', summary: '', audience: '학생', youtube_url: 'https://youtu.be/dQw4w9WgXcQ',
  target_minutes: '7', is_complete: false, sort_order: '30',
  chapters: [{ title: '소제목', start: '1:05', blocks: [{ type: 'text', content: '본문\n\n- 목록' }, { type: 'prompt', content: '요청문' }] }], notes: '메모',
};
const valid = validateLesson(payload);
assert.equal(valid.youtube_id, 'dQw4w9WgXcQ'); assert.equal(valid.target_minutes, 7); assert.equal(valid.sort_order, 30);
assert.equal(valid.chapters[0].start, 65); assert.equal(valid.notes, '메모');
assert.equal(validateLesson({ ...payload, youtube_url: '', target_minutes: '' }).youtube_id, null);
assert.equal(validateLesson({ ...payload, youtube_url: '', target_minutes: '' }).target_minutes, null);
assert.equal(validateLesson({ ...payload, chapters: [] }).chapters.length, 0, '소제목이 없는 편(계획 단계)도 저장할 수 있다');
for (const change of [
  { session_id: 'not-uuid' }, { slug: 'editor' }, { slug: '../x' }, { title: ' ' }, { audience: '학부모' }, { is_complete: 'true' },
  { youtube_url: 'https://vimeo.com/1' }, { target_minutes: '0' }, { target_minutes: '1.5' }, { sort_order: '-1' },
  { chapters: [{ title: '', start: '', blocks: [] }] }, { chapters: [{ title: 'x', start: '9:99', blocks: [] }] },
  { chapters: [{ title: 'x', start: '', blocks: [{ type: 'text', content: '' }] }] },
  { chapters: [{ title: 'x', start: '', blocks: [{ type: 'image', url: 'javascript:alert(1)' }] }] },
  { chapters: [{ title: 'x', start: '', blocks: [{ type: 'text', content: '```\nunclosed' }] }] },
  { notes: 'x'.repeat(20001) },
]) assert.throws(() => validateLesson({ ...payload, ...change }), JSON.stringify(change).slice(0, 80));

assert.deepEqual(validateSession({ slug: 'clone', title: '클론코딩', description: '', sort_order: '60' }), { slug: 'clone', title: '클론코딩', description: '', sort_order: 60 });
for (const change of [{ slug: 'A' }, { title: '' }, { sort_order: 'x' }]) assert.throws(() => validateSession({ slug: 'ok', title: '제목', description: '', sort_order: '1', ...change }));
console.log('Editor payload and unsafe input checks passed.');
