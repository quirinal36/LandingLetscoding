# Graph Report - LandingLetscoding  (2026-09-30)

## Corpus Check
- Initial scan: 213 files, estimated 901,404 words including embedded payloads. Build scope: 59 code files and 33 documents; 118 images and 3 media files excluded.

## Summary
- 641 nodes · 927 edges · 31 communities (25 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: AST 0; host semantic extraction unmetered (tool counters: 0 input · 0 output).

## Community Hubs (Navigation)
- 스크롤 장면 타임라인
- 랜딩과 브랜드 페이지
- 랜딩 기획과 디자인
- 블로그와 내비게이션 데이터
- 릴 캔버스 애니메이션
- AI 교육 철학
- 영상 제작과 프로토타입
- 공통 레이아웃과 헤더
- 앱 패키지 설정
- 상품 소개와 도입 상담
- TypeScript 설정
- 라운지 경제 모델
- 히어로 영상 합성
- 모션 패키지 설정
- 영상 자산 번들링
- Suno 음악 생성
- 음악 박자 정렬
- 영상 프레임 렌더링
- 모션 미리보기 서버
- 라운지 모델 도식
- Next.js 시작 안내
- ChatGPT 요금제 자료
- 뉴스 준비 페이지
- 교육 진화 프로토타입
- 릴 레퍼런스 분석
- ESLint 설정
- Next.js 설정
- PostCSS 설정
- 이미지 자르기
- 히어로 영상 오버레이

## God Nodes (most connected - your core abstractions)
1. `draw()` - 25 edges
2. `랜딩 페이지 구성 기획 v2` - 22 edges
3. `라운지 경제 모델 — 근거 자료` - 20 edges
4. `compilerOptions` - 16 edges
5. `font()` - 12 edges
6. `run()` - 12 edges
7. `getPosts()` - 12 edges
8. `SiteHeader()` - 11 edges
9. `kf()` - 10 edges
10. `COMPANY` - 10 edges

## Surprising Connections (you probably didn't know these)
- `학습자와 교육자의 행복·스스로 터득하고 판단하는 힘` --semantically_similar_to--> `코딩학원 원장님 대상: 공감→교육 모습→4주 사용`  [INFERRED] [semantically similar]
  content/blog/why-we-teach.md → LANDING-PLAN.md
- `12초 무음 루프: 만들다→보내다→해보다→반응→수정` --semantically_similar_to--> `라운지 확장 모델을 네 장면 종이 컷아웃으로 표현`  [INFERRED] [semantically similar]
  HERO-VIDEO-PLAN.md → GROWTH-SCENE-PLAN.md
- `루캣은 과제 보상보다 작품 가치의 신호` --semantically_similar_to--> `Lave & Wenger의 실천공동체`  [INFERRED] [semantically similar]
  ECONOMY-RESEARCH.md → lounge_model.md
- `AI가 코드 작성, 학생은 문제·판단·끝까지 만들기를 배움` --semantically_similar_to--> `공유 가능한 작품과 공동체 피드백 중심 반복 학습`  [INFERRED] [semantically similar]
  content/blog/coding-in-ai-era.md → lounge_model.md
- `Make, play, receive feedback, revise` --semantically_similar_to--> `Improve balloon effects and extend time from peer feedback`  [INFERRED] [semantically similar]
  motion/YOUTUBE.md → prototypes/media/hero-video/edit/editor.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **개인 창작에서 공동체와 성찰로 이어지는 교육 모형** — lounge_model_constructionism, lounge_model_social_constructivism, lounge_model_community_of_practice, lounge_model_reflection [EXTRACTED 1.00]
- **Reel preview, video rendering and YouTube publication** — motion_readme_reel_workflow, motion_reel_index_reel_player, motion_reel_thumbnail_thumbnail, motion_youtube_youtube_upload [EXTRACTED 1.00]

## Communities (31 total, 5 thin omitted)

### Community 0 - "스크롤 장면 타임라인"
Cohesion: 0.05384615384615385
Nodes (59): CAPTION_CSS, CAPTIONS, DRONE, EV, EvolveCaptions(), EvolveStage(), hToCq(), k() (+51 more)

### Community 1 - "랜딩과 브랜드 페이지"
Cohesion: 0.058001397624039136
Nodes (41): Chapter, CHAPTERS, metadata, Page(), PARAGRAPH, PARAGRAPH_LINES, Photo, metadata (+33 more)

### Community 2 - "랜딩 기획과 디자인"
Cohesion: 0.043478260869565216
Nodes (45): This is NOT the Next.js you know, 랜딩 번호는 LANDING-PLAN 코드 주석 기준, Next.js 변경 API는 node_modules/next/dist/docs 기준으로 확인, Hermes v0.21.0: Bot Mode·기억하는 cron·실행 중 조향, https://github.com/NousResearch/hermes-agent, https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31, Hermes Agent v0.21.0은 무엇이 달라졌나 — 에이전트 하나에서 에이전트 팀으로, 렛츠코딩 라운지 교육 사명 선언서 (+37 more)

### Community 3 - "블로그와 내비게이션 데이터"
Cohesion: 0.09988385598141696
Nodes (33): dynamic, esc(), GET(), metadata, Page(), PostCard(), dynamicParams, generateMetadata() (+25 more)

### Community 4 - "릴 캔버스 애니메이션"
Cohesion: 0.12682926829268293
Nodes (35): allText(), buffer(), chevron(), draw(), drawEaseWidget(), drawGrid(), drawHUD(), drawTracked() (+27 more)

### Community 5 - "AI 교육 철학"
Cohesion: 0.0553306342780027
Nodes (39): 챗봇 답 받기와 AI를 활용한 창작은 다르다, https://futureofeducation.substack.com/p/if-we-hand-chatbots-to-every-student, 챗봇에게 답을 받는 것과 AI를 쓰는 것은 다릅니다, https://futureofeducation.substack.com/p/philosophy-might-become-the-most, 코딩을 배워도 AI가 다 한다면, 그래도 배워야 하는 이유, AI가 코드 작성, 학생은 문제·판단·끝까지 만들기를 배움, AI 학교: 학습 효율 외 판단·관계·교사 역할이 필요, https://alpha.school/resources/how-alpha-two-hour-school-day-works/ (+31 more)

### Community 6 - "영상 제작과 프로토타입"
Cohesion: 0.06156156156156156
Nodes (37): ANALYSIS.md reference adaptation guide, 128 BPM, eight bars, fifteen-second loop, Deterministic 60fps canvas rendering, Landscape 16:9 and portrait 9:16 layouts, kie.ai Suno generation and fit_music.py beat alignment, Motion reel build and authoring guide, Reuse site Pretendard font assets, Kinetic typography, particles, morphs, tile flip, metaballs, counter, montage, end card (+29 more)

### Community 7 - "공통 레이아웃과 헤더"
Cohesion: 0.07957957957957958
Nodes (30): metadata, plexMono, viewport, Brand(), ACCENT_GROUP, FIRST_TONE, hasFinePointer(), isGroupActive() (+22 more)

### Community 8 - "앱 패키지 설정"
Cohesion: 0.06060606060606061
Nodes (32): eslint, eslint-config-next, next, dependencies, next, react, react-dom, devDependencies (+24 more)

### Community 9 - "상품 소개와 도입 상담"
Cohesion: 0.10752688172043011
Nodes (23): ASK, metadata, STEPS, FAQ, FEATURES, metadata, STEPS, ALGORITHM_UNITS (+15 more)

### Community 10 - "TypeScript 설정"
Cohesion: 0.06896551724137931
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 11 - "라운지 경제 모델"
Cohesion: 0.08695652173913043
Nodes (23): [그림 2] 라운지 경제 모델 — 이미지 구성안, 경제 도식: 벌다→만들다→시장→쓰고 굴린다, 시장을 가장 크게, 기본 소득을 가장 작게, 현재 주가 하락 없음: 위험·손실 대신 안목 표현, https://altorwealth.com/wp-content/uploads/2024/04/the-money-advice-service-habit-formation-and-learning-in-young-children-may2013.pdf, https://direct.mit.edu/books/book/3134/Lifelong-KindergartenCultivating-Creativity, https://files.eric.ed.gov/fulltext/ED261948.pdf, https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf (+15 more)

### Community 12 - "히어로 영상 합성"
Cohesion: 0.21568627450980393
Nodes (17): draw_cursor(), ease(), fixed_quad(), green_mask(), key_insert(), load_rgba(), order(), overlay() (+9 more)

### Community 13 - "모션 패키지 설정"
Cohesion: 0.13333333333333333
Nodes (14): description, devDependencies, playwright, name, private, scripts, bundle, dev (+6 more)

### Community 14 - "영상 자산 번들링"
Cohesion: 0.13333333333333333
Nodes (12): faces, fontStyle, frag, fragment, full, musicFile, OUT, page (+4 more)

### Community 15 - "Suno 음악 생성"
Cohesion: 0.13333333333333333
Nodes (10): args, DEFAULT_STYLE, failures, model, outDir, resume, style, taskId (+2 more)

### Community 16 - "음악 박자 정렬"
Cohesion: 0.25274725274725274
Nodes (13): beat_grid(), decode(), ffmpeg_bin(), fit_grid(), low_onset(), main(), near_max(), onset_peaks() (+5 more)

### Community 17 - "영상 프레임 렌더링"
Cohesion: 0.16666666666666666
Nodes (10): args, crf, format, FORMATS, music, out, outDir, { port } (+2 more)

### Community 18 - "모션 미리보기 서버"
Cohesion: 0.22727272727272727
Nodes (10): createServer(), here, inside(), REEL, resolveUrl(), ROOT, TYPES, outDir (+2 more)

### Community 19 - "라운지 모델 도식"
Cohesion: 0.19696969696969696
Nodes (7): I, idx(), LoungeModel(), LoungeModelScrub(), Step, Tier, TIERS

### Community 20 - "Next.js 시작 안내"
Cohesion: 0.18181818181818182
Nodes (11): https://github.com/vercel/next.js, https://nextjs.org, https://nextjs.org/docs, https://nextjs.org/docs/app/api-reference/cli/create-next-app, https://nextjs.org/docs/app/building-your-application/deploying, https://nextjs.org/docs/app/building-your-application/optimizing/fonts, https://nextjs.org/learn, https://vercel.com/font (+3 more)

### Community 21 - "ChatGPT 요금제 자료"
Cohesion: 0.2
Nodes (10): https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan, https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-freegopluspro, https://help.openai.com/en/articles/20001063-chatgpt-for-excel-and-google-sheets, https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex, https://help.openai.com/en/articles/20001354-gpt-56-and-gpt-6-pro-in-chatgpt, https://learn.chatgpt.com/docs/models, https://learn.chatgpt.com/docs/pricing, https://openai.com/index/gpt-6-astra/ (+2 more)

### Community 22 - "뉴스 준비 페이지"
Cohesion: 0.3333333333333333
Nodes (4): metadata, metadata, PageStub(), STUB_ROBOTS

### Community 23 - "교육 진화 프로토타입"
Cohesion: 0.4
Nodes (5): src/components/landing/evolve-stage.tsx current story, 11-second scroll-scrubbed timeline, Archived evolution scene prototype, EVOLVE-SCENE-PLAN.md staging plan, Student advances grades while tools restart at beginner level

### Community 24 - "릴 레퍼런스 분석"
Cohesion: 0.5
Nodes (4): 박자 격자와 연속 전환으로 끊김 없는 루프, 렛츠코딩 릴: 브랜드 파랑·파이썬 노랑·224 작품, 레퍼런스 분석 — AI SYNC CLUB · REEL 2026, AI SYNC CLUB REEL 2026: 128 BPM·15초·8씬

## Knowledge Gaps
- **276 isolated node(s):** `eslintConfig`, `name`, `private`, `type`, `description` (+271 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 347 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ButtonLink()` connect `랜딩과 브랜드 페이지` to `상품 소개와 도입 상담`, `블로그와 내비게이션 데이터`, `뉴스 준비 페이지`, `공통 레이아웃과 헤더`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `랜딩 페이지 구성 기획 v2` connect `랜딩 기획과 디자인` to `AI 교육 철학`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `private` to the rest of the system?**
  _276 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `스크롤 장면 타임라인` be split into smaller, more focused modules?**
  _Cohesion score 0.05384615384615385 - nodes in this community are weakly interconnected._
- **Should `랜딩과 브랜드 페이지` be split into smaller, more focused modules?**
  _Cohesion score 0.058001397624039136 - nodes in this community are weakly interconnected._
- **Should `랜딩 기획과 디자인` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Should `블로그와 내비게이션 데이터` be split into smaller, more focused modules?**
  _Cohesion score 0.09988385598141696 - nodes in this community are weakly interconnected._
## Build scope and measurement notes

Code and documents only: 59 code files and 33 documents. Excluded visual analysis of 118 images and transcription of 3 media files. Embedded base64 payloads were not semantically analyzed.

Host semantic token usage was not metered; token values of 0 are tool bookkeeping, not actual zero session usage.

Graph health: 94 raw edges have unresolved endpoints; 22 same-endpoint edges collapse in the undirected graph. The graph is useful but does not preserve every raw relationship. See health.json.
