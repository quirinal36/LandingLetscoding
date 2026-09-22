import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "렛츠코딩 파이썬" };

export default function Page() {
  return <PageStub title="렛츠코딩 파이썬" note="파이썬 커리큘럼과 수업 구성입니다." />;
}
