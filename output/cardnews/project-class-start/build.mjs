// 사용법: node build.mjs
// cards.template.html 의 {{ACADEMY}} {{ACADEMY_SHORT}} {{PHONE}} {{ADDRESS}} 를 학원별로 치환해 cards-<key>.html 을 만든다.
// 이어서 node render.mjs cards-<key>.html out/<key> 로 PNG 를 만든다.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ACADEMIES = [
  { key: 'letscoding', ACADEMY: '렛츠코딩앤플레이학원', ACADEMY_SHORT: '렛츠코딩앤플레이학원', PHONE: '063-714-2536', ADDRESS: '전북 혁신도시 출판로 46-5 대온빌딩 301호' },
  { key: 'mjcoding', ACADEMY: 'MJ코딩 경남양산', ACADEMY_SHORT: 'MJ코딩 경남양산', PHONE: '0507-1317-5080', ADDRESS: '경남 양산시 물금읍 야리로 31 경남프라자 5층 501호' },
];

const template = await readFile(path.join(here, 'cards.template.html'), 'utf8');
for (const a of ACADEMIES) {
  const html = template.replace(/\{\{(ACADEMY_SHORT|ACADEMY|PHONE|ADDRESS)\}\}/g, (_, k) => a[k]);
  if (/\{\{/.test(html)) throw new Error('unreplaced placeholder for ' + a.key);
  const out = path.join(here, `cards-${a.key}.html`);
  await writeFile(out, html);
  console.log('wrote', path.basename(out));
}
