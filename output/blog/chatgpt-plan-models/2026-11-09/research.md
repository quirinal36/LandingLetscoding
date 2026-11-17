# ChatGPT 요금제 글 최신화 조사 메모

확인일: 2026-11-09 (Asia/Seoul)
대상: https://www.letscoding.kr/blog/chatgpt-plan-models
원본: `landing.blog_posts`, id `cef7a8c7-7841-4c00-b912-7f130116928b`
조사 당시 updated_at: `2026-11-06T03:21:50.381263+00:00`

현재 상태: 사용자 요청에 따라 2026-11-09 공개 DB 반영 완료. 최종 `updated_at`은 `2026-11-09T14:23:23.858237+00:00`이다. 원본은 `original.json`, 개정 본문은 `revised.md`, 검토 당시 변경 값은 `update.json`에 있다. 실제 반영 직전 백업은 `before-publish.json`, 이미지 4장을 포함한 변경 값은 `publish-payload.json`, 저장 결과는 `published.json`, 공개 확인 결과는 `verification.json`이다. 로컬 파일은 편집 산출물이며 사이트 데이터 원본이 아니다.

## 주요 수정

| 항목 | 기존 설명 | 개정 방향과 근거 |
| --- | --- | --- |
| 기준일 | 2026-09-05 | 2026-11-09에 공식 문서 재조회 |
| Pro | 100·200달러, 사용량만 다름 | 500달러 및 Ultrafast 차이 반영. [Pro tiers](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers) |
| Chat | 유료 사용자의 GPT-5.6 중심 | GPT-6 순차 배포와 기존 명시 선택 유지 구분. [Chat 모델](https://help.openai.com/en/articles/20001354-gpt-6-and-other-models-in-chatgpt) |
| Codex | Free·Go는 Terra만 | 현재 무료 플랜 안내의 데스크톱 Luna를 설명하되 예전 모델의 즉시 종료를 주장하지 않음. [Pricing](https://learn.chatgpt.com/docs/pricing) |
| 유료 모델 | 5.6 Sol·Terra·Luna | 6.1 Sol·Terra, 6 Luna, Astra 중심으로 안내. [Models](https://learn.chatgpt.com/docs/models) |
| 추론 | 고정된 다섯 단계 | Max·Ultra와 모델별 지원 차이. [Models](https://learn.chatgpt.com/docs/models) |
| Go | Free와 모든 기능 동일 | 업로드·분석·메모리와 기능별 조건 설명. [Go](https://help.openai.com/en/articles/11989085-what-is-chatgpt-go) |
| 크레딧 | 무료도 일괄 충전 가능처럼 설명 | 일부 Free·Go 계정에 제공된다는 조건 반영. [Credits](https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-personal-plans) |

## 공식 문서 사이의 차이를 처리한 방법

- Chat 전용 도움말은 GPT-6 Sol이 일반 Chat의 GPT-6 단계를 담당한다고 설명한다. Work·Codex 문서에는 GPT-6 Sol을 일반 Chat에서 쓸 수 없다는 문장도 남아 있다. Chat 설명은 Chat 전용 문서의 배포 안내를 우선했다. GPT-6.1 Sol·Terra와 GPT-6 Sol을 혼동하지 않는다.
- Chat 도움말의 GPT-5.6 표에는 Free·Go Codex의 Terra가 남아 있다. 최신 가격 안내는 GPT-6 Luna를 안내한다. 세대와 배포 상태가 다른 설명이므로 ‘Terra가 완전히 없어졌다’거나 ‘이제 Luna만 가능하다’고 단정하지 않았다.
- Pricing의 포괄적 소개 문구만으로 모든 요금제에서 모든 Work 실행 환경이 열린다고 해석하지 않았다. Codex Cloud는 전용 도움말에서 Free·Go 제외를 확인했다. [Codex 이용](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- Pro 500, Pro 사용량 변경은 최신 Pro 전용 문서를 기준으로 삼았다. 문서에 없는 정확한 주간 횟수나 배수는 계산해 넣지 않았다.
- 검색 결과의 과거 캐시와 현재 본문이 다를 때는 실제로 연 현재 본문을 사용했다. 한국 계정의 결제 화면은 확인하지 않아 원화 금액을 기재하지 않았다.

## 이미지와 반영 범위

- 기존 본문의 9월 기준 기능·Chat 모델·가격·Codex 비교 이미지 4장은 개정안에서 제외한다. 내용이 달라져 대체 텍스트만 바꾸는 것으로는 해결되지 않는다.
- 새 비교 이미지 4장은 `assets/fig1.png`부터 `fig4.png`까지이며 가격, Chat, Work·Codex, 추론·속도 설정 순서로 본문에 배치했다. `assets/uploaded.json`에 공개 URL과 대체 텍스트를 기록했다.
- 태양·지구·달 삽화 1장과 아치형 문 대표 이미지는 유지했다.
- 기존 제목·slug·카테고리·작성자·최초 공개일·공개 상태를 유지하고 summary·blocks만 변경하도록 준비했다.
- id와 기존 updated_at을 함께 비교해 한 글의 summary·blocks만 갱신했다. 최초 공개일과 나머지 메타데이터 보존을 검증했다.
- 이미지는 기존 블로그 이미지 제작 방식인 HTML 렌더링을 사용했다. 1800px 폭이며 업로드 후 공개 URL의 파일 해시가 원본과 같은지 확인했다.
- 사이트 코드 변경은 하지 않았다. 비로그인 DB 조회와 공개 HTML에서 새 요약·날짜·이미지 및 이전 비교 이미지 제거를 확인했다.

이미지 재렌더링 명령(저장소 루트 기준):

```sh
node ../letscoding_lounge/docs/articles/drafts/chatgpt-plan-models.assets/render.mjs output/blog/chatgpt-plan-models/2026-11-09/assets
```

## 추가 확인 자료

- [Use ChatGPT](https://learn.chatgpt.com/docs/use-chatgpt): Chat·Work·Codex 용도
- [Model selection](https://learn.chatgpt.com/docs/model-selection): 작업별 모델 선택
- [Speed](https://learn.chatgpt.com/docs/agent-configuration/speed): 속도 설정과 사용량 소모
- [Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt): 파일 수
- [Excel / Sheets](https://help.openai.com/en/articles/20001063-chatgpt-for-excel-and-google-sheets): 플랜별 제공과 한도
- [Sites](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites): 개인 플랜 제공 범위와 제작·운영 사용량 구분
