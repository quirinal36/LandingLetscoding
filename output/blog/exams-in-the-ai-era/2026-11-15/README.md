# AI 시대의 시험 — 초안 편집 기록

대상: https://www.letscoding.kr/blog/editor?slug=exams-in-the-ai-era

`landing.blog_posts`의 기존 초안에 저장했다. 공개 상태는 `false`로 유지했다. 본문, 대표 이미지 주소·설명, 수정 시각만 바뀌었다. 원본은 `original-db.json`과 `original-form.json`, 저장 결과는 `saved-db.json`이다.

## 반영 내용

- 소제목 7개, 본문 문단과 인용 구분. 본문은 편집 가능한 텍스트 4개와 이미지 3개 블록으로 저장했다.
- 대표 이미지: [시험과 AI 삽화](assets/cover.jpg).
- 마지막 질문 앞: [아이와 부모의 대화 삽화](assets/learning-conversation.jpg).
- 원문의 유튜브 영상 2개는 공식 썸네일과 채널·업로드일·길이·보기 링크로 표시했다. 페이지 내 재생기는 추가하지 않았다.
- 기사 5개에는 제목·매체·기자 또는 공식 자료 표시·발행일을 붙였다.
- 내장 `image_gen`으로 삽화 2장을 생성했다. [최종 프롬프트](image-prompts.md), [업로드 URL·해시](assets/uploaded.json).

## 확인

기존 `validatePost`, `decodePost`, `ArticleBody`를 사용해 본문과 미리보기를 확인했다. 소제목 7개, 기사·영상 링크 7개, 표지를 포함한 이미지 4개가 정상이며 각 이미지 URL은 200 응답과 이미지 콘텐츠를 반환했다. 편집 화면을 다시 열어 저장된 내용을 확인했고 익명 DB 요청에는 초안이 노출되지 않았다.

데스크톱 1280px 및 모바일 390px에서 확인했다. 모바일 문서 너비가 화면 너비와 동일하고 모든 이미지가 로드됐다. [표지 배치](preview-top.png), [마무리 배치](preview-closing.png), [모바일](preview-mobile-top.png), [모바일 기사](preview-mobile-sources.png), [모바일 영상](preview-mobile-video.png).

미리보기는 [preview.html](preview.html)이며 현 세션의 로컬 서버 주소는 http://127.0.0.1:8788/preview.html 이다. 기존 글 렌더러와 현재 서비스의 스타일시트를 사용했다.

## 자료 확인과 소폭 정정

- 뉴스투데이 · 염보라 · 2026.11.15: https://www.news2day.co.kr/article/20261115500031
- 공감신문 · 이상민 · 2025.11.17: https://www.gokorea.kr/news/articleView.html?idxno=846827
- 국민일보 · 임송수 · 2025.11.16: https://www.kmib.co.kr/article/20251116500296
- 조선일보 · 김혜민 · 2025.11.12: https://www.chosun.com/national/national_general/2025/11/12/EQL3JICEYRHUPOKCIX44KVXWHE/
- SK하이닉스 뉴스룸 · 2026.06.17: https://news.skhynix.co.kr/ai-talent-recruit-2026/
- 테크몽 영상: https://youtu.be/Vtni0Dz35sk — 실제 업로드일이 2026.06.19라 원문의 ‘4개월 전’을 ‘지난 6월’로 바꿨다.
- EBS 공식 영상: https://youtu.be/9hAUsV1zCsw — 유튜브 업로드일 2017.02.27을 원 방송일과 구분해 표시했다.

공감신문의 고려대 기사는 오픈채팅방 집단 부정행위를 다루므로 세 대학 사례를 묶은 문장을 ‘AI 이용과 집단 부정행위 논란’으로 조정했다. 국민일보 링크는 원문을 열었을 때 이동한 현재 주소를 사용했다. 원문의 나머지 주장·경험은 유지했으며 본문 전체의 사실 검증이나 영상 전체 시청은 수행하지 않았다.
