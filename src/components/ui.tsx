import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "plain" | "accent";
type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  // 어떤 크기도 터치 타겟 44px을 밑돌지 않는다.
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-5 text-[0.9375rem]",
  lg: "min-h-14 px-7 text-base",
};

type BaseProps = {
  tone?: Tone;
  size?: Size;
  className?: string;
  children: ReactNode;
};

function controlClass({ tone = "plain", size = "md", className }: Omit<BaseProps, "children">) {
  return cn("control font-medium", SIZE[size], tone === "accent" && "control-accent", className);
}

export function Button({
  tone,
  size,
  className,
  children,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button type="button" className={controlClass({ tone, size, className })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  tone,
  size,
  className,
  children,
  href,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link href={href} className={controlClass({ tone, size, className })} {...rest}>
      {children}
    </Link>
  );
}

/** 현재 위치 표시등. 켜진 것 하나만 색을 갖는다. */
export function Dot({ on }: { on: boolean }) {
  return <span className="dot" data-on={on} aria-hidden="true" />;
}
