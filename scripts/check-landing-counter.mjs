// Run: node scripts/check-landing-counter.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync('src/components/landing/reveal-observer.tsx', 'utf8')
  .replace('import { useEffect } from "react";', '').replace('export function', 'function')
  .replaceAll('<HTMLElement>', '').replaceAll(': HTMLElement', '').replaceAll(' as HTMLElement', '')
  .replaceAll(': Animation[]', '').replaceAll(': Keyframe[]', '');
for (const target of [224,45,8689,419,230,1000,0]) for (const reduced of [false,true]) {
  let observe, cleanup;
  const animations = [];
  const element = () => ({ children: [], textContent: '',
    replaceChildren(...rows) { this.children = rows; }, append(row) { this.children.push(row); },
    animate(keyframes, options) { const a = { keyframes, options, cancelled: false, cancel() { this.cancelled = true; } }; animations.push(a); return a; } });
  const el = Object.assign(element(), { dataset: { count: String(target) }, textContent: target.toLocaleString('ko-KR') });
  runInNewContext(`${source}; RevealObserver();`, {
    useEffect: fn => { cleanup = fn(); },
    document: { documentElement: { classList: { add() {} } }, createElement: element, querySelectorAll: s => s === '[data-count]' ? [el] : [] },
    window: { matchMedia: () => ({ matches: reduced }) },
    IntersectionObserver: class { constructor(fn) { observe = fn; } observe() {} unobserve() {} disconnect() {} },
  });
  if (reduced) { assert.equal(el.textContent, target.toLocaleString('ko-KR')); assert.equal(animations.length, 0); continue; }
  observe([{ isIntersecting: true, target: el }]);
  if (target % 10) {
    for (let step=0; step<=target % 10; step++) {
      const text = el.children.map(cell => cell.children.length ? cell.children[0].children[step].textContent : cell.textContent).join('').trim();
      assert.equal(text, (Math.floor(target/10)*10+step).toLocaleString('ko-KR'));
    }
    assert.equal(animations.length, 1);
    assert.equal(el.children.at(-1).children[0].children.at(-1).textContent, '0');
    assert.equal(animations[0].keyframes.at(-1).offset, 1);
    assert.equal(animations[0].options.duration, (target % 10 + 1) * 850);
    assert.equal(el.children.at(-1).children[0].children[0].textContent, '0');
    if (target === 224) {
      assert.equal(el.children[0].textContent, '2'); assert.equal(el.children[1].textContent, '2');
      assert.equal(animations.length, 1);
      assert.deepEqual(el.children[2].children[0].children.map(row => row.textContent), ['0','1','2','3','4','0']);
    }
    assert.ok(animations.every(a => a.options.iterations === Infinity && a.keyframes.every(f => !('opacity' in f))));
  }
  cleanup(); assert.ok(animations.every(a => a.cancelled));
  assert.equal(el.textContent, target.toLocaleString('ko-KR'));
}
console.log('Tens-based starts (220, 40, 8,680, 410), fixed prefixes, seamless infinite loop, reduced motion and cleanup passed.');
