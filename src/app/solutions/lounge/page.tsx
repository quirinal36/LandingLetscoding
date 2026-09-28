import type { Metadata } from "next";
import { PageStub, STUB_ROBOTS } from "@/components/page-stub";

export const metadata: Metadata = { title: "렛츠코딩 라운지", robots: STUB_ROBOTS };

export default function Page() {
  return <PageStub title="렛츠코딩 라운지" note="학습 공간과 수업 운영 도구를 묶은 솔루션입니다." />;
}
