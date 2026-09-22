import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "도입문의" };

export default function Page() {
  return <PageStub title="도입문의" note="기관 도입 상담과 온라인 설명회 신청을 받습니다." />;
}
