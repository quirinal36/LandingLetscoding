import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Keep the editable deck usable from file:// and publish only the files it uses.
const source = "output/expo-talk";
const destination = "public/expo-talk";
const html = await readFile(path.join(source, "index.html"), "utf8");
const references = [...html.matchAll(/(?:src="|poster="|url\(")([^"]+)"/g)].map(match => match[1]);
let published = html;
for (const reference of new Set(references)) {
  if (reference.startsWith("../../public/")) {
    published = published.replaceAll(reference, reference.slice("../../public".length));
    continue;
  }
  const filename = reference.startsWith("../") ? path.basename(reference) : reference;
  const target = path.join(destination, filename);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(source, reference), target);
  published = published.replaceAll(`"${reference}"`, `"${filename}"`);
}
await writeFile(path.join(destination, "index.html"), published);
