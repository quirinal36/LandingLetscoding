import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const file = await readFile(path.join(process.cwd(), "output/pdf/letscoding-school-brochure.pdf"));
  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="letscoding-school-brochure.pdf"',
    },
  });
}
