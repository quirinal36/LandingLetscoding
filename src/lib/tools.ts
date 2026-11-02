/* 「영상 제작을 위한 AI 활용」 수업 도구 안내 시리즈. 글 본문은 블로그(landing.blog_posts)에 있고,
   여기에는 /tools 허브가 보여 줄 순서와 요약만 둔다. 기획: docs/TOOL-GUIDE-PLAN.md */

export type Tool = {
  slug: string;
  name: string;
  /** 처음 접하는 사람용 한 줄 정의 */
  summary: string;
  /** 수업 시간표에서 처음 나오는 때 */
  when: string;
  /** 먼저 설치해야 하는 도구의 slug */
  requires: string[];
  /** 설치 확인 명령(PowerShell). 설치하지 않는 서비스는 비운다. */
  check?: string;
};

export const TOOLS_TITLE = "AI 영상 제작 수업 도구 안내";
export const TOOLS_DESCRIPTION =
  "Node.js, FFmpeg, Git, Hyperframes, Aside, Python, Whisper, Concat, kie.ai를 처음 쓰는 분을 위해 윈도우 기준으로 설치와 사용법을 한 편씩 정리했습니다.";

/** 수업 시간표 순서. 선행 도구가 항상 앞에 온다. */
export const TOOLS: Tool[] = [
  { slug: "tools-nodejs", name: "Node.js", summary: "내 컴퓨터에서 자바스크립트 프로그램을 실행하는 엔진", when: "00:20 설치", requires: [], check: "node -v" },
  { slug: "tools-ffmpeg", name: "FFmpeg", summary: "영상·음성 파일을 자르고 붙이고 변환하는 도구", when: "00:20 설치", requires: [], check: "ffmpeg -version" },
  { slug: "tools-git", name: "Git", summary: "파일 변경 이력을 저장하고 공개된 프로그램을 내려받는 도구", when: "00:20 설치", requires: [], check: "git --version" },
  { slug: "tools-hyperframes", name: "Hyperframes", summary: "HTML로 만든 장면을 시간 흐름에 맞춰 MP4 영상으로 만드는 도구", when: "01:10 모션그래픽 · 02:10 영상 제작", requires: ["tools-nodejs", "tools-ffmpeg"], check: "npx hyperframes doctor" },
  { slug: "tools-aside", name: "Aside 브라우저", summary: "사람과 AI가 함께 쓰는 브라우저", when: "00:40 설정", requires: [] },
  { slug: "tools-python", name: "Python", summary: "Whisper 같은 AI 프로그램을 실행하는 언어와 실행 환경", when: "01:40 Whisper 설치 전", requires: [], check: "py --version" },
  { slug: "tools-whisper", name: "Whisper", summary: "음성을 글과 시간표(자막)로 바꾸는 도구", when: "01:50 음성 전사", requires: ["tools-python", "tools-ffmpeg"], check: "whisper --help" },
  { slug: "tools-concat", name: "Concat", summary: "AI에게 편집을 맡길 수 있는 무료 오픈소스 영상 편집기", when: "02:40 설치 · 03:00 편집", requires: [] },
  { slug: "tools-kie-ai", name: "kie.ai", summary: "여러 영상·이미지 생성 AI를 API 하나로 쓰게 해 주는 서비스", when: "03:20 광고 영상", requires: [] },
];

export function toolName(slug: string) {
  return TOOLS.find((t) => t.slug === slug)?.name ?? slug;
}
