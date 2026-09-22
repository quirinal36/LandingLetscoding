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

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.name} — 코딩 교육 솔루션`,
    template: `%s · ${COMPANY.short}`,
  },
  description:
    "렛츠코딩은 교육기관이 코딩 수업을 직접 운영할 수 있도록 커리큘럼과 학습 공간, 운영 도구를 함께 제공합니다.",
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
