import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const skill='/Users/letscoding/.codex/plugins/cache/openai-primary-runtime/presentations/26.1104.11149/skills/presentations';
const runtime='/Users/letscoding/.cache/codex-runtimes/codex-primary-runtime/dependencies';
process.env.RUNTIME_NODE_MODULES=path.join(runtime,'node/node_modules');
const {finalizePresentation}=await import(path.join(skill,'container_tools/artifact_tool_utils.mjs'));
const font='Apple SD Gothic Neo';
const p=Presentation.create({slideSize:{width:1600,height:900}});
p.theme.defaultFont=font;
const notes=await fs.readFile(path.join(root,'capture-notes.md'),'utf8');
const detailUrl=notes.match(/https:\/\/lounge\.letscoding\.kr\/works\/[^\s`<>]+/)?.[0];
assert(detailUrl,'Public work URL must be recorded in capture notes');

function text(slide,value,x,y,w,h,size,color='#F8FAFC',bold=false){
  assert(x>=0 && y>=0 && x+w<=1600 && y+h<=900,'Textbox must fit slide');
  const t=slide.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
  t.text=value;
  t.text.style={typeface:font,fontSize:size,bold,color};
  return t;
}

const cover=p.slides.add();
cover.background.fill='#171A20';
text(cover,'렛츠코딩 Studio',88,194,1420,100,76,'#A9F0D6',true);
text(cover,'프로젝트 수업 도입 제안',88,308,1420,120,76,'#FFFFFF',true);
text(cover,'작품을 만들고, 실행하고, 함께 나누는 수업',92,485,1400,70,36,'#BDC7CA');
text(cover,'2026. 11. 06   /   도입 검토용 초안',94,768,1300,50,24,'#BDC7CA');
cover.speakerNotes.text='학원과 교육기관의 프로젝트 수업 도입 검토용 초안입니다. 제안 대상, 이용료, 계약 조건은 확정하지 않았습니다. 제품 화면은 2026-11-06 운영 서비스에서 캡처했습니다. 출처: https://lounge.letscoding.kr/studio 및 https://lounge.letscoding.kr/works. 수업 성과나 도입 효과를 검증한 자료는 아닙니다.';

const slides=[
  {file:'01-production-project-list.png',title:'작품을 모아 보고, 만들던 작업을 이어갑니다',caption:'프로젝트 목록에서 작품 이름과 유형, 라운지 게시 상태를 확인합니다.',note:'로그인된 leco 계정의 작품 목록입니다. 기관·클래스·멤버 선택 UI도 보입니다. 학생 개별 작품 관리 권한이나 저장 복구 동작을 시험한 것은 아닙니다.'},
  {file:'02-production-editor-overview.png',title:'파일과 실행 화면, AI 대화를 한 작업 공간에서',caption:'시연 작품 「하늘을 나는 자동차」의 Studio 편집기 전체 화면입니다.',note:'파일 탐색기, 미리보기, LECO 대화 패널을 함께 확인했습니다. script.js 주석에 강의 시연용이라고 표시되어 있어 학생이 독립적으로 완성한 성과 사례로 제시하지 않습니다.'},
  {file:'03-production-code-editor.png',title:'작품의 코드를 직접 확인하는 편집기',caption:'HTML·CSS·JavaScript 파일을 선택하고 코드와 미리보기 탭을 오갈 수 있습니다.',note:'기존 script.js를 열어 실제 코드를 확인했습니다. 파일 검색, 가져오기, 내보내기 UI가 보입니다. 코드를 수정하거나 저장하지 않았으며 가져오기·내보내기 동작은 이번 캡처에서 시험하지 않았습니다.'},
  {file:'04-production-leco-panel.png',title:'작품 옆에서 활용하는 LECO AI 도우미',caption:'기존 대화와 프롬프트 목록을 열어, 도움을 요청하는 화면을 확인했습니다.',note:'기존 인사 대화와 로그인 연동·랭킹·개발일지·외부 API·썸네일 등에 관한 프롬프트 예시가 보입니다. AI 요청을 전송하지 않았습니다. 프롬프트가 있다는 사실만으로 각 기능의 구현 성공이나 응답 품질을 보증하지 않습니다.'},
  {file:'05-production-live-preview.png',title:'만든 작품을 편집기 안에서 실행합니다',caption:'시연 작품의 시작 버튼을 눌러 실제 게임 장면으로 전환했습니다.',note:'시작 화면에서 게임 장면으로 전환되는 것을 확인했습니다. 압축 기체를 소재로 한 강의 시연용 게임입니다. 전체 게임 진행, 모든 기기 동작, 학습 성과를 검증한 자료는 아닙니다.'},
  {file:'06-production-public-gallery.png',title:'라운지에서 다른 사람의 작품을 살펴봅니다',caption:'Studio 필터를 적용한 작품 목록에서 게임과 웹사이트 사례를 확인합니다.',url:'https://lounge.letscoding.kr/works?studio=1',note:'Studio 필터를 선택한 라운지 작품 목록입니다. 추천 과제와 다양한 작품 카드가 보입니다. 조회 수와 기타 수치는 캡처 시점의 UI 값이며 도입 효과를 입증하는 지표로 사용하지 않습니다.'},
  {file:'07-production-public-work-detail.png',title:'작품을 소개하고, 실행과 공유로 연결합니다',caption:'공개 작품 「반응속도 테스트」의 소개, Play·공유 버튼과 랭킹 화면입니다.',url:detailUrl,note:'공개 목록에서 직접 연 다른 작품의 상세 화면입니다. 앞선 시연 작품과 다릅니다. Play·공유 버튼, 랭킹을 확인했으며 좋아요·댓글·투자·공유 동작은 실행하지 않았습니다. 로그인된 계정의 관리용 메뉴도 일부 보이므로 모든 사용자에게 동일한 UI라고 설명하지 않습니다.'},
];

for(const data of slides){
  const s=p.slides.add();
  const light=data.file.startsWith('06')||data.file.startsWith('07');
  s.background.fill=light?'#F4F6F5':'#171A20';
  text(s,data.title,66,28,1468,80,48,light?'#18232A':'#FFFFFF',true);
  text(s,data.caption,70,110,1460,50,27,light?'#4F6168':'#BAC7CC');
  const bytes=await fs.readFile(path.join(root,'screenshots',data.file));
  assert.equal(bytes.readUInt32BE(16),1920);
  assert.equal(bytes.readUInt32BE(20),1080);
  s.images.add({blob:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),contentType:'image/png',alt:data.caption,fit:'contain',position:{left:160,top:174,width:1280,height:720}});
  s.speakerNotes.text=`${data.note}\n出처: ${data.url||'https://lounge.letscoding.kr/studio'}\n캡처일: 2026-11-06. 원본: screenshots/${data.file}`.replace('出처','출처');
}

const pilot=p.slides.add();
pilot.background.fill='#171A20';
text(pilot,'한 반에서 시작하는 4회 시범 수업',70,50,1460,90,58,'#FFFFFF',true);
text(pilot,'운영안 예시: 학습자 수준과 수업 시간에 따라 협의합니다.',74,154,1440,60,30,'#BAC7CC');
const stages=[
  ['1회','주제와 작품 구상','학생이 만들고 싶은 작품을 정하고, 실행할 수 있는 범위를 함께 정합니다.'],
  ['2회','기본 기능 제작','파일과 AI 도우미를 활용하며 핵심 기능을 구성합니다.'],
  ['3회','실행과 수정','직접 실행해 문제를 찾고, 바꾼 이유와 결과를 기록합니다.'],
  ['4회','작품 발표와 피드백','작품을 소개하고, 다른 사람의 의견을 다음 수정에 반영합니다.'],
];
for(const [i,[n,title,body]] of stages.entries()){
  const y=260+i*112;
  text(pilot,n,76,y,110,55,34,'#A9F0D6',true);
  text(pilot,title,200,y,440,58,36,'#FFFFFF',true);
  text(pilot,body,680,y+4,820,82,29,'#D1D9DC');
}
text(pilot,'도입 전 협의: 대상·인원, 계정과 기기, AI 사용 범위, 작품 공개 범위, 비용과 지원',78,766,1440,72,28,'#A9F0D6');
pilot.speakerNotes.text='이 슬라이드는 운영 제안이며 확정된 상품 구성이나 검증된 프로그램이 아닙니다. 시범 수업에서 작품 실행 여부, 학생이 수정 이유를 설명하는지, 교사의 준비·지원 부담을 함께 확인하는 방안을 제안합니다. 제안 대상과 수업 시간, 비용, 사용량, 지원 범위, 작품 공개 범위는 별도 협의가 필요합니다.';

assert.equal(p.slides.items.length,9);
await fs.mkdir(path.join(root,'.build/previews'),{recursive:true});
for(const [i,s] of p.slides.items.entries()){
  const png=await p.export({slide:s,format:'png',scale:1});
  await fs.writeFile(path.join(root,'.build/previews',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
}
const candidatePath=path.join(root,'.build/candidate-v2.pptx');
await(await PresentationFile.exportPptx(p)).save(candidatePath);
const result=await finalizePresentation({
  workspaceDir:root,candidatePath,finalPath:path.join(root,'deliverables/studio-proposal.pptx'),
  pythonExecutable:path.join(runtime,'python/bin/python3'),
  integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-bullet-geometry','--validate-heading-fit'],
  requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,
  receiptPath:path.join(root,'.build/validation.json'),
});
await fs.writeFile(path.join(root,'slide-outline.md'),[
  '# 렛츠코딩 Studio 제안 슬라이드 초안',
  '학원·교육기관 공통 도입 검토용. 실제 운영 화면 캡처: 2026-11-06. 비용과 계약 조건은 미포함.',
  '',
  ...p.slides.items.map((s,i)=>`## ${i+1}. ${i===0?'렛츠코딩 Studio 프로젝트 수업 도입 제안':i===8?'한 반에서 시작하는 4회 시범 수업':slides[i-1].title}\n\n${s.speakerNotes.text}\n`),
].join('\n'));
console.log(JSON.stringify({slides:p.slides.items.length,final:result},null,2));
