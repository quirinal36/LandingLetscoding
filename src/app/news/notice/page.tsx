import type { Metadata } from "next";
import { PageStub, STUB_ROBOTS } from "@/components/page-stub";

export const metadata: Metadata = { title: "공지사항", robots: STUB_ROBOTS };

export default function Page() {
  return <PageStub title="공지사항" note="서비스 운영과 관련한 안내입니다." />;
}
