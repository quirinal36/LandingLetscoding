import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("index.html", import.meta.url), "utf8");
const paragraphs = JSON.parse(await readFile(new URL("source-text.json", import.meta.url), "utf8"));
assert.equal((source.match(/<section\b/g) || []).length, 8);
for (const paragraph of paragraphs.flat(2)) {
  assert.ok(source.includes(paragraph), `Missing source paragraph: ${paragraph}`);
}
for (let i = 1; i <= 8; i++) assert.ok(source.includes(`id="slide-${i}"`));
for (let i = 1; i <= 7; i++) {
  const filename = `assets/image${i}.png`;
  assert.ok(source.includes(filename));
  const image = await readFile(new URL(filename, import.meta.url));
  assert.equal(image.subarray(1, 4).toString(), "PNG");
}
if (process.argv[2]) {
  const response = await fetch(process.argv[2]);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.equal((html.match(/src="data:image\/png;base64,/g) || []).length, 7);
  assert.ok(!html.includes('href="../../prototypes/'));
  assert.equal((html.match(/<section\b/g) || []).length, 8);
}
console.log("PASS: 8 slides, all source paragraphs, 7 images" + (process.argv[2] ? ", route response" : ""));
