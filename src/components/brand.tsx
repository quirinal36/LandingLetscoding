import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/nav";
import logo from "../../logo.png";

export function Brand() {
  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} 홈`}
      className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
    >
      <Image src={logo} alt="" width={54} height={36} loading="eager" className="shrink-0" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">{COMPANY.short}</span>
    </Link>
  );
}
