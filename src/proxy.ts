import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!request.cookies.getAll().some(({ name }) => name.startsWith("landing-auth"))) return response;
  const supabase = createServerClient(
    process.env.LETSCODING_LOUNGE_SUPABASE_URL!,
    process.env.LETSCODING_LOUNGE_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: "landing-auth", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  await supabase.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/blog/:path*", "/auth/:path*"] };
