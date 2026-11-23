import { readFile } from "node:fs/promises";
import path from "node:path";
import logo from "@/assets/logo.png";

export const dynamic = "force-static";

export async function GET() {
  const root = process.cwd();
  const directory = path.join(root, "output/ai-edu-expo");
  const [source, fonts, loungeQr] = await Promise.all([
    readFile(path.join(directory, "index.html"), "utf8"),
    readFile(path.join(root, "src/app/fonts.css"), "utf8"),
    readFile(path.join(root, "prototypes/brochure/assets/lounge-qr.svg"), "base64"),
  ]);
  const html = source.replace(
    '<link rel="stylesheet" href="../../prototypes/brochure/fonts.css">',
    `<style>${fonts}</style>`,
  )
    .replaceAll("../../public/", "/")
    .replaceAll("../pdf/letscoding-school-brochure.pdf", "/ai-edu-expo/pdf")
    .replaceAll("../../src/assets/logo.png", logo.src)
    .replaceAll("../../prototypes/brochure/assets/lounge-qr.svg", `data:image/svg+xml;base64,${loungeQr}`);
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
