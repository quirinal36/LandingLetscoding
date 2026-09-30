"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { COMPANY } from "@/lib/nav";

export async function loginWithKakao() {
  const host = (await headers()).get("host") ?? "";
  const origin = /^(localhost|127\.0\.0\.1):(3000|3100)$/.test(host) ? `http://${host}` : COMPANY.url;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao", options: { redirectTo: `${origin}/auth/callback`, skipBrowserRedirect: true },
  });
  if (error || !data.url) redirect("/blog?auth=failed");
  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  redirect(error ? "/blog?auth=logout-failed" : "/blog");
}
