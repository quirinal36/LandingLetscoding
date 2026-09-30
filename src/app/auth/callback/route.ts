import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COMPANY } from "@/lib/nav";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const origin = /^(localhost|127\.0\.0\.1):(3000|3100)$/.test(host) ? `http://${host}` : COMPANY.url;
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/blog", origin));
  }
  return NextResponse.redirect(new URL("/blog?auth=failed", origin));
}
