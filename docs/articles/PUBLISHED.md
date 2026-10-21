# 블로그 발행 기록

## 2026-10-21

학원장 대상 소개 글 세 편을 `landing.blog_posts`에 발행했다. 원고는 `drafts/`의 같은 slug 파일로 관리한다.

- https://www.letscoding.kr/blog/about-letscoding-company
- https://www.letscoding.kr/blog/letscoding-studio-launch
- https://www.letscoding.kr/blog/what-is-letscoding-lounge

Studio 글은 제공된 미리보기·레코 대화 스크린샷 두 장을 사용했다. 회사 글과 라운지 글 표지는 기존 사이트의 원장 프로필·라운지 프로필 화면을 재사용했다. 이미지 업로드 결과는 각 assets 디렉터리의 `uploaded.json`에 기록했다.

기존 `../letscoding_lounge/.claude/skills/blog-post/scripts/publish.py`를 모듈로 불러 사용했다. 원고 디렉터리는 이 저장소를 지정하고, `blog_posts` 요청만 `Accept-Profile`·`Content-Profile: landing`으로 처리했다. `public.blog_posts`는 변경하지 않았다. 이미지 블록에는 대체 텍스트를 포함했다.

검증: 원고 형식, 저장된 블록의 `decodePost()` 처리, 공개 이미지 HTTP 응답, 세 상세 페이지의 제목·이미지·색인 허용, 블로그 목록·사이트맵·RSS의 세 글 포함 여부를 확인했다.

구글 서치콘솔·네이버 서치어드바이저의 사이트맵 수동 재제출은 하지 않았다. 실제 검색 색인 여부는 별도로 확인해야 한다.
