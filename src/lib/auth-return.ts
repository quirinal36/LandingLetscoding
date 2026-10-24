/** 로그인·로그아웃 뒤 돌아갈 곳. 사이트 안의 블로그·가이드 경로만 허용한다. */
export const RETURN_COOKIE = "landing-next";
const RETURN_PATH = /^\/(blog|guide)(\/[a-z0-9-]+)*\/?$/;

export function safeReturnPath(value: unknown) {
  return typeof value === "string" && RETURN_PATH.test(value) ? value : "/blog";
}
