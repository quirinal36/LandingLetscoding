import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script, runInNewContext } from 'node:vm';

const source = await readFile(new URL('index.html', import.meta.url), 'utf8');
const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate element IDs');
assert.equal((source.match(/<section class="slide\b/g) || []).length, 12);
for (const word of ['해커톤 대회를 위한','AI바이브코딩 플랫폼','100','2박 3일','데이터베이스','음원','배포','가상자산','브랜딩','토큰','종료 후']) assert.ok(source.includes(word), word);
for (const [, relative] of source.matchAll(/(?:src|href)="(\.\.\/[^\"]+)"/g)) assert.ok((await readFile(new URL(relative, import.meta.url))).length, relative);
const code = source.match(/<script>([\s\S]*?)<\/script>/)[1];
new Script(code);

// Exercise the URL bounds that control direct links and keyboard navigation.
const hashFunction = code.match(/function hashIndex\(\) \{[\s\S]*?\n\}/)[0];
for (const [hash, expected] of [['',0],['#slide-1',0],['#slide-12',11],['#slide-0',0],['#slide-9999',11],['#slide-bad',0]]) {
  assert.equal(runInNewContext(`${hashFunction}; hashIndex()`, {location:{hash},slides:Array(12)}), expected, hash);
}
if (process.argv[2]) {
  const response = await fetch(process.argv[2]);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const served = await response.text();
  assert.ok(!served.includes('../../public/') && !served.includes('../../prototypes/'));
  for (const [, asset] of served.matchAll(/src="(\/hackathon\/[^\"]+)"/g)) {
    const assetResponse = await fetch(new URL(asset, process.argv[2]));
    assert.equal(assetResponse.status, 200, asset);
    assert.match(assetResponse.headers.get('content-type'), /image\//, asset);
  }
}
console.log('PASS: 12 slides, unique IDs, sources, script syntax, deep-link bounds' + (process.argv[2] ? ', route and image responses' : ''));
