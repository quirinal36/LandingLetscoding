export type NavLink = {
  label: string;
  href: string;
  /** 레이어 패널에서 항목을 한 줄로 설명한다. 없으면 라벨만 나온다. */
  note?: string;
};

export type NavGroup = {
  label: string;
  /** 레이어 번호. 키보드의 레이어처럼 1부터 센다. */
  layer: number;
  items: NavLink[];
  /** 전환 동선인 그룹은 황동 키로 올라간다. */
  accent?: boolean;
};

export const NAV: NavGroup[] = [
  {
    label: "소개",
    layer: 1,
    items: [
      { label: "회사 소개", href: "/about", note: "렛츠코딩이 하는 일" },
      { label: "교육 철학", href: "/about/philosophy", note: "우리가 코딩을 가르치는 방식" },
    ],
  },
  {
    label: "솔루션",
    layer: 2,
    items: [
      { label: "렛츠코딩 라운지", href: "/solutions/lounge", note: "학습 공간과 운영 도구" },
      { label: "렛츠코딩 파이썬", href: "/solutions/python", note: "파이썬 커리큘럼" },
    ],
  },
  {
    label: "온라인 설명회",
    layer: 3,
    accent: true,
    items: [{ label: "도입문의", href: "/seminar/inquiry", note: "기관 도입 상담 신청" }],
  },
  {
    label: "소식",
    layer: 4,
    items: [
      { label: "블로그", href: "/news/blog" },
      { label: "업데이트 소식", href: "/news/updates" },
      { label: "공지사항", href: "/news/notice" },
    ],
  },
];

export const COMPANY = {
  name: "주식회사 렛츠코딩",
  short: "렛츠코딩",
  latin: "LETSCODING",
} as const;
