import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const root = process.cwd();
  const [source, fonts] = await Promise.all([
    readFile(path.join(root, "output/hackathon-proposal/index.html"), "utf8"),
    readFile(path.join(root, "src/app/fonts.css"), "utf8"),
  ]);
  const html = source
    .replace('<link rel="stylesheet" href="../../prototypes/brochure/fonts.css">', `<style>${fonts}</style>`)
    .replaceAll("../../public/", "/");
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
