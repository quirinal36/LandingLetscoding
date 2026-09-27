# 렛츠코딩 모션그래픽 릴

15초 · 8씬 · 128 BPM 루프 릴. 브라우저 캔버스로 그리고, 같은 코드로 60fps MP4를 뽑는다.
어떤 레퍼런스를 어떻게 옮겼는지는 [ANALYSIS.md](./ANALYSIS.md)에 있다.

## 빠르게 쓰기

```bash
cd motion
npm install                      # playwright 하나만 받는다
npm run dev                      # http://localhost:4173 미리보기

npx playwright install chromium  # 처음 한 번 (MP4 렌더용 브라우저)
npm run render                   # out/letscoding-reel-16x9.mp4  1920×1080
npm run render:vertical          # out/letscoding-reel-9x16.mp4  1080×1920 (릴스·쇼츠)
npm run bundle                   # out/letscoding-reel.html      파일 하나, 오프라인 재생
```

MP4 렌더에는 ffmpeg가 필요하다(`brew install ffmpeg`, `winget install ffmpeg`).
PATH에 없으면 `FFMPEG=/경로/ffmpeg npm run render`.
레이아웃은 가로(16:9)와 세로(9:16) 두 구도만 짜여 있다. 정사각형이 필요하면 씬마다 구도를 따로 잡아야 한다.

렌더는 실시간 녹화가 아니다. 헤드리스 크로미움에서 프레임 번호마다 `render(i / 60)`을 불러
PNG를 ffmpeg로 넘기므로 컴퓨터가 느려도 프레임이 빠지지 않는다. 출력은 H.264 High, BT.709.

## 구조

```
motion/
├─ reel/
│  ├─ reel.js        엔진 + 8개 씬. 맨 위에 COPY(문구) · C(색) · FONT(글꼴) · BPM
│  ├─ index.html     플레이어(재생·정지, 스크럽, 16:9 ↔ 9:16). ?export 로 열면 캔버스만
│  ├─ plex.css       IBM Plex Mono · Serif Italic 선언
│  ├─ plex/          IBM Plex woff2(latin) + OFL 라이선스
│  └─ music.mp3      배경음악 15초(있을 때만. fit_music.py가 만든다)
├─ scripts/
│  ├─ serve.mjs      미리보기 서버 (의존성 없음)
│  ├─ render.mjs     MP4 렌더러 (music.mp3가 있으면 AAC로 넣는다)
│  ├─ bundle.mjs     단일 HTML 번들러
│  ├─ suno.mjs       kie.ai Suno API로 배경음악 생성
│  └─ fit_music.py   생성된 곡을 128 BPM 8마디(15초)로 맞춰 자른다
├─ ANALYSIS.md       레퍼런스 분석
└─ out/              결과물 (git에 올리지 않음)
```

Pretendard는 사이트가 쓰는 파일(`public/fonts/pretendard`, `src/app/fonts.css`)을 그대로 쓴다.
미리보기 서버가 `/fonts.css`와 `/fonts/*`를 그쪽으로 연결한다.

## 자주 하는 수정

| 바꾸고 싶은 것 | 고칠 곳 |
|---|---|
| 문구 | `reel.js`의 `COPY`. 글자 폭을 재서 크기를 맞추므로 길이가 달라져도 넘치지 않는다(길면 작아진다) |
| 카운터 숫자 | `COPY.s6.value` · `.ko` · `.note`(집계 기간·출처 한 줄, 비우면 안 나온다) |
| 색 | `reel.js`의 `C` |
| HUD 문구 | `COPY.hudLeft`, `COPY.hudRight`, 각 씬의 `label` |
| 씬 순서 | `SCENES` 배열 |

## 씬을 새로 만들 때 지킬 것

각 씬은 `{ label, tone(lt), draw(ctx, f, lt) }` 모양이다. `lt`는 씬 안의 시간(0–1.875초),
`f`는 `{ W, H, u, portrait, diag }`.

1. **그림은 `lt`만 보고 그린다.** 지난 프레임 상태를 들고 다니지 않는다. 그래야 어느 프레임이든
   바로 그릴 수 있고, 스크럽과 MP4 렌더가 정확하다.
2. **난수는 `hash(n)` · `rng(seed)`만.** `Math.random()`은 프레임마다 값이 달라 화면이 떨린다.
3. **크기는 `u`(짧은 변 ÷ 1080) 단위, 위치는 `W` · `H` 비율.** 그래야 16:9와 9:16에서 모두 맞는다.
   구도가 달라야 하면 `f.portrait`로 가른다.
4. **박자에 맞춘다.** `BEAT`(0.469초) · `BEAT / 2` · `BEAT / 4` 단위로 등장시키면 음악 없이도 리듬이 생긴다.
5. **나가는 연출은 다음 씬의 첫 프레임으로 끝낸다.** 원이 커져 다음 바탕이 되거나, 선이 이어지거나.
6. `tone(lt)`는 그 순간 배경이 밝으면 `'k'`(HUD 검정), 어두우면 `'w'`를 돌려준다.

## 배경음악 (kie.ai · Suno)

컷이 128 BPM 격자에 맞춰져 있어서, 128 BPM 곡의 마디 첫 박을 0초에 두면 씬 전환이 모두 다운비트에 떨어진다.
128 BPM에서 8마디가 정확히 15초 = 릴 한 바퀴다.

```bash
# 1) 키 — 저장소 루트 .env.local (.env*는 git에 안 올라간다)
echo "KIE_API_KEY=..." >> ../.env.local

# 2) 생성 — 수노가 두 변주를 준다 → out/music/<taskId>-1.mp3, -2.mp3
node scripts/suno.mjs
node scripts/suno.mjs --style "..." --title "..." --model V5   # 바꿔 보고 싶을 때
node scripts/suno.mjs --task <taskId>                          # 만든 곡을 다시 받기만(크레딧 안 씀)

# 3) 맞추기 — 템포를 재서 128로 맞추고, 에너지가 가장 크게 올라오는 8마디를 골라 첫 박을 0초에
pip install librosa soundfile
python3 scripts/fit_music.py out/music/<taskId>-1.mp3          # → reel/music.mp3, reel/music.json
python3 scripts/fit_music.py out/music/<taskId>-1.mp3 --start 42.5   # 시작점을 직접 고를 때

# 4) 뽑기 — MP4에 AAC로 들어가고, 플레이어·단일 HTML에는 '소리 켜기' 버튼이 생긴다
npm run render && npm run render:vertical && npm run bundle
npm run render -- --silent   # 무음으로 뽑을 때
```

- 기본 스타일: `upbeat future house, 128 BPM, four-on-the-floor kick, … instrumental, no vocals` (`scripts/suno.mjs` 맨 위)
- `reel/music.json`에 잰 BPM, 늘이고 줄인 비율, 원곡에서 자른 위치, 박 오차가 남는다
- 클라우드 세션에서 돌릴 때는 환경의 네트워크 설정에서 세 도메인을 허용해야 한다:
  `api.kie.ai`(생성 요청), `tempfile.aiquickdraw.com`(완성 MP3), `audiostream.kie.ai`(스트리밍 사본, 예비).
  프록시 뒤에서는 `NODE_USE_ENV_PROXY=1 node scripts/suno.mjs`
- 광고에 쓰기 전에 kie.ai·Suno의 상업적 이용 조건을 확인할 것
- 릴스처럼 앱에서 음원을 붙인다면 `--silent`로 뽑아 올리고 앱에서 고르면 된다

## 글꼴 라이선스

- Pretendard — SIL OFL 1.1 (`public/fonts/pretendard/OFL.txt`)
- IBM Plex Mono · IBM Plex Serif — SIL OFL 1.1 (`reel/plex/OFL-IBM-Plex.txt`)

둘 다 상업적 사용, 영상에 넣어 배포, 웹 임베딩이 허용된다.
