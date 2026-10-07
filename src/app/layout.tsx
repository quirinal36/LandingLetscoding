import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { COMPANY } from "@/lib/nav";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "AI가 코드를 쓰는 시대, 코딩 수업은 무엇을 가르쳐야 할까요. 렛츠코딩은 학교·학원 등 다양한 교육 현장에서 활용할 수 있는 커리큘럼과 수업 운영 도구를 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  alternates: { canonical: "./" },
  title: {
    default: `${COMPANY.name} — 학교·학원 등 교육 현장을 위한 AI 시대 커리큘럼 솔루션`,
    template: `%s · ${COMPANY.short}`,
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: COMPANY.short,
    url: "./",
    description: DESCRIPTION,
    images: [{ url: "/landing/og.jpg", width: 1897, height: 990, alt: "렛츠코딩 워케이션 센터 화면" }],
  },
  twitter: {
    card: "summary_large_image",
    description: DESCRIPTION,
    images: ["/landing/og.jpg"],
  },
  verification: {
    other: { "naver-site-verification": "f9d3cddbda95b21d446288c741f98fc6147ca6cb" },
  },
};

export const viewport: Viewport = {
  themeColor: "#e9edf3",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={plexMono.variable}>
      {/* Pretendard는 가장 흔한 글자를 마지막 서브셋에 몰아둔다. 라틴 + 최빈 한글이
          들어 있는 91·90번만 미리 받고, 나머지 90개는 실제로 그 글자가 나타날 때
          브라우저가 알아서 가져간다. */}
      <link
        rel="preload"
        href="/fonts/pretendard/PretendardVariable.subset.91.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/pretendard/PretendardVariable.subset.90.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <body className="antialiased">
        <SiteHeader />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
