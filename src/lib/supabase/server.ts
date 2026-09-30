import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export const authCookieOptions = {
  name: "landing-auth", httpOnly: true, sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production", path: "/",
};

export async function createClient() {
  const jar = await cookies();
  return createServerClient(
    process.env.LETSCODING_LOUNGE_SUPABASE_URL!,
    process.env.LETSCODING_LOUNGE_SUPABASE_ANON_KEY!,
    {
      cookieOptions: authCookieOptions,
      cookies: {
        getAll: () => jar.getAll(),
        setAll(values) {
          // Server Components는 쿠키를 쓸 수 없다. 만료 갱신은 proxy에서 처리한다.
          try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch {}
        },
      },
    },
  );
}

export const getViewer = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false, error: authError && authError.name !== "AuthSessionMissingError" ? "로그인 상태를 확인하지 못했습니다." : null };
  const { data, error } = await supabase.schema("landing").rpc("can_manage_blog");
  return { supabase, user, isAdmin: !error && data === true, error: error ? "관리자 권한을 확인하지 못했습니다." : null };
});
