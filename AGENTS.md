<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 랜딩 페이지 참고 문서

index(`/`) 랜딩 페이지의 섹션 구성과 번호는 [LANDING-PLAN.md](docs/LANDING-PLAN.md)를 먼저 참고한다. 사용자와 대화할 때 섹션 번호는 이 문서의 코드 주석 기준 번호를 뜻한다. 섹션 구성이나 번호를 변경하면 문서도 함께 갱신하고, 문서와 실제 코드가 다르면 현재 코드를 확인한다.

## Supabase 스키마와 마이그레이션 관리

- 이 프로젝트는 `LETSCODING_LOUNGE_SUPABASE_URL`의 공용 Supabase 프로젝트 안에서 `landing` 스키마를 사용한다. 현재 DB 구현 범위는 블로그(`landing.blog_posts`)와 온보딩 가이드(`landing.guide_sessions`·`guide_lessons`·`guide_lesson_notes`)이며, 상담신청·공지사항·커뮤니티는 추후 추가한다.
- 마이그레이션 파일은 `/Users/letscoding/Documents/workspace/github/letscoding_lounge` 저장소에서 통합 관리한다. `edu_manager`와 동일한 관리 방식을 따른다.
- 이 저장소에는 마이그레이션 파일이나 별도 마이그레이션 이력을 만들지 않는다. 스키마·테이블·권한·RLS 등 DB 변경은 중앙 저장소의 지침과 기존 마이그레이션을 확인한 뒤 그곳에서 작성하고 관리한다.
- 이 저장소는 애플리케이션의 DB 연결, 조회, 관리자 기능 등 사용 코드를 관리한다.

## 블로그 데이터 원본

블로그는 `landing.blog_posts`를 요청 시 조회한다. `content/blog/*.md`는 이전 자료이며 현재 글 수정 대상으로 사용하지 않는다. 연결·본문 형식·검증 방법은 [README.md](README.md)의 블로그 데이터 연결 절을 참고한다. 블로그 목록의 카카오 로그인 후 플랫폼 관리자와 지정 블로그 관리자만 글 작성·수정·삭제와 초안 관리가 가능하다. 권한은 서버의 `getUser()` 및 `landing.can_manage_blog()`과 DB RLS로 검증한다.

## 온보딩 가이드 데이터 원본

온보딩 가이드(`/guide`)는 `landing.guide_sessions`와 `landing.guide_lessons`를 요청 시 조회한다. 계층은 세션 > 편 > 소제목(chapters jsonb) > 내용이다. 준비 중인 편도 공개 목차에 보이며 `is_complete`가 거짓이면 `준비 중`으로 표시한다. 영상은 `youtube_id`로 연결하고 소제목의 `start`(초)로 챕터 이동을 한다. 편집은 블로그와 같은 권한(`getUser()` + `landing.can_manage_blog()` + RLS)으로 `/guide/editor`에서 하고, 촬영 메모는 관리자 전용 `landing.guide_lesson_notes`에 둔다. 초기 목차와 촬영 계획의 초안은 `output/onboarding_guide/`에 있고 최신 상태는 DB가 기준이다. 연결·검증 방법은 [README.md](README.md)의 온보딩 가이드 데이터 연결 절을 참고한다.
