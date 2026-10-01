import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const pdf = await readFile(path.join(process.cwd(), "output/pdf/letscoding-lounge-brochure.pdf"));
  return new Response(pdf, { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="letscoding-lounge-brochure.pdf"' } });
}
