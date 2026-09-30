This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 블로그 데이터 연결

블로그는 Supabase의 `landing.blog_posts`에서 공개 글을 읽습니다. 목록·상세·RSS·사이트맵은 요청 시 DB를 조회하므로 글 변경에는 재빌드가 필요하지 않습니다. 블로그에서 카카오 로그인한 플랫폼 관리자만 작성·수정·삭제할 수 있습니다.

서버 환경변수는 `LETSCODING_LOUNGE_SUPABASE_URL`, `LETSCODING_LOUNGE_SUPABASE_ANON_KEY`입니다. Data API의 Exposed schemas에 `landing`이 등록되어 있어야 합니다. 조회에 service-role 키는 사용하지 않습니다.

본문 `blocks`는 `{ type: "text", content }`, `{ type: "image", url, alt? }`, `{ type: "prompt", content }`를 지원합니다. 텍스트 안의 소제목·인용·코드 블록은 기존 문법을 유지합니다. 지원하지 않는 블록이나 DB 오류는 빈 글로 숨기지 않고 오류로 처리합니다.

기존 8편은 `public.blog_posts`에서 복사했고 이미지도 기존 Supabase Storage URL을 사용합니다. 이후 `landing`의 글을 수정해도 `public` 원본과 자동 동기화되지 않습니다. `content/blog/*.md`와 `public/blog/`는 이전 자료로 보관하며 사이트의 데이터 원본이 아닙니다.

마이그레이션은 `../letscoding_lounge/supabase/migrations/`에서만 관리합니다. 데이터 복사는 `20260930012443_seed_landing_blog_posts.sql`에 기록되어 있습니다.

검증: `node scripts/check-blog.mjs`, `npm run build`.


### 관리자 로그인과 편집

- `/blog`에서 카카오 로그인하면 플랫폼 관리자에게 글 작성 버튼과 초안 목록이 보입니다. 공개 글 상세에는 수정·삭제 버튼이 보입니다.
- `/blog/editor`에서 작성하고 `/blog/editor?slug=글주소`에서 수정합니다. 텍스트·이미지 URL·코드 블록의 순서 변경, 대표 이미지, 카테고리, 공개/초안 저장을 지원합니다. 이미지 파일 업로드는 아직 지원하지 않습니다.
- 삭제 전 확인하며, 저장 실패 시 폼 입력을 유지합니다. 수정 시각을 비교해 다른 곳에서 바뀐 글을 덮어쓰거나 삭제하지 않습니다.
- Supabase SSR PKCE와 호스트 전용 HttpOnly 쿠키를 사용합니다. `.letscoding.kr` 전체로 쿠키를 공유하지 않습니다. 서버 액션마다 사용자와 플랫폼 관리자 권한을 확인하고, 사용자 JWT로 DB에 접근해 RLS도 적용합니다.
- 등록된 콜백은 `https://www.letscoding.kr/auth/callback`과 localhost/127.0.0.1의 3000·3100 포트입니다. 공용 Supabase의 기존 Kakao provider·site URL·다른 앱 콜백은 유지합니다.
- 인증 검증: 빌드 후 `npm run start -- --port 3100`을 실행하고 `node scripts/check-blog-auth.mjs`. 입력 검증: `node scripts/check-blog.mjs`.
- 브라우저에서 카카오 인증 화면 이동까지 확인했습니다. 실제 관리자 계정으로 로그인한 뒤 작성·수정·삭제하는 최종 확인과 사이트 배포는 별도입니다.
