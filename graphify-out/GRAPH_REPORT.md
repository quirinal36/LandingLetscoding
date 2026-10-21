# Graph Report - LandingLetscoding  (2026-10-22)

## Corpus Check
- Selected scope: 169 files (98 code, 71 documents) · ~137,390 whitespace-delimited words. Original full scan exceeded the large-corpus threshold; user excluded media.

## Summary
- 900 nodes · 1441 edges · 64 communities (49 shown, 14 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- 랜딩·회사 소개 구현
- 블로그·카카오 인증
- 진화 장면 애니메이션
- 캔버스 릴 렌더링
- 회사·Studio 블로그 초안
- 프로젝트 패키지 의존성
- AI 교육 카드뉴스
- 학교 전시 브로셔
- 상담·솔루션 페이지
- TypeScript 컴파일 설정
- 공통 레이아웃·내비게이션
- 교육 블로그 참고 자료
- 릴 제작·폰트 라이선스
- 히어로 영상 합성
- 모션 패키지 실행
- 릴 HTML 번들링
- Suno 음악 생성
- 음악 비트 정렬
- 루캣 경제 교육
- 릴 영상 출력
- 모션 서버·썸네일
- 라운지 모델 시각화
- 디자인·스크롤 모션
- 프로젝트 운영·블로그 안내
- 릴 재생·내보내기
- 랜딩 섹션·히어로 기획
- AI 교육 카드뉴스 출력
- 프로젝트 카드뉴스 출력
- 학교 상세페이지 출력
- ChatGPT 비교 이전 글
- 학교 상세페이지 이전안
- 공개 제품 안내
- 랜딩 카운터 검증
- 저장소·블로그 관리 규칙
- 성장 장면·교육 모델
- 한 달 구성 시안
- 학교 상세페이지 승인안
- 공지·업데이트 안내
- 학교 상세페이지 검증 안내
- 학교 상세페이지 콘텐츠
- Studio 소개 이전 글
- 전시 브로셔 출력
- 브로셔 레이아웃 검사
- 진화 장면 이전 시안
- 전시 브로셔 콘텐츠 검사
- 상세페이지 출력 명세
- 통합 랜딩 검증
- 랜딩 V2 검증
- 라운지 페이지 검증
- 카드뉴스 학원별 빌드
- 폰트 사용 라이선스
- 전시 PDF 제공
- 전시 HTML 제공
- 브로셔 PDF 제공
- 브로셔 HTML 제공
- 인증 요청 프록시
- 교육 사명 선언
- ESLint 설정
- Next.js 설정
- PostCSS 설정
- 진화 이미지 자르기
- 히어로 영상 오버레이
- 블로그 인증 검사

## God Nodes (most connected - your core abstractions)
1. `draw()` - 25 edges
2. `학교 AI 프로젝트 수업` - 20 edges
3. `만들기·공유·성장·기록의 프로젝트 순환` - 18 edges
4. `AI EDU Expo 브로셔 편집·검증 안내` - 17 edges
5. `라운지 10쪽 인쇄 소개서` - 17 edges
6. `compilerOptions` - 16 edges
7. `Project README and blog data connection` - 16 edges
8. `브로셔 최종 구성·검증 지침` - 16 edges
9. `reveal()` - 15 edges
10. `ButtonLink()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `코드·AI 대화·프로젝트 문서·분석 리포트` --semantically_similar_to--> `유해 요청 제한·AI 로그·교사 승인 전 기록 비공개`  [INFERRED] [semantically similar]
  prototypes/lounge-detail/index.html → public/llms.txt
- `Make, play, receive feedback, revise` --semantically_similar_to--> `Improve balloon effects and extend time from peer feedback`  [INFERRED] [semantically similar]
  motion/YOUTUBE.md → prototypes/media/hero-video/edit/editor.html
- `Final recording scene for no-script and reduced-motion users` --semantically_similar_to--> `Reduced motion starts paused at 14.6-second end card`  [INFERRED] [semantically similar]
  docs/GROWTH-SCENE-PLAN.md → motion/reel/index.html
- `주식회사 렛츠코딩` --semantically_similar_to--> `주식회사 렛츠코딩`  [INFERRED] [semantically similar]
  docs/articles/drafts/about-letscoding-company.md → docs/articles/drafts/about-letscoding-company.md
- `렛츠코딩 Studio browser AI coding editor` --semantically_similar_to--> `렛츠코딩 Studio browser AI coding editor`  [INFERRED] [semantically similar]
  docs/articles/drafts/letscoding-studio-launch.md → docs/articles/drafts/letscoding-studio-launch.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Reel preview, video rendering and YouTube publication** — motion_readme_reel_workflow, motion_reel_thumbnail_thumbnail, motion_youtube_youtube_upload [EXTRACTED 1.00]
- **Theory, growth scene and economy expand project learning through peers** — docs_lounge_model_expansion_model, docs_growth_scene_plan_growth_stages, docs_economy_figure_plan_economy_flow [INFERRED 0.85]
- **2026-10-21 company, Studio and Lounge introduction series** — docs_articles_published_publication, docs_articles_drafts_about_letscoding_company_document, docs_articles_drafts_letscoding_studio_launch_document, docs_articles_drafts_what_is_letscoding_lounge_document [EXTRACTED 1.00]
- **에디터·라운지·공동체 수업 연결** — output_ai_edu_expo_index_coding_studio, output_ai_edu_expo_index_letscoding_lounge, output_ai_edu_expo_index_letscoding_village [EXTRACTED 1.00]
- **학생 판단과 기록을 남기는 월별 프로젝트** — output_cardnews_project_class_start_manuscript_student_roles, output_ai_edu_expo_index_project_cycle, output_cardnews_coding_in_ai_era_source_process_records, output_cardnews_coding_in_ai_era_source_student_agency [INFERRED 0.85]
- **작품공유·가상경제·과제관리의 양방향 교육 사이클** — prototypes_lounge_detail_index_v1_sharing, prototypes_lounge_detail_index_v1_economy, prototypes_lounge_detail_index_v1_assignments [EXTRACTED 1.00]
- **작품공유·가상경제·과제관리의 양방향 교육 사이클** — prototypes_lounge_detail_index_sharing, prototypes_lounge_detail_index_economy, prototypes_lounge_detail_index_assignments [EXTRACTED 1.00]

## Communities (64 total, 14 thin omitted)

### Community 0 - "랜딩·회사 소개 구현"
Cohesion: 0.05
Nodes (59): Chapter, CHAPTERS, metadata, Page(), PARAGRAPH, PARAGRAPH_LINES, Photo, metadata (+51 more)

### Community 1 - "블로그·카카오 인증"
Cohesion: 0.07
Nodes (50): offsets, payload, row, loginWithKakao(), logout(), GET(), deletePost(), savePost() (+42 more)

### Community 2 - "진화 장면 애니메이션"
Cohesion: 0.05
Nodes (59): CAPTION_CSS, CAPTIONS, DRONE, EV, EvolveCaptions(), EvolveStage(), hToCq(), k() (+51 more)

### Community 3 - "캔버스 릴 렌더링"
Cohesion: 0.13
Nodes (35): allText(), buffer(), chevron(), draw(), drawEaseWidget(), drawGrid(), drawHUD(), drawTracked() (+27 more)

### Community 4 - "회사·Studio 블로그 초안"
Cohesion: 0.05
Nodes (38): 주식회사 렛츠코딩, Company origin final article, 2019 academy → 2022 award → 2024 Django attempt → 2026 vibe coding, Studio launch final article, 레코 learning assistant, 렛츠코딩 Studio browser AI coding editor, Authorized teachers inspect project files, AI dialogue and work records, Monthly five themes, 35 accumulated themes by October 2026, 193 learning tasks (+30 more)

### Community 5 - "프로젝트 패키지 의존성"
Cohesion: 0.05
Nodes (36): eslint, eslint-config-next, next, dependencies, next, react, react-dom, @supabase/ssr (+28 more)

### Community 6 - "AI 교육 카드뉴스"
Cohesion: 0.20
Nodes (32): 만들기·공유·성장·기록의 프로젝트 순환, 코랄·차콜·Pretendard 1080×1350 카드뉴스, AI 시대 코딩 카드뉴스 제작 지침, 원문 내용·고유명사·인용 유지, 코딩을 배워도 AI가 다 한다면, 그래도 배워야 하는 이유, Future of Education — Philosophy Might Become the Most Valuable Degree in the Age of AI, GPS와 지도 읽기 능력 비유, MacKenzie Price (+24 more)

### Community 7 - "학교 전시 브로셔"
Cohesion: 0.21
Nodes (31): AI 대화·사용 기록 기반 지도, Let’s Coding Studio, AI EDU Expo 학교용 12쪽 브로셔, 렛츠코딩 라운지, 렛츠코딩빌리지 공동체, 가상 화폐 루캣 경제 활동, AI EDU Expo 원본 8쪽 브로셔, 학교 AI 프로젝트 수업 (+23 more)

### Community 8 - "상담·솔루션 페이지"
Cohesion: 0.09
Nodes (23): ASK, metadata, STEPS, FAQ, FEATURES, metadata, STEPS, MONTHS (+15 more)

### Community 9 - "TypeScript 컴파일 설정"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "공통 레이아웃·내비게이션"
Cohesion: 0.10
Nodes (22): metadata, plexMono, viewport, Brand(), ACCENT_GROUP, FIRST_TONE, hasFinePointer(), isGroupActive() (+14 more)

### Community 11 - "교육 블로그 참고 자료"
Cohesion: 0.11
Nodes (21): 챗봇 답 받기와 AI를 활용한 창작은 다르다, https://futureofeducation.substack.com/p/if-we-hand-chatbots-to-every-student, 챗봇에게 답을 받는 것과 AI를 쓰는 것은 다릅니다, https://futureofeducation.substack.com/p/philosophy-might-become-the-most, 코딩을 배워도 AI가 다 한다면, 그래도 배워야 하는 이유, AI가 코드 작성, 학생은 문제·판단·끝까지 만들기를 배움, AI 학교: 학습 효율 외 판단·관계·교사 역할이 필요, https://alpha.school/resources/how-alpha-two-hour-school-day-works/ (+13 more)

### Community 12 - "릴 제작·폰트 라이선스"
Cohesion: 0.12
Nodes (19): ANALYSIS.md reference adaptation guide, 128 BPM, eight bars, fifteen-second loop, Deterministic 60fps canvas rendering, Landscape 16:9 and portrait 9:16 layouts, kie.ai Suno generation and fit_music.py beat alignment, Motion reel build and authoring guide, Reuse site Pretendard font assets, IBM Plex font software (+11 more)

### Community 13 - "히어로 영상 합성"
Cohesion: 0.22
Nodes (17): draw_cursor(), ease(), fixed_quad(), green_mask(), key_insert(), load_rgba(), order(), overlay() (+9 more)

### Community 14 - "모션 패키지 실행"
Cohesion: 0.13
Nodes (14): description, devDependencies, playwright, name, private, scripts, bundle, dev (+6 more)

### Community 15 - "릴 HTML 번들링"
Cohesion: 0.13
Nodes (12): faces, fontStyle, frag, fragment, full, musicFile, OUT, page (+4 more)

### Community 16 - "Suno 음악 생성"
Cohesion: 0.13
Nodes (10): args, DEFAULT_STYLE, failures, model, outDir, resume, style, taskId (+2 more)

### Community 17 - "음악 비트 정렬"
Cohesion: 0.25
Nodes (13): beat_grid(), decode(), ffmpeg_bin(), fit_grid(), low_onset(), main(), near_max(), onset_peaks() (+5 more)

### Community 18 - "루캣 경제 교육"
Cohesion: 0.24
Nodes (12): Automatic stock listing, 70% sticker creator share, 20% game settlement fee, Lounge economy figure plan, Earn → Produce → Market → Spend and invest, Largest economy card is the peer market, Avoid claiming money habits are fixed at age seven, Huber, Sloof & van Praag 2014 BizWorld field experiment, Deci, Koestner & Ryan 1999 extrinsic rewards meta-analysis, Lounge economy research (+4 more)

### Community 19 - "릴 영상 출력"
Cohesion: 0.17
Nodes (10): args, crf, format, FORMATS, music, out, outDir, { port } (+2 more)

### Community 20 - "모션 서버·썸네일"
Cohesion: 0.23
Nodes (10): createServer(), here, inside(), REEL, resolveUrl(), ROOT, TYPES, outDir (+2 more)

### Community 21 - "라운지 모델 시각화"
Cohesion: 0.20
Nodes (7): I, idx(), LoungeModel(), LoungeModelScrub(), Step, Tier, TIERS

### Community 22 - "디자인·스크롤 모션"
Cohesion: 0.20
Nodes (11): 44px targets, focus-visible and reduced-motion support, CardRiver reduced-motion exception, Let’s Coding design system, Self-hosted Pretendard variable font, Scroll position drives --p scene playback, Surface brightness, hairlines and translucent blur, GrowthStage: GROWTH_T=20.2; scroll length 8.8, One shared growth graph replaces two static comparisons (+3 more)

### Community 23 - "프로젝트 운영·블로그 안내"
Cohesion: 0.18
Nodes (11): Evolution scene plan, Three beginner kits followed by a graduation cap, EvolveStage, EvolveCaptions and EVOLVE_T=11, Initial landing requirements, About, solutions, seminar inquiry and news navigation, Text, image and prompt blog blocks, Modification timestamp conflict protection, Request-time blog list, detail, RSS and sitemap queries (+3 more)

### Community 24 - "릴 재생·내보내기"
Cohesion: 0.18
Nodes (11): Final recording scene for no-script and reduced-motion users, 224 works, 45 authors, 8689 views, 419 comments, Eight one-bar scenes, 32 beats and 60fps, Let’s Coding text, brand blue/yellow, array indices and hypotrochoid curve, AI SYNC CLUB reference reel analysis, AI SYNC CLUB REEL 2026: 15-second 128 BPM eight-scene reference, Audio playback clock drives reel time when sound is enabled, Let’s Coding reel preview and export page (+3 more)

### Community 25 - "랜딩 섹션·히어로 기획"
Cohesion: 0.18
Nodes (11): Hide Nana author name and player nicknames; do not label Ten Pang as student-made, Chroma-key device screens with actual game capture and edited Korean text, Hero loop video plan, Make → Send → Play → Feedback → Make again; 12-second silent loop, Ten Pang by Nana: number balloons summing to ten, Landing page plan v2, Rolling counters preserve measured totals, Landing sections 1–13 and code-comment numbering (+3 more)

### Community 26 - "AI 교육 카드뉴스 출력"
Cohesion: 0.18
Nodes (9): { chromium }, here, htmlPath, JSZip, outDir, pngDir, problems, require (+1 more)

### Community 27 - "프로젝트 카드뉴스 출력"
Cohesion: 0.18
Nodes (9): { chromium }, here, htmlPath, JSZip, outDir, pngDir, problems, require (+1 more)

### Community 28 - "학교 상세페이지 출력"
Cohesion: 0.20
Nodes (10): assert, { chromium }, fs, inline(), mime, output, parts, path (+2 more)

### Community 29 - "ChatGPT 비교 이전 글"
Cohesion: 0.20
Nodes (10): https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan, https://help.openai.com/en/articles/12642688-using-credits-for-flexible-usage-in-chatgpt-freegopluspro, https://help.openai.com/en/articles/20001063-chatgpt-for-excel-and-google-sheets, https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex, https://help.openai.com/en/articles/20001354-gpt-56-and-gpt-6-pro-in-chatgpt, https://learn.chatgpt.com/docs/models, https://learn.chatgpt.com/docs/pricing, https://openai.com/index/gpt-6-astra/ (+2 more)

### Community 30 - "학교 상세페이지 이전안"
Cohesion: 0.31
Nodes (10): 주제·진행 상황·완료 보고 과제관리, 기획·문제 정의·AI 활용·생각 근육·공감 근육·회복탄력성, 학교를 위한 AI 프로젝트 교육 상세페이지 이전 버전, 작품 조회·과제 완료·루캣 투자, 매달 다섯 개의 추천 과제, 고르고 만들고 공유하고 설명하는 프로젝트, 코드·AI 대화·프로젝트 문서·분석 리포트, 작품공유와 친구의 피드백 (+2 more)

### Community 31 - "공개 제품 안내"
Cohesion: 0.20
Nodes (10): 이형구 원장의 AI 교육·코딩 블로그, 주식회사 렛츠코딩, 카카오톡·contact@letscoding.kr·010-5679-0072, 렛츠코딩 공개 AI 참조 문서, 렛츠코딩 라운지, AI 튜터 나나: 힌트·리뷰·에러·개념 설명, 2026-09-28 집계: 공개작품 224·작성자 45·조회 8689·댓글 419, 렛츠코딩 파이썬 자동 채점 학습 플랫폼 (+2 more)

### Community 33 - "저장소·블로그 관리 규칙"
Cohesion: 0.22
Nodes (8): getUser + landing.can_manage_blog + RLS, landing.blog_posts is the live blog data source, Central Supabase migrations in letscoding_lounge, Repository agent instructions, Hermes v0.21.0: Bot Mode·기억하는 cron·실행 중 조향, https://github.com/NousResearch/hermes-agent, https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31, Hermes Agent v0.21.0은 무엇이 달라졌나 — 에이전트 하나에서 에이전트 팀으로

### Community 34 - "성장 장면·교육 모델"
Cohesion: 0.36
Nodes (9): Cropped WebP layers positioned by stage percentages, Growth scene plan, Make → Share → Grow → Record paper-cutout scenes, Lave & Wenger community of practice and legitimate peripheral participation, Papert constructionism, Lounge expansion educational model, Lounge expansion model: individual → peers → community → record, Development journals and portfolios feed the next project (+1 more)

### Community 35 - "한 달 구성 시안"
Cohesion: 0.22
Nodes (9): 나 → 우리 → 공동체 → 기록, 게임 iframe의 CSP frame-ancestors 확인 필요, 루캣 가상경제, 한 달 구성 정적 랜딩 시안, 매달 다섯 개의 새 과제, 파란 점선과 원장님 학원의 빈 칸, 4주 무료 파일럿 상담, 2026-08-24 운영 실측: 작품 196·학생 44·조회 6093·댓글 342 (+1 more)

### Community 36 - "학교 상세페이지 승인안"
Cohesion: 0.22
Nodes (9): 2026-10-11 학교 대상 세로 상세페이지 승인 방향, 나나쌤 작품·기능 검증용 에디터 프로젝트, B형 비즈니스 제안서 디자인 확장, 검정·금색 히어로 → 무한대 마크 → 종이 팝업북, infinity-window.tsx 경로·growth-stage.tsx 레이어 재사용, 학교 교사 대상·가격·4주 무료·영업 문구 제외, 네 개의 종이 팝업북 장면, 만들고·공유하기·성장하고·기록하기 (+1 more)

### Community 37 - "공지·업데이트 안내"
Cohesion: 0.33
Nodes (4): metadata, metadata, PageStub(), STUB_ROBOTS

### Community 38 - "학교 상세페이지 검증 안내"
Cohesion: 0.25
Nodes (8): 동작 줄이기·미지원 브라우저에서는 완성 장면 표시, index.html 편집 원본과 index-v1.html 이전 버전, export.cjs의 320~1440px 7개 화면·로딩·가로 넘침 검사, 독립 실행 HTML·1200px 전체 PNG·11개 섹션 PNG, 단일 HTML 재배포 시 Pretendard OFL.txt 동봉, 학교용 상세페이지 제작·검증 안내, 브로셔 1~9쪽·랜딩 1~6번으로 학교용 콘텐츠 재구성, PNG는 종이 애니메이션 네 장면 모두 펼침

### Community 39 - "학교 상세페이지 콘텐츠"
Cohesion: 0.43
Nodes (8): 주제·진행 상황·완료 보고 과제관리, 학교를 위한 AI 프로젝트 교육 상세페이지, 작품 조회·과제 완료·루캣 투자, 매달 다섯 개의 추천 과제, 코드·AI 대화·프로젝트 문서·분석 리포트, 작품공유와 친구의 피드백, 렛츠코딩 스튜디오: AI 제작·미리보기·배포, 작품 공개·링크로만·비공개 및 기관 내 개발일지

### Community 40 - "Studio 소개 이전 글"
Cohesion: 0.29
Nodes (7): 기획·문제 정의·AI 활용·생각 근육·공감 근육·회복탄력성, 유해 요청 제한·AI 로그·교사 승인 전 기록 비공개, 서버 예산 예약·실사용 정산·일별 및 이용 기간 한도, 코드를 쓰지 않고 질문으로 배우는 학습 도우미 LECO, 학생 기본 Claude Haiku 5.5·클래스별 허용 모델 정책, AI 제목·주소·설명 검수 및 월 신규 작품 3개 한도, 렛츠코딩 스튜디오

### Community 41 - "전시 브로셔 출력"
Cohesion: 0.33
Nodes (5): assert, { chromium }, fs, path, { pathToFileURL }

### Community 42 - "브로셔 레이아웃 검사"
Cohesion: 0.33
Nodes (5): assert, { chromium }, fs, path, { pathToFileURL }

### Community 43 - "진화 장면 이전 시안"
Cohesion: 0.40
Nodes (5): src/components/landing/evolve-stage.tsx current story, 11-second scroll-scrubbed timeline, Archived evolution scene prototype, EVOLVE-SCENE-PLAN.md staging plan, Student advances grades while tools restart at beginner level

### Community 44 - "전시 브로셔 콘텐츠 검사"
Cohesion: 0.50
Nodes (3): coreContent, ids, paragraphs

### Community 45 - "상세페이지 출력 명세"
Cohesion: 0.50
Nodes (3): height, sections, width

### Community 46 - "통합 랜딩 검증"
Cohesion: 0.50
Nodes (3): assert, { chromium }, { mkdir }

### Community 47 - "랜딩 V2 검증"
Cohesion: 0.50
Nodes (3): assert, { chromium }, { mkdir }

### Community 48 - "라운지 페이지 검증"
Cohesion: 0.50
Nodes (3): assert, { chromium }, { mkdir }

### Community 50 - "폰트 사용 라이선스"
Cohesion: 1.00
Nodes (3): SIL Open Font License 1.1, Pretendard font software, SIL Open Font License Version 1.1

## Knowledge Gaps
- **337 isolated node(s):** `eslintConfig`, `name`, `private`, `type`, `description` (+332 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 429 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ButtonLink()` connect `랜딩·회사 소개 구현` to `상담·솔루션 페이지`, `블로그·카카오 인증`, `공지·업데이트 안내`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `Project README and blog data connection` connect `프로젝트 운영·블로그 안내` to `저장소·블로그 관리 규칙`, `성장 장면·교육 모델`, `루캣 경제 교육`, `디자인·스크롤 모션`, `랜딩 섹션·히어로 기획`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `COMPANY` connect `블로그·카카오 인증` to `랜딩·회사 소개 구현`, `공통 레이아웃·내비게이션`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `private` to the rest of the system?**
  _337 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `랜딩·회사 소개 구현` be split into smaller, more focused modules?**
  _Cohesion score 0.05157894736842105 - nodes in this community are weakly interconnected._
- **Should `블로그·카카오 인증` be split into smaller, more focused modules?**
  _Cohesion score 0.07155399473222125 - nodes in this community are weakly interconnected._
- **Should `진화 장면 애니메이션` be split into smaller, more focused modules?**
  _Cohesion score 0.05384615384615385 - nodes in this community are weakly interconnected._
## Build scope and token accounting

2026-10-22: 98 code files and 71 documents; images, PDF, video and audio excluded by user choice. Embedded base64 is omitted from semantic analysis. AST generated no nodes for 12 JSON configuration/data files. Documents include plans, drafts and old material; verify actual implementation before changes.

Semantic extraction used the host session; exact token use is not metered. Reported 0 tokens means unavailable accounting, not zero actual usage.

## Graph health warnings

Raw extraction has 169 dangling-endpoint edges, including external import references and four unresolved cached document targets. There are 21 same-endpoint edge collapses in the default simple graph; distinct relation/location details can be lost. Missing endpoints and self-loops: 0. See `health.json`.

Benchmark tool estimates 30.5× fewer tokens per query (~1,966 tokens/query) using its 45,000-word baseline; this is a heuristic, not measured session usage or the selected corpus word count.
