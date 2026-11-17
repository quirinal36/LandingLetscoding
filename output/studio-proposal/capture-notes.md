# letscoding-studio 제안서용 실제 화면 캡처

## 수집 범위와 환경
- 확인일: 2026-11-06, Asia/Seoul. 실제 운영 사이트의 로그인된 브라우저에서 캡처.
- 확인된 Studio 주소: https://lounge.letscoding.kr/studio
- 최초 열린 탭: 운영 Studio와 https://lounge.letscoding.kr/works 두 개. studio.letscoding.kr 탭은 없었으며 해당 도메인의 접속·리디렉션은 이번 작업에서 검증하지 않음.
- Aside 스킬을 읽고 aside.sessions.current()로 세션 맥락을 확인했으며 사용자 메모리도 조회. 메모리의 과거 나나쌤 작품과 달리 현재 화면의 선택 계정은 leco (나).
- 운영/체험판 구분: 7장 모두 lounge.letscoding.kr 운영 화면. 과거 기록의 localhost:8791 및 letscoding-studio-trial.turboguy36.workers.dev 화면은 사용하지 않음.
- 전체 PNG는 1920×1080 뷰포트의 원본 화면. 합성·리터칭·DOM 변조·마스킹 없음.
- Studio 대표 작품: 「하늘을 나는 자동차」, 현재 선택 계정 leco. 편집기 접근성 이름에서 확인한 프로젝트 ID: 26dd5578-a913-4771-8c22-df315d832bca. Studio URL은 작품을 열어도 /studio 그대로이므로 동일 작품 재접근 시 목록에서 제목으로 선택해야 함.
- 읽기 전용 범위: 작품 열기, 파일 탭/미리보기 전환, 기존 AI 대화 열람, 프롬프트 목록 펼치기, 게임 시작, 공개 목록 필터 및 상세 링크 탐색만 수행. 생성·코드/이름 수정·저장 명령·삭제·복제·게시·AI 메시지 전송·댓글/좋아요·투자/거래는 하지 않음. 코드 편집기에 입력하지 않음.
- 종료 확인: Studio 상태는 「스튜디오에 저장됨」으로 표시. 이는 기존 UI 상태 관찰이며 이번 작업에서 자동저장 동작이나 데이터 영속성을 테스트한 것은 아님. 서버 데이터 전후 비교·감사는 수행하지 않음. 조회에 따른 서버의 자동 통계 집계 여부는 미검증.
- 개인정보 최소화: 본인 leco 작품을 선택하고 기관/클래스/멤버 드롭다운을 닫은 채 촬영. 공개 목록/상세에는 공개 닉네임과 활동 지표가 보임. 외부 제안서 배포 시 계정·기관명 및 타인 공개 작품의 활용 범위를 별도 검토 권장.

## 01. 운영 Studio 작품 목록
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/01-production-project-list.png
- URL: https://lounge.letscoding.kr/studio
- 작품/출처: leco의 스튜디오, 로그인된 운영 계정의 기존 작품 목록.
- 직접 확인한 기능: 작품 카드와 썸네일, 웹/스토리 유형 표시, 라운지 게시 배지, 수정 시각·용량, 저장공간 표시, 새 작품 유형 선택 UI, 기관·클래스·멤버 선택 UI.
- 슬라이드 메시지: “작품을 한곳에서 관리하고, 만들던 프로젝트를 이어갑니다.”
- 주의사항: 목록의 게시 배지는 상태 표시만 확인. 만들기·이름 변경·복제·삭제 기능은 실행하지 않음. 작품 날짜·용량은 캡처 시점 값.

## 02. 대표 작품 편집기 전체
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/02-production-editor-overview.png
- URL: https://lounge.letscoding.kr/studio
- 작품/출처: 「하늘을 나는 자동차」, leco의 기존 웹 작품.
- 직접 확인한 기능: 왼쪽 파일 탐색기, 중앙 실행 미리보기, 오른쪽 LECO AI 채팅의 3열 구성. index.html·PROJECT.md·script.js·style.css 및 images 폴더. 작품 시작 화면과 기존 AI 대화, 저장됨 표시.
- 슬라이드 메시지: “파일, 실행 결과, AI 도우미를 하나의 작업 공간에서 연결합니다.”
- 주의사항: 이 장은 중앙에 미리보기가 열린 전체 작업 공간으로, 코드 본문은 03번에서 확인 가능. AI 대화는 기존 내역이며 이번 작업에서 생성한 응답이 아님. 라운지 변경사항 적용 버튼은 누르지 않음.

## 03. 실제 JavaScript 코드 편집 화면
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/03-production-code-editor.png
- URL: https://lounge.letscoding.kr/studio
- 작품/출처: 「하늘을 나는 자동차」의 script.js.
- 직접 확인한 기능: 파일 트리에서 script.js를 열어 실제 소스와 줄 번호·구문 강조, script.js/미리보기 탭, JavaScript 상태 표시, 기존 LECO 대화가 나란히 표시됨.
- 슬라이드 메시지: “결과물뿐 아니라 실제 코드를 읽고 이해하는 제작 환경입니다.”
- 주의사항: 코드 열람만 수행. 코드 정리, 입력, 저장, 디버깅은 실행하지 않았으므로 편집·저장 기능의 성공 검증 자료로 해석하지 말 것.

## 04. LECO AI 패널과 프롬프트 목록
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/04-production-leco-panel.png
- URL: https://lounge.letscoding.kr/studio
- 작품/출처: 「하늘을 나는 자동차」의 기존 LECO 대화 「안녕」.
- 직접 확인한 기능: 프로젝트 제목을 언급하는 기존 LECO 답변, 메시지 입력창, AI 모델 선택 UI, 사용량 버튼, 프롬프트 목록. 목록에는 로그인 연동·랭킹·개발일지·외부 API·썸네일·결제모듈 관련 안내 문구가 표시됨.
- 슬라이드 메시지: “작품 맥락을 함께 보며 AI에게 질문할 수 있는 작업 패널을 제공합니다.”
- 주의사항: 프롬프트 메뉴만 펼침. 항목 선택·메시지 입력·전송·새 대화·대화 삭제·모델 변경은 하지 않음. 프롬프트에 쓰인 외부 연동이나 결제 기능의 구현 성공, AI 응답 품질·성능을 검증한 자료는 아님.

## 05. 실제 실행 미리보기
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/05-production-live-preview.png
- URL: https://lounge.letscoding.kr/studio
- 작품/출처: 「하늘을 나는 자동차」의 Studio 내부 실행 미리보기.
- 직접 확인한 기능: 기존 작품의 「시작하기」를 클릭한 후 게임 장면으로 전환. 막힌 도로→이륙→바다 위 비행→섬 착륙→도착 단계 표시, 압축 기체 게이지, 대사 및 스페이스 조작 안내, 소리 버튼이 나타남. Studio 콘솔 UI는 0 오류로 표시.
- 슬라이드 메시지: “코드가 실제로 움직이는 결과로 이어지는 모습을 같은 화면에서 확인합니다.”
- 주의사항: 시작 직후의 실제 런타임 화면. 게임 완주·점수 저장·랭킹 등록·실기기/모바일 동작·오류 전반은 검증하지 않음. 작품 데이터 편집이 아닌 실행 화면의 일시적 상태 전환만 수행.

## 06. 공개 Studio 작품 목록
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/06-production-public-gallery.png
- URL: https://lounge.letscoding.kr/works?studio=1
- 작품/출처: 렛츠코딩 라운지 공개 작품 목록. Studio 필터가 체크된 상태.
- 직접 확인한 기능: Studio 제작 작품 필터, 썸네일·작품명·작성자 닉네임·Studio 배지, 카테고리·정렬·기기 필터 UI, 추천 과제 영역.
- 슬라이드 메시지: “Studio에서 만든 작품을 라운지에서 발견하고 함께 살펴봅니다.”
- 주의사항: 공개 작품은 여러 제작자의 결과물이며 모두 leco 또는 특정 수업의 결과물로 표현하면 안 됨. 광고·활동 지표·추천 과제는 캡처 시점 정보. 필터 적용만 수행했고 과제 시작은 누르지 않음.

## 07. 공개 작품 상세와 공유 진입점
- 파일: /Users/letscoding/Documents/workspace/github/LandingLetscoding/output/studio-proposal/screenshots/07-production-public-work-detail.png
- URL: https://lounge.letscoding.kr/works/peach/database-practice
- 작품/출처: 「반응속도 테스트」, 공개 작성자 닉네임 「황도복숭아」. 02~05번의 「하늘을 나는 자동차」와는 다른 작품.
- 접근 근거: 06번 목록의 「반응속도 테스트」 카드에서 실제 href /works/peach/database-practice를 읽고 해당 링크를 클릭함. 목록의 Studio 배지와 상세의 「스튜디오에서 편집」 링크를 확인.
- 직접 확인한 기능: 작품 제목·작성자·썸네일·소개, Play 링크, 공유 버튼, 개발 보고서 링크, 개발자 공지, 갤러리·랭킹·댓글 영역. 로그인 권한에 따른 수정/분석 등 관리 UI도 표시됨.
- 슬라이드 메시지: “공개 작품 페이지에서 실행과 공유, 작품 소개와 피드백이 이어집니다.”
- 주의사항: Play·공유·좋아요·댓글·수정·분석·투자 기능은 실행하지 않음. 비로그인 공개 접근 권한은 별도 확인하지 않았으므로 이 캡처를 익명 방문자와 완전히 동일한 화면이라고 주장하면 안 됨. 화면에 노출된 공개 닉네임·지표는 캡처 시점 값.

## 공통 주의사항 및 인계
- 「하늘을 나는 자동차」는 Studio 목록에서 「라운지 게시」로 표시됐지만 같은 제목의 공개 검색은 결과 없음으로 표시됐다. 이 불일치는 추가 추적하지 않았고 원인은 미확인. 07번은 다른 작품의 공개 상세임을 슬라이드에서도 명시할 것.
- 편집기 접근 제한이나 로그인 장애는 없었으며 사용자 추가 로그인은 필요하지 않았음.
- 권장 활용 순서: 01 작품 관리 → 02 통합 작업 공간 → 03 코드 읽기 → 04 AI 지원 UI → 05 실행 결과 → 06 공개 작품 탐색 → 07 공유/피드백 진입점.
- 요청된 역할에 따라 실제 브라우저 탐색·화면 캡처·관찰 노트만 수행했으며 슬라이드 파일은 생성하지 않음.
- 브라우저 스크린샷 도구가 세션 밖 직접 저장을 거부해 세션 내부 임시 PNG로 저장한 뒤 요청 폴더에 복사. 02~07번은 fs.copyFile, 01번 최초 복사는 파일 복사 명령을 사용. 세션 내부 백업: /Users/letscoding/.aside/u/0/sessions/2026-11-06_NUiSMUOEmRACDykz/tmp/screenshots
