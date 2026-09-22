"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { Dot } from "@/components/ui";
import { cn } from "@/lib/cn";
import { NAV, type NavGroup } from "@/lib/nav";

const TRACK_GROUPS = NAV.filter((g) => !g.accent);
const ACCENT_GROUP = NAV.find((g) => g.accent);

function isGroupActive(group: NavGroup, pathname: string) {
  return group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

/** 포인터가 있는 기기에서만 호버로 연다. 터치에서는 탭이 유일한 입력이다. */
function hasFinePointer() {
  return (
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

/** 열린 메뉴 안에서 위아래 키로 항목을 옮겨 다닌다. */
function moveWithinPanel(panel: HTMLElement | null, step: number, toEdge?: "first" | "last") {
  const links = Array.from(panel?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
  if (links.length === 0) return;
  if (toEdge === "first") return links[0].focus();
  if (toEdge === "last") return links[links.length - 1].focus();
  const index = links.indexOf(document.activeElement as HTMLAnchorElement);
  links[(index + step + links.length) % links.length].focus();
}

type MenuProps = {
  group: NavGroup;
  align: "left" | "right";
  pathname: string;
  onEnter: () => void;
  onLeave: () => void;
  onLinkClick: () => void;
  onLeaveFocus: () => void;
};

/** 떠 있는 메뉴. 그림자 대신 반투명 + 블러로 아래를 비춘다. */
function Menu({ group, align, pathname, onEnter, onLeave, onLinkClick, onLeaveFocus }: MenuProps) {
  return (
    <div
      id={`layer-${group.layer}`}
      className={cn(
        "floating rise-in absolute top-full mt-2 w-76 p-1.5",
        align === "right" ? "right-0" : "left-0",
      )}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onKeyDown={(event) => {
        const panel = event.currentTarget;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveWithinPanel(panel, 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          moveWithinPanel(panel, -1);
        } else if (event.key === "Home") {
          event.preventDefault();
          moveWithinPanel(panel, 0, "first");
        } else if (event.key === "End") {
          event.preventDefault();
          moveWithinPanel(panel, 0, "last");
        }
      }}
      onBlur={(event) => {
        // Tab으로 메뉴 밖으로 나가면 닫는다
        if (!event.currentTarget.contains(event.relatedTarget as Node)) onLeaveFocus();
      }}
    >
      <ul>
        {group.items.map((item) => {
          const current = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                onClick={onLinkClick}
                className="menu-row items-start gap-3 px-3 py-2.5"
              >
                <span className="mt-2 shrink-0">
                  <Dot on={current} />
                </span>
                <span>
                  <span className="block text-[0.9375rem] font-medium">{item.label}</span>
                  {item.note && (
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-soft">
                      {item.note}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="hairline mt-1 border-t px-3 pt-2.5 pb-1 text-[0.6875rem] text-ink-faint">
        ↑↓ 이동 · Esc 닫기
      </p>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [openLayer, setOpenLayer] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const closeLayer = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenLayer(null);
  }, []);

  const closeAll = useCallback(() => {
    closeLayer();
    setSheetOpen(false);
  }, [closeLayer]);

  // 내용이 상단 바 아래로 들어가면 헤어라인 한 줄이 그어진다.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", closeAll);
    return () => window.removeEventListener("popstate", closeAll);
  }, [closeAll]);

  // Esc — 닫고 나서 포커스를 열었던 컨트롤로 되돌려준다.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (openLayer !== null) {
        const trigger = triggerRefs.current[openLayer];
        closeLayer();
        trigger?.focus();
      }
      if (sheetOpen) {
        setSheetOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openLayer, sheetOpen, closeLayer]);

  useEffect(() => {
    if (openLayer === null) return;
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) closeLayer();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openLayer, closeLayer]);

  // 시트가 열린 동안 본문 스크롤을 잠그고, 포커스를 시트 안에 가둔다.
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();

    function focusables() {
      const inSheet = Array.from(sheetRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);
      return toggleRef.current ? [toggleRef.current, ...inSheet] : inSheet;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sheetOpen]);

  function scheduleOpen(layer: number) {
    if (!hasFinePointer()) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenLayer(layer), 60);
  }

  function scheduleClose() {
    if (!hasFinePointer()) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenLayer(null), 160);
  }

  function triggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, layer: number) {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setOpenLayer(layer);
    requestAnimationFrame(() =>
      moveWithinPanel(document.getElementById(`layer-${layer}`), 0, "first"),
    );
  }

  return (
    <header className="bar sticky top-0 z-50" data-scrolled={scrolled}>
      <a
        href="#main"
        className="control sr-only px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10"
      >
        본문으로 건너뛰기
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-18 md:px-6">
        <Brand />

        {/* 데스크톱 — 정보 메뉴는 트랙 안에, 전환 동선은 밖에 */}
        <nav ref={navRef} aria-label="주요 메뉴" className="hidden items-center gap-3 md:flex">
          <ul className="track flex items-center gap-1 p-1">
            {TRACK_GROUPS.map((group) => {
              const open = openLayer === group.layer;
              const active = isGroupActive(group, pathname);
              return (
                <li
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => scheduleOpen(group.layer)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[group.layer] = el;
                    }}
                    aria-expanded={open}
                    aria-controls={`layer-${group.layer}`}
                    data-selected={open || active}
                    onClick={() => setOpenLayer(open ? null : group.layer)}
                    onKeyDown={(event) => triggerKeyDown(event, group.layer)}
                    className="segment min-h-10 px-4 text-[0.9375rem] font-medium"
                  >
                    {group.label}
                  </button>
                  {open && (
                    <Menu
                      group={group}
                      align="left"
                      pathname={pathname}
                      onEnter={() => scheduleOpen(group.layer)}
                      onLeave={scheduleClose}
                      onLinkClick={closeAll}
                      onLeaveFocus={closeLayer}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {ACCENT_GROUP && (
            <div
              className="relative"
              onMouseEnter={() => scheduleOpen(ACCENT_GROUP.layer)}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[ACCENT_GROUP.layer] = el;
                }}
                aria-expanded={openLayer === ACCENT_GROUP.layer}
                aria-controls={`layer-${ACCENT_GROUP.layer}`}
                data-pressed={openLayer === ACCENT_GROUP.layer}
                onClick={() =>
                  setOpenLayer(openLayer === ACCENT_GROUP.layer ? null : ACCENT_GROUP.layer)
                }
                onKeyDown={(event) => triggerKeyDown(event, ACCENT_GROUP.layer)}
                className="control control-accent min-h-11 px-5 text-[0.9375rem] font-medium"
              >
                {ACCENT_GROUP.label}
              </button>
              {openLayer === ACCENT_GROUP.layer && (
                <Menu
                  group={ACCENT_GROUP}
                  align="right"
                  pathname={pathname}
                  onEnter={() => scheduleOpen(ACCENT_GROUP.layer)}
                  onLeave={scheduleClose}
                  onLinkClick={closeAll}
                  onLeaveFocus={closeLayer}
                />
              )}
            </div>
          )}
        </nav>

        {/* 모바일 */}
        <button
          type="button"
          ref={toggleRef}
          aria-expanded={sheetOpen}
          aria-controls="nav-sheet"
          aria-label={sheetOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setSheetOpen((v) => !v)}
          data-pressed={sheetOpen}
          className="control size-11 shrink-0 p-0 md:hidden"
        >
          <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
            {sheetOpen ? (
              <path
                d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3.5 6h13M3.5 10h13M3.5 14h13"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 시트 — 같은 바탕이 이어지고 항목만 흰 면으로 올라온다 */}
      {sheetOpen && (
        <div
          id="nav-sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="주요 메뉴"
          className="rise-in fixed inset-x-0 top-16 bottom-0 overflow-y-auto overscroll-contain bg-bg px-4 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))] md:hidden"
        >
          <nav aria-label="주요 메뉴">
            {NAV.map((group) => (
              <section key={group.label} className="mb-7 last:mb-0">
                <h2 className="mb-2.5 px-1 text-[0.8125rem] font-semibold text-ink-soft">
                  {group.label}
                </h2>
                <ul className="grid gap-2">
                  {group.items.map((item) => {
                    const current = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={current ? "page" : undefined}
                          onClick={closeAll}
                          className={cn(
                            "control min-h-16 w-full flex-col items-start justify-center gap-0.5 px-4 py-3 text-left",
                            group.accent && "control-accent",
                          )}
                        >
                          <span className="flex w-full items-center justify-between gap-2">
                            <span className="text-[0.9375rem] font-medium">{item.label}</span>
                            {!group.accent && <Dot on={current} />}
                          </span>
                          {item.note && (
                            <span
                              className={cn(
                                "text-[0.75rem] leading-snug",
                                group.accent ? "text-white" : "text-ink-soft",
                              )}
                            >
                              {item.note}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
