import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "교육 철학" };

export default function Page() {
  return <PageStub title="교육 철학" note="렛츠코딩이 코딩을 가르치는 방식과 그렇게 정한 이유를 설명합니다." />;
}
