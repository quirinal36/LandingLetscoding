import assert from 'node:assert/strict';
import { decodePost, getPosts, getPost, parseBody, validatePost } from '../src/lib/blog.ts';

const row = {
  slug: 'test-post', title: 'Test', summary: 'Summary', category: 'column',
  author_name: 'Author', author_title: 'Teacher', published_at: '2026-09-30T00:00:00Z',
  created_at: '2026-09-29T00:00:00Z', updated_at: '2026-09-30T00:00:00Z', cover_image_url: null,
  blocks: [{ type: 'text', content: '## Heading\n\nParagraph\n\n> Quote' },
    { type: 'image', url: 'https://example.com/image.png', alt: 'Diagram' },
    { type: 'prompt', content: '<script>plain text</script>' }],
};
assert.deepEqual(decodePost(row).body.map(b => b.kind), ['heading', 'paragraph', 'quote', 'image', 'code']);
assert.equal(decodePost({ ...row, published_at: null }).publishedAt, row.created_at);
assert.throws(() => decodePost({ ...row, blocks: [{ type: 'image', url: 'javascript:alert(1)' }] }));
assert.throws(() => decodePost({ ...row, category: 'unknown' }));
assert.throws(() => decodePost({ ...row, blocks: {} }));
assert.throws(() => parseBody('```\nunclosed'));

const originalFetch = globalThis.fetch;
process.env.LETSCODING_LOUNGE_SUPABASE_URL = 'https://example.supabase.co';
process.env.LETSCODING_LOUNGE_SUPABASE_ANON_KEY = 'test-key';
const offsets = [];
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers['Accept-Profile'], 'landing');
    assert.equal(options.cache, 'no-store');
    assert.equal(url.searchParams.get('is_published'), 'eq.true');
    const offset = Number(url.searchParams.get('offset'));
    offsets.push(offset);
    return Response.json(Array.from({ length: offset === 0 ? 100 : 1 }, (_, i) => ({ ...row, slug: `post-${offset + i}` })));
  };
  assert.equal((await getPosts()).length, 101);
  assert.deepEqual(offsets, [0, 100]);
  assert.equal((await getPost('post-100')).slug, 'post-100');
  globalThis.fetch = async () => Response.json([]);
  assert.equal(await getPost('removed'), undefined);
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(getPosts, /503/);
} finally { globalThis.fetch = originalFetch; }
console.log('Blog decoding, pagination, deletion and error checks passed.');

const payload = {
  slug: 'valid-post', title: 'Title', summary: '', category: 'column',
  author_name: 'Author', author_title: '', cover_image_url: '',
  is_published: false, blocks: [{ type: 'text', content: '## Title\n\nBody' }],
};
assert.equal(validatePost(payload).is_published, false);
assert.equal(validatePost(payload).cover_image_url, null);
for (const change of [
  { slug: 'editor' }, { slug: '../bad' }, { title: ' ' }, { is_published: 'true' },
  { category: 'bad' }, { blocks: [] }, { blocks: [{ type: 'html', content: '<script/>' }] },
  { blocks: [{ type: 'image', url: 'javascript:alert(1)' }] },
  { cover_image_url: '//evil.example/a.png' }, { blocks: [{ type: 'text', content: '```\nunclosed' }] },
]) assert.throws(() => validatePost({ ...payload, ...change }));
assert.deepEqual(validatePost({ ...payload, blocks: [{ type: 'image', url: '/blog/image.png', alt: 'Diagram' }, { type: 'prompt', content: 'code' }] }).blocks,
  [{ type: 'image', url: '/blog/image.png', alt: 'Diagram' }, { type: 'prompt', content: 'code' }]);
console.log('Editor payload and unsafe input checks passed.');
