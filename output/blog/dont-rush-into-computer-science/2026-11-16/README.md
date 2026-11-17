# 컴공과 보내지 마세요 — 소제목·이미지 추가

대상 글: https://www.letscoding.kr/blog/dont-rush-into-computer-science

2026-11-16, 기존 공개 글에 반영했다. 원문 문장·제목·공개 여부·발행일은 그대로 두었다. 변경 필드는 `blocks`, `cover_image_url`, `cover_image_alt`, `updated_at`이다. 원본은 `original-db.json`, 저장 결과는 `saved-db.json`에 보관했다.

## 소제목 7개

1. 아이는 게임의 어떤 부분을 좋아할까요?
2. 아이디어를 작품으로 옮기는 방법이 달라졌습니다
3. 학교에서 배우는 것과 아이가 마주할 세상
4. 만들고, 보여주고, 고치면서 배우는 것
5. 관심 있는 전공에 제작 경험을 더한다면
6. 진로를 정하기 전에, 직접 해볼 시간을 주세요
7. 오늘 아이에게 건넬 질문 하나

## 생성 삽화 3장

- [표지](assets/cover.jpg): 학생이 노트에 그린 아이디어를 게임 세계로 상상하는 장면. 제목·요약 아래에 표시한다.
- [친구들과 해보고 고치기](assets/playtest-feedback.jpg): ‘그러면 이제 그 생각을 AI와 함께 만들어보게 하는 겁니다.’ 다음에 배치했다.
- [관심 분야를 작품으로 연결하기](assets/interests-to-projects.jpg): ‘그 관심을 진학과 연결해볼 수 있는 거예요.’ 다음에 배치했다.

내장 `image_gen`을 사용했다. [최종 프롬프트](image-prompts.md), [Storage 업로드 기록](assets/uploaded.json). 생성 원본은 Codex generated_images에 보존하고 이 디렉터리의 JPEG를 실제 글에 사용했다. 세 장 모두 실제 학생·수업의 기록 사진이 아닌 개념 삽화다.

## 확인

- 새 소제목과 AI 삽화 안내 문장을 제외하면 원문 전체가 정확히 일치한다는 assert를 통과했다.
- 기존 `validatePost`·`decodePost`로 본문을 검증했다.
- 이미지 3개의 공개 URL에서 이미지 콘텐츠와 200 응답을 확인했다.
- 익명 DB 조회에도 저장 결과가 그대로 반환된다.
- 실제 공개 페이지에서 소제목 7개·이미지 3개를 확인했다. 390px 모바일에서 가로 넘침이 없고 모든 이미지가 로드된다.
- [데스크톱 표지](cs-after-top.png), [피드백 장면](cs-feedback-desktop.png), [전공 연결 장면](cs-interests-desktop.png), [모바일 소제목](cs-mobile-section.png), [모바일 이미지](cs-mobile-image.png).

대표 이미지 설명은 DB에 저장했다. 현재 배포된 사이트는 대표 이미지에 빈 alt를 출력하며, 본문 두 이미지의 대체 텍스트는 정상 출력된다. 사이트 코드는 이번 작업에서 바꾸지 않았다. 원문의 사실관계 검증은 요청 범위에 포함하지 않았다.
