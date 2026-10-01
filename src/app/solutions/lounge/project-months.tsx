"use client";

import { useState } from "react";

const MONTHS = ["이번 달", "다음 달", "그다음 달"];
const STEPS = [
  { title: "만들고", label: "MAKE", description: "배운 코딩에 AI와 바이브코딩을 더해, 학생의 아이디어를 실제로 실행할 수 있는 작품으로 만듭니다." },
  { title: "공개하고", label: "SHARE", description: "완성한 작품을 라운지에 공개합니다. 링크로 공유하고 홍보하며, 우리 반 밖의 사람들에게도 작품을 소개합니다." },
  { title: "함께 즐기고", label: "PLAY", description: "서로의 작품을 플레이하고 반응을 나눕니다. 친구의 피드백에서 작품을 더 재미있게 만들 힌트를 발견합니다." },
  { title: "더 나아지고", label: "IMPROVE", description: "반응을 바탕으로 작품을 개선합니다. 만드는 동안 쌓인 경험과 새로운 아이디어가 다음 프로젝트의 출발점이 됩니다." },
];

export function ProjectMonths() {
  const [month, setMonth] = useState(0);
  const [step, setStep] = useState(0);
  const selected = STEPS[step];

  return (
    <div className="ls-months">
      <div className="ls-month-picker" aria-label="프로젝트 수업의 달 선택">
        {MONTHS.map((name, index) => (
          <button key={name} type="button" aria-pressed={month === index} onClick={() => { setMonth(index); setStep(0); }}>{name}<span>새로운 문제 5개</span></button>
        ))}
      </div>
      <div className="ls-project">
        <p className="ls-project-heading">{MONTHS[month]} · {month === 0 ? "배운 코딩으로 시작하기" : month === 1 ? "지난 경험에 새 주제 더하기" : "쌓인 경험으로 다시 도전하기"}</p>
        <div className="ls-stage-picker" aria-label="프로젝트 단계 선택">
          {STEPS.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={step === index} aria-controls="project-stage" onClick={() => setStep(index)}><span>0{index + 1}</span>{item.title}<i aria-hidden="true">→</i></button>
          ))}
        </div>
        <div id="project-stage" className="ls-stage-detail" aria-live="polite">
          <span className="ls-stage-word" aria-hidden="true">{selected.label}</span>
          <div><h3>{selected.title},<br /><em>{step === 0 ? "생각이 작품으로." : step === 1 ? "작품이 사람들에게." : step === 2 ? "재미가 다음 힌트로." : "경험이 다음 수업으로."}</em></h3><p>{selected.description}</p></div>
        </div>
        <button className="ls-next" type="button" onClick={() => { if (step === 3) { setMonth((month + 1) % MONTHS.length); setStep(0); } else { setStep(step + 1); } }}>{step === 3 ? "다음 달 프로젝트로" : "다음 과정 보기"}<span aria-hidden="true">↗</span></button>
      </div>
    </div>
  );
}
