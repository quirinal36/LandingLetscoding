import { ButtonLink } from "@/components/ui";

/** 내비게이션을 실제로 눌러볼 수 있도록 둔 임시 페이지. 내용은 이후 채운다. */
export function PageStub({ title, note }: { title: string; note: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
      <div className="card p-7 md:p-10">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] md:text-3xl">{title}</h1>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-ink-soft">{note}</p>
        <p className="mt-6 text-sm leading-relaxed text-ink-faint">
          내용은 아직 준비 중입니다. 메뉴와 테마가 먼저 올라가 있습니다.
        </p>
        <div className="mt-8">
          <ButtonLink href="/" size="sm">
            처음으로
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
