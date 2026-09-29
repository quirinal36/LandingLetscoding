import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { RevealObserver } from "@/components/landing/reveal-observer";
import { ScrollScene } from "@/components/landing/scroll-scene";
import { Container, Eyebrow, reveal } from "@/components/landing/section";
import { StoryCaptions, StoryStage } from "@/components/landing/story-stage";
import { STORY_T } from "@/components/landing/timeline";

/*
  브랜드 스토리 — MYPROBLEM.md 의 이야기. 랜딩 3번의 진화 장면이 여기로 이어진다.
  7년 이야기 장면(story-stage.tsx)은 원래 랜딩 8번에 있던 것을 그대로 옮겼다.
  사실의 경계: 프랜차이즈 이름은 쓰지 않는다. 연도와 학년은 MYPROBLEM.md 그대로.
  사진은 전부 실사(public/about). 학생 얼굴은 가리거나 뒷모습만 쓴다.
  workshop.jpg 는 참석자 얼굴 6곳을 HyperFrames 정지 컴포지션(흐린 사본 + 타원 마스크)으로 흐리게 한 뒤 뽑은 것이다.
*/

export const metadata: Metadata = {
  title: "브랜드 스토리",
  description:
    "7년째 코딩학원을 운영하며 교구와 교재의 한계에 부딪힌 원장이, 학생들과 바이브코딩을 시작하고 렛츠코딩 라운지를 만들기까지의 이야기입니다.",
};

type Photo = { src: string; alt: string; w: number; h: number; caption: string; videoSrc?: string };
type Chapter = { when: string; title: string; body: string; photo?: Photo };

const CHAPTERS: Chapter[] = [
  {
    when: "2019",
    title: "6년 치라던 교재는, 6개월이면 끝났습니다.",
    body: "프랜차이즈 코딩학원을 열었습니다. 교재와 교구가 넉넉해 보였습니다. 막상 수업을 해 보니 7세, 8세 아이가 가지고 놀 수준이었고, 학원에 오는 학생은 대부분 11세에서 16세였습니다. 로봇을 앞뒤로 움직이고 조건문과 반복문을 넣는 데서 더 나아가지 못했습니다.",
  },
  {
    when: "그 뒤로",
    title: "교구를 바꿔도, 다시 1단계부터였습니다.",
    body: "학생이 지루해지면 새 로봇을 들였습니다. 새 로봇도 처음 여섯 달을 반복할 뿐이었습니다. 학생은 자라는데 커리큘럼은 제자리였습니다. 서점에서 가장 많이 팔리는 교재도 초보 1단계에서 6단계까지만 다뤘습니다.",
  },
  {
    when: "2022",
    title: "학생들은 교구보다 멀리 갈 수 있었습니다.",
    body: "2022 메타버스 개발자 경진대회 학생부문에서 우리 학원 학생 팀이 최우수상을 받았습니다. 교구가 멈춘 자리에서도 학생은 계속 자랐습니다. 커리큘럼이 따라가지 못했을 뿐입니다.",
    photo: {
      src: "/about/award-2022.jpg",
      alt: "2022 메타버스 개발자 경진대회 학생부문 최우수상 시상 후 학생 네 명과 원장이 상패와 꽃다발을 들고 선 사진. 학생 얼굴은 흐리게 가렸다",
      w: 1280,
      h: 960,
      caption: "2022 메타버스 개발자 경진대회 학생부문 최우수상 (한국메타버스산업협회장상). 학생 얼굴은 가렸습니다.",
    },
  },
  {
    when: "2024",
    title: "장고로 웹앱 수업을 시도했습니다.",
    body: "학생이 진짜 서비스를 만들게 하고 싶었습니다. 그런데 거쳐야 할 이론이 너무 많았고, 수업은 2회차를 넘기지 못했습니다.",
  },
  {
    when: "2026.1",
    title: "학생들과 바이브코딩을 시작했습니다.",
    body: "AI가 코드를 써 주게 되자 2024년에 막혔던 같은 수업이 됐습니다. 그때부터 문법과 자격증을 위한 수업은 하지 않기로 했습니다. 학생들이 만든 게임과 웹사이트를 올려 두는 곳이 필요했고, 그렇게 렛츠코딩 라운지가 생겼습니다.",
  },
  {
    when: "지금",
    title: "팔기 전에, 우리 학원에서 먼저 매일 씁니다.",
    body: "라운지는 우리 학원이 부딪힌 문제에서 나왔습니다. 같은 한계 앞에 선 원장님들께, 우리가 쓰고 있는 그대로 엽니다.",
    photo: {
      src: "/about/academy-class.png",
      videoSrc: "/about/academy-class.mp4",
      alt: "렛츠코딩앤플레이학원 교실. 학생들이 모니터 앞에 앉아 작업하는 뒷모습",
      w: 2752,
      h: 1536,
      caption: "렛츠코딩앤플레이학원 교실",
    },
  },
];

export default function Page() {
  return (
    <>
      <RevealObserver />

      <section className="tone-dark relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-20">
        <div className="halo top-[20%]" aria-hidden="true" />
        <Container className="relative grid items-end gap-10 md:grid-cols-[1fr_auto] md:gap-14">
          <div>
            <Eyebrow>브랜드 스토리</Eyebrow>
            <h1 className="display text-metal mt-4 max-w-[14ch] text-[2.75rem] md:text-[5.5rem]">한계를 만난 학원이, 한계를 넘기까지.</h1>
            <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-ink-soft md:text-[1.375rem]">
              렛츠코딩 라운지는 팔려고 먼저 만든 제품이 아닙니다. 7년째 코딩학원을 운영하며 부딪힌 문제에서 나왔습니다.
            </p>
          </div>
          <figure className="w-44 md:w-60">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-white/5">
              <Image src="/about/leehg.jpg" alt="이형구 원장 프로필 사진" fill priority sizes="(min-width: 768px) 240px, 176px" className="object-cover object-[50%_20%]" />
            </div>
            <figcaption className="mt-3">
              <span className="block text-lg font-bold">이형구</span>
              <span className="block text-[0.9375rem] text-ink-soft">렛츠코딩앤플레이학원 원장</span>
            </figcaption>
          </figure>
        </Container>
      </section>

      <ScrollScene length={5} mode="timeline" duration={STORY_T} className="tone-dark" pinClassName="flex items-center">
        <Container className="grid items-center gap-8 pt-16 md:gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-5 text-[0.8125rem] font-medium tracking-[0.08em] text-ink-faint uppercase">7년 동안 겪은 일</p>
            <StoryCaptions />
          </div>
          <div className="relative">
            <div className="halo opacity-60" aria-hidden="true" />
            <div className="relative">
              <StoryStage />
            </div>
          </div>
        </Container>
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10" aria-hidden="true">
          <div className="h-full origin-left bg-accent" style={{ transform: "scaleX(var(--p, 1))" }} />
        </div>
      </ScrollScene>

      <section className="tone-paper py-28 md:py-40">
        <Container>
          <ol className="grid gap-16 md:gap-24">
            {CHAPTERS.map((c) => (
              <li key={c.when} className="grid gap-3 md:grid-cols-[10rem_1fr] md:gap-10" {...reveal()}>
                <p className="font-mono text-[0.9375rem] text-accent-ink md:pt-3">{c.when}</p>
                <div>
                  <h2 className="display max-w-[20ch] text-[1.75rem] md:text-[2.75rem]">{c.title}</h2>
                  <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft md:text-lg">{c.body}</p>
                  {c.photo && (
                    <figure className="mt-8">
                      {c.photo.videoSrc ? (
                        <video
                          src={c.photo.videoSrc}
                          poster={c.photo.src}
                          width={c.photo.w}
                          height={c.photo.h}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          preload="metadata"
                          aria-label={c.photo.alt}
                          className="h-auto w-full rounded-[28px]"
                        >
                          <a href={c.photo.videoSrc}>교실 영상 보기</a>
                        </video>
                      ) : (
                        <Image
                          src={c.photo.src}
                          alt={c.photo.alt}
                          width={c.photo.w}
                          height={c.photo.h}
                          sizes="(min-width: 1088px) 800px, 92vw"
                          className="h-auto w-full rounded-[28px]"
                        />
                      )}
                      <figcaption className="mt-3 text-[0.8125rem] text-ink-faint">{c.photo.caption}</figcaption>
                    </figure>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-28 grid items-center gap-8 md:mt-40 md:grid-cols-[1fr_1.2fr] md:gap-12" {...reveal()}>
            <div>
              <Eyebrow>첫 수업은 함께</Eyebrow>
              <h2 className="display mt-3 max-w-[14ch] text-[1.75rem] md:text-[2.75rem]">선생님들과 먼저 수업해 봅니다.</h2>
              <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-soft md:text-lg">
                라운지를 여는 학원에는 렛츠코딩 팀이 바이브코딩 수업 진행을 코칭합니다. 학생 앞에 서기 전에, 선생님이 먼저 만들어 봅니다.
              </p>
            </div>
            <figure>
              <Image
                src="/about/workshop.jpg"
                alt="강의실에서 선생님들이 노트북으로 실습하고, 앞쪽 화면 앞에서 강사가 설명하는 워크숍 장면. 참석자 얼굴은 흐리게 가렸다"
                width={1200}
                height={630}
                sizes="(min-width: 1088px) 560px, 92vw"
                className="h-auto w-full rounded-[28px]"
              />
              <figcaption className="mt-3 text-[0.8125rem] text-ink-faint">바이브코딩 수업 워크숍. 참석자 얼굴은 가렸습니다.</figcaption>
            </figure>
          </div>

          <div className="mt-24 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-32" {...reveal()}>
            <ButtonLink href="/seminar/inquiry" tone="accent" size="lg" className="pill">
              4주 무료 파일럿 신청
            </ButtonLink>
            <Link href="/about/philosophy" className="link-chevron text-[1.0625rem]">
              우리가 가르치는 방식
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
