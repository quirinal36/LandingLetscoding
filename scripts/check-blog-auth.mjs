// Run after npm run build and npm run start -- --port 3100. Sends only unauthenticated requests.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = 'http://localhost:3100';
const manifest = JSON.parse(await readFile('.next/server/server-reference-manifest.json', 'utf8')).node;
const editor = await (await fetch(`${base}/blog/editor`)).text();
assert.ok(editor.includes('관리자 로그인이 필요합니다.'));
assert.ok(!editor.includes('<textarea'));
for (const name of ['savePost', 'deletePost']) {
  const action = Object.entries(manifest).find(([, value]) => value.exportedName === name)?.[0];
  assert.ok(action, `Missing action ${name}`);
  const args = name === 'savePost' ? [{}, null, null] : ['00000000-0000-0000-0000-000000000000', '2026-09-30T00:00:00Z'];
  const request = origin => fetch(`${base}/blog/editor`, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Next-Action': action, Origin: origin },
    body: JSON.stringify(args),
  });
  const response = await request(base);
  assert.ok((await response.text()).includes('관리자 로그인 후 다시 시도해 주세요.'));
  assert.ok([403, 500].includes((await request('https://evil.example')).status));
}
const failedCallback = await fetch(`${base}/auth/callback?next=https://evil.example`, { redirect: 'manual' });
assert.equal(failedCallback.headers.get('location'), `${base}/blog?auth=failed`);
console.log('Anonymous CRUD, editor guard, cross-origin rejection and callback redirect checks passed.');
