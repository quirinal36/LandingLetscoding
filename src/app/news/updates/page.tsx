import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "업데이트 소식" };

export default function Page() {
  return <PageStub title="업데이트 소식" note="제품에 새로 들어간 기능과 변경 사항입니다." />;
}
