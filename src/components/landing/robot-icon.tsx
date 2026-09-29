/** 교구 상자 안의 로봇 — 이야기 무대(story-stage.tsx)가 쓴다. 랜딩 3번의 교구 상자 압축판도 썼었다 */
export function RobotIcon({ className = "size-[46%]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="10" y="16" width="28" height="22" rx="5" />
      <path d="M24 16v-5M20 8h8M4 24v8M44 24v8" />
      <circle cx="18" cy="26" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="30" cy="26" r="2.5" fill="currentColor" stroke="none" />
      <path d="M18 33h12" />
    </svg>
  );
}
