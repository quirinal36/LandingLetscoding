import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const root = process.cwd();
  const directory = path.join(root, "output/ai-edu-expo");
  const [source, fonts, ...images] = await Promise.all([
    readFile(path.join(directory, "index.html"), "utf8"),
    readFile(path.join(root, "src/app/fonts.css"), "utf8"),
    ...Array.from({ length: 7 }, (_, i) =>
      readFile(path.join(directory, `assets/image${i + 1}.png`), "base64"),
    ),
  ]);
  let html = source.replace(
    '<link rel="stylesheet" href="../../prototypes/brochure/fonts.css">',
    `<style>${fonts}</style>`,
  );
  images.forEach((image, i) => {
    html = html.replaceAll(`assets/image${i + 1}.png`, `data:image/png;base64,${image}`);
  });
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
