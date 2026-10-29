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

## 2026-10-21 (표지 교체)

`about-letscoding-company` 표지를 원장 수채화 일러스트로 바꿨다. 이미지는 `public/blog/about-letscoding-company/cover.jpg`(1253×705, 16:9)로 사이트에 함께 배포한다. 원고 assets의 `cover.jpg`도 같은 파일로 바꿨다. `uploaded.json`은 이전 업로드 기록이라 sha256이 달라졌고, 다시 발행하면 새로 업로드된다. DB의 `cover_image_url`은 블로그 편집 화면에서 `/blog/about-letscoding-company/cover.jpg`로 바꾼다.

## 2026-10-30 (프로필 사진 교체)

브랜드스토리와 `about-letscoding-company` 표지를 사용자가 제공한 흑백 프로필 사진(898×1280)으로 교체했다. 브랜드스토리는 `public/about/leehg-profile.jpg`를 사용하고, 블로그 표지는 Supabase Storage에 새 파일로 업로드한 뒤 `landing.blog_posts.cover_image_url`을 갱신했다. 목록 카드에서는 얼굴이 잘리지 않도록 이 글의 이미지 위치를 조정했다.

공개 글 13편의 대표·본문 이미지와 전체 글 목록(초안 없음)을 확인했다. 원장 프로필 사용처는 브랜드스토리와 위 글의 대표 이미지였다. 원고 assets와 `public/blog/about-letscoding-company/cover.jpg`도 첨부 원본으로 교체했고, `uploaded.json`에 새 해시와 URL을 기록했다. DB 본문과 다른 글은 변경하지 않았다.
