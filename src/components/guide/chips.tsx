import { lengthLabel, type Lesson } from "@/lib/guide";
import { cn } from "@/lib/cn";

/** 편의 상태 표시. 색은 쓰지 않고 면의 단계와 글자로만 구분한다. */
export function LessonChips({ lesson, className }: { lesson: Lesson; className?: string }) {
  return (
    <span className={cn("flex flex-wrap items-center gap-1.5 text-xs", className)}>
      <span className="track px-2 py-0.5 text-ink-soft">{lesson.audience} 화면</span>
      <span className="track px-2 py-0.5 text-ink-soft">{lengthLabel(lesson)}</span>
      {lesson.youtubeId && <span className="track px-2 py-0.5 text-ink-soft">영상 등록</span>}
      {!lesson.isComplete && <span className="px-2 py-0.5 font-semibold text-ink-faint outline-1 outline-separator rounded-full">준비 중</span>}
    </span>
  );
}
