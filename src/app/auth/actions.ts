"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COMPANY } from "@/lib/nav";
import { RETURN_COOKIE, safeReturnPath } from "@/lib/auth-return";

async function origin() {
  const host = (await headers()).get("host") ?? "";
  return /^(localhost|127\.0\.0\.1):(3000|3100)$/.test(host) ? `http://${host}` : COMPANY.url;
}

export async function loginWithKakao(formData?: FormData) {
  const next = safeReturnPath(formData?.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao", options: { redirectTo: `${await origin()}/auth/callback`, skipBrowserRedirect: true },
  });
  if (error || !data.url) redirect(`${next}?auth=failed`);
  // 콜백은 code만 받으므로 돌아갈 경로를 짧은 쿠키로 넘긴다.
  (await cookies()).set(RETURN_COOKIE, next, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/auth", maxAge: 600,
  });
  redirect(data.url);
}

export async function logout(formData?: FormData) {
  const next = safeReturnPath(formData?.get("next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  redirect(error ? `${next}?auth=logout-failed` : next);
}
