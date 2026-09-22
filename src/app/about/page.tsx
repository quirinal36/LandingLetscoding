import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "회사 소개" };

export default function Page() {
  return <PageStub title="회사 소개" note="주식회사 렛츠코딩이 어떤 회사이고 무엇을 만드는지 소개합니다." />;
}
