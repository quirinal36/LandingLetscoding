import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "블로그" };

export default function Page() {
  return <PageStub title="블로그" note="교육 현장과 제품에 대해 쓰는 글입니다." />;
}
