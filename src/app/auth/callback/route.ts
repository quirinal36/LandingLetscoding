import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COMPANY } from "@/lib/nav";
import { RETURN_COOKIE, safeReturnPath } from "@/lib/auth-return";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const origin = /^(localhost|127\.0\.0\.1):(3000|3100)$/.test(host) ? `http://${host}` : COMPANY.url;
  const next = safeReturnPath(request.cookies.get(RETURN_COOKIE)?.value);
  const code = request.nextUrl.searchParams.get("code");
  let target = `${next}?auth=failed`;
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) target = next;
  }
  const response = NextResponse.redirect(new URL(target, origin));
  response.cookies.set(RETURN_COOKIE, "", { path: "/auth", maxAge: 0 });
  return response;
}
