import React, { useState } from 'react';
import { 
  FileText, Copy, Check, School, Layers, Database, 
  Settings, ShieldAlert, Cpu, Calendar, Download, Printer, ExternalLink, ChevronRight, BookOpen
} from 'lucide-react';
import { SCHOOL_INFO, DEPARTMENTS } from '../data/schoolData';

export const PrdViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('summary');

  const fullPrdMarkdown = `# [PRD] 대진전자통신고등학교 학년별·학급별 실시간 시간표 시스템

**문서 버전:** v1.0.0 (Official Specification)  
**작성일자:** 2026-10-02  
**작성자:** Lead Systems Architect & Product Manager  
**대상 학교:** 대진전자통신고등학교 (부산광역시교육청 C10 / 행정표준코드 7150597)  
**데이터 연동:** 교육부 NEIS 오픈 API - 고등학교 시간표 서비스 (hisTimetable)

---

## 1. 프로젝트 개요 (Executive Summary)

### 1.1 배경 및 목적
대진전자통신고등학교는 4개 학과(전기전자과, AI소프트웨어과/컴퓨터소프트웨어과, 스마트콘텐츠과, 산업디자인과)로 구성된 특성화고등학교로서, 이론 교과뿐 아니라 NCS 기반 전문 실습 교과와 프로그래밍, CAD, 회로 설계, 미디어 제작 등 다양한 전문 실습실 기반 수업이 진행됩니다.
기존 종이 시간표나 고정 이미지 배포 방식은 다음과 같은 문제점이 존재했습니다:
- 학사 일정 변경, 실습실 이동수업, 보강 등으로 인한 시간표 잦은 변동 미반영
- 학과별/반별 세부 교과 차이에 대한 직관적인 비교 불가
- 모바일 및 PC 브라우저에서 실시간 오늘 교시 및 주간 시간표 확인 불편

본 프로젝트는 **교육부 NEIS(나이스) 오픈데이터 포털의 고등학교 시간표 실시간 API(\`hisTimetable\`)**를 직접 연동하여, **1~3학년 각 1~10반 전체의 실시간 시간표를 정확하고 직관적으로 제공하는 웹 서비스**를 구축하는 것을 목적으로 합니다.

---

## 2. 학교 기본 정보 및 학급 편성 명세

### 2.1 학교 메타데이터
- **시도교육청코드:** C10 (부산광역시교육청)
- **행정표준학교코드 (SD_SCHUL_CODE):** 7150597
- **학교명:** 대진전자통신고등학교 (영문: Daejin High School of Electronics & Communication)
- **학교구분:** 고등학교 / 특성화고 / 전문계(공업계) / 사립 / 남녀공학 / 주간
- **소재지:** 부산광역시 금정구 수림로 92 (장전동) / 우편번호 46247
- **홈페이지:** http://pdj.hs.kr / 대표전화: 051-582-8100

### 2.2 학년별 학급(1~10반) 및 학과 편성표
대진전자통신고는 학년별 10개 학급(총 30학급)으로 운영됩니다:
- **1학년:**
  - 1반 ~ 3반 (3개 학급): **전기전자과** (반도체, 전자회로, 제어)
  - 4반 ~ 5반 (2개 학급): **AI소프트웨어과** (인공지능, 파이썬, 웹 프로그래밍)
  - 6반 ~ 8반 (3개 학급): **스마트콘텐츠과** (디지털콘텐츠, 애니메이션, 영상)
  - 9반 ~ 10반 (2개 학급): **산업디자인과** (제품디자인, 3D 모델링, 시각디자인)
- **2학년:**
  - 1반 ~ 3반: **전기전자과**
  - 4반 ~ 5반: **컴퓨터소프트웨어과** (자바, SQL 데이터베이스, 시스템SW)
  - 6반 ~ 8반: **스마트콘텐츠과**
  - 9반 ~ 10반: **산업디자인과**
- **3학년:**
  - 1반 ~ 3반: **전기전자과**
  - 4반 ~ 5반: **컴퓨터소프트웨어과**
  - 6반 ~ 8반: **스마트콘텐츠과**
  - 9반 ~ 10반: **산업디자인과**

---

## 3. 외부 API 연동 명세 (NEIS hisTimetable API)

### 3.1 엔드포인트 규격
- **기본 URL:** \`https://open.neis.go.kr/hub/hisTimetable\`
- **통신 프로토콜:** HTTPS GET
- **CORS 지원 여부:** 지원 (\`Access-Control-Allow-Origin: *\`) - 클라이언트 직통 호출 가능

### 3.2 요청 파라미터 (Request Parameters)
| 파라미터명 | 타입 | 필수 여부 | 예시 값 | 설명 |
|---|---|---|---|---|
| \`KEY\` | String | 선택 | (32자리 영숫자) | NEIS 인증키 (누락 시 샘플 트래픽 허용) |
| \`Type\` | String | 필수 | \`json\` | 응답 포맷 (json / xml) |
| \`pIndex\` | Integer | 필수 | \`1\` | 페이지 번호 |
| \`pSize\` | Integer | 필수 | \`100\` | 페이지당 결과 수 (최대 1000) |
| \`ATPT_OFCDC_SC_CODE\` | String | 필수 | \`C10\` | 시도교육청코드 (부산광역시교육청) |
| \`SD_SCHUL_CODE\` | String | 필수 | \`7150597\` | 행정표준학교코드 (대진전자통신고) |
| \`AY\` | String | 조건부 | \`2026\` | 학년도 (4자리 연도) |
| \`SEM\` | String | 조건부 | \`2\` | 학기 (1 or 2) |
| \`ALL_TI_YMD\` | String | 조건부 | \`20261002\` | 특정 조회 일자 (YYYYMMDD) |
| \`TI_FROM_YMD\` | String | 조건부 | \`20260928\` | 주간 조회 시작일 (YYYYMMDD) |
| \`TI_TO_YMD\` | String | 조건부 | \`20261002\` | 주간 조회 종료일 (YYYYMMDD) |
| \`GRADE\` | String | 조건부 | \`1\`, \`2\`, \`3\` | 학년 (1~3) |
| \`CLASS_NM\` | String | 조건부 | \`1\` ~ \`10\` | 학급 (반) |

### 3.3 응답 필드 (Response Schema)
- \`hisTimetable[1].row[]\`
  - \`PERIO\`: 교시 (1~7)
  - \`ITRT_CNTNT\`: 수업내용/과목명 (예: "컴퓨터 구조", "* SQL활용", "공통수학1")
  - \`DDDEP_NM\`: 학과명 (예: "AI소프트웨어과", "전기전자과")
  - \`ALL_TI_YMD\`: 수업 일자 (YYYYMMDD)
  - \`GRADE\`: 학년
  - \`CLASS_NM\`: 반
  - \`LOAD_DTM\`: 최종 동기화 일시

### 3.4 과목명 정제 및 분류 비즈니스 로직
- 과목명 앞 \`*\` 접두어 처리: NEIS에서 NCS 기반 실무 과목은 \`*\` 기호로 시작함 (예: \`* 시스템소프트웨어 펌웨어 구현\`). UI에서는 깔끔한 과목명으로 정제하고 별도 **[NCS 실무]** 배지 태그를 부여함.
- 과목 분류 체계:
  1. **NCS 실무**: \`*\` 접두 과목, 실습, CAD, SQL, 프로그래밍 실습 등
  2. **전공 이론**: 컴퓨터 구조, 인공지능 일반, 전기회로 기초 등
  3. **일반 교과**: 국어, 수학, 영어, 한국사, 통합사회, 통합과학, 체육, 미술, 음악 등
  4. **창의적 체험활동**: 자율활동, 동아리활동, 진로활동, 봉사활동

---

## 4. 기능적 요구사항 (Functional Requirements)

- **[FR-01] 학년 및 학급 선택 필터 (Must Have)**
  - 사용자는 1학년 / 2학년 / 3학년을 탭으로 즉시 선택할 수 있다.
  - 선택된 학년에 속한 1반부터 10반까지의 버튼이 표시되며, 각 학급 버튼에는 소속 학과명(전기전자과, AI소프트웨어과 등) 배지가 동적으로 함께 표기된다.
- **[FR-02] 주간 시간표 매트릭스 뷰 (Must Have)**
  - 선택한 학년/반의 월요일부터 금요일까지(1교시~7교시) 주간 시간표를 한눈에 볼 수 있는 그리드 테이블을 제공한다.
  - 교시별 시작/종료 시각(08:50 ~ 16:30)을 행 헤더에 표시한다.
  - 현재 요일 열과 현재 시간의 교시 셀을 시각적으로 하이라이트한다.
- **[FR-03] 일일 시간표 집중 뷰 (Should Have)**
  - 특정 날짜(기본값: 오늘)의 1~7교시 타임라인을 집중해서 확인하는 카드형 뷰를 제공한다.
  - 현재 시각에 맞추어 [진행 중], [다음 수업], [종료] 상태 뱃지를 노출한다.
- **[FR-04] 학년 전체 학급 비교 매트릭스 뷰 (Should Have)**
  - 선택된 일자에 대해 해당 학년의 1반부터 10반까지 전체 학급의 교시별 시간표를 가로 10열 테이블로 한 화면에서 비교할 수 있다.
  - 교사 및 학사 관리자, 이동 수업 학생에게 유용하다.
- **[FR-05] 날짜 및 주간 이동 네비게이션 (Must Have)**
  - [이번 주] 바로가기, [이전 주], [다음 주] 버튼을 통해 과거 및 미래 주간 시간표를 자유롭게 조회할 수 있다.
  - 날짜 피커를 통해 원하는 특정 날짜로 직접 이동할 수 있다.
- **[FR-06] 내 반 저장 (즐겨찾기 / Default Class) (Nice to Have)**
  - 브라우저 LocalStorage에 사용자의 학년/반을 저장하여 재방문 시 자동 로드한다.
- **[FR-07] 시간표 인쇄 및 이미지 클립보드 내보내기 (Nice to Have)**
  - CSS Print Media Query를 지원하여 A4 가로 규격에 최적화된 인쇄 화면을 제공한다.
- **[FR-08] NEIS API 장애 대비 레질리언스 캐시 (Must Have)**
  - NEIS 서버 점검 시간 또는 네트워크 오류 발생 시에도 서비스가 중단되지 않도록 고정밀 대진전자통신고 학사 데이터셋 폴백을 가동한다.
- **[FR-09] 교과목 연계 과제 및 수행평가 관리 기능 (Must Have)**
  - 시간표의 특정 교시/과목 카드를 클릭하거나 상단 버튼을 통해 과제명, 마감일/시각, 중요도, 상세 메모를 등록/수정/삭제할 수 있다.
  - 시간표 셀에 등록된 미완료 과제 수 뱃지를 시각적으로 표시하며, D-Day 카운트다운 및 완료 체크박스를 지원한다.
  - 모든 과제 데이터는 브라우저 LocalStorage에 안전하게 영구 저장되어 무설치 개인화 환경을 제공한다.

---

## 5. 비기능 요구사항 (Non-Functional Requirements)

- **[NFR-01] 성능 및 속도:** 인메모리 캐싱을 통해 탭 전환 및 주간 이동 시 100ms 이내에 즉각 렌더링.
- **[NFR-02] 모바일 반응형:** 스마트폰(가로 스크롤 테이블 및 스와이프 뷰), 태블릿, 고해상도 모니터 전체에 완벽 대응.
- **[NFR-03] 접근성 및 가독성:** 교실 모니터나 스마트폰 햇빛 아래에서도 잘 보이도록 WCAG 2.1 AA 수준의 고대비 폰트 및 과목별 시각 색상 배정.
- **[NFR-04] 무설치 브라우저 구동:** 학생과 교직원이 별도 앱 설치 없이 브라우저 URL로 즉시 접속 가능.

---

## 6. 개발 로드맵 및 향후 확장 계획

1. **Phase 1 (현재):** NEIS Open API 연동 학년/반별 실시간 시간표 뷰어 구축 (주간/일일/전체학급 매트릭스) & PRD 시스템 탑재
2. **Phase 2:** NEIS 고등학교 급식 식단표(mealServiceDietInfo) 연계 탭 추가
3. **Phase 3:** 대진전자통신고 학사일정(SchoolSchedule) 연계 및 실습실 예약/시험 시간표 위젯 지원
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPrdMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide border border-indigo-500/30">
              <FileText className="w-3.5 h-3.5" />
              PRODUCT REQUIREMENTS DOCUMENT (PRD) v1.0.0
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              대진전자통신고등학교 실시간 시간표 시스템 제품 기획서
            </h1>
            <p className="text-sm text-slate-300">
              교육부 NEIS 오픈 API <code className="bg-black/40 px-2 py-0.5 rounded text-amber-300 text-xs">hisTimetable</code> 기반 학년별·학급별 시간표 서비스 구축 명세서
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'PRD 복사 완료!' : 'PRD 전문 마크다운 복사'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              인쇄 / PDF
            </button>
          </div>
        </div>

        {/* Quick Spec Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
            <span className="text-slate-400 block mb-0.5">시도교육청코드</span>
            <span className="font-bold text-white text-sm">C10 (부산광역시)</span>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
            <span className="text-slate-400 block mb-0.5">행정표준코드</span>
            <span className="font-bold text-white text-sm">7150597 (대진전자통신고)</span>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
            <span className="text-slate-400 block mb-0.5">학급 편성</span>
            <span className="font-bold text-white text-sm">1~3학년 각 10개 학급 (총 30반)</span>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
            <span className="text-slate-400 block mb-0.5">전문 학과 구성</span>
            <span className="font-bold text-white text-sm">전기전자 / AI·컴퓨터SW / 스마트콘텐츠 / 산디</span>
          </div>
        </div>
      </div>

      {/* Interactive PRD Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 text-sm font-medium">
        {[
          { id: 'summary', label: '1. 프로젝트 개요', icon: BookOpen },
          { id: 'school', label: '2. 학교 & 학급 명세', icon: School },
          { id: 'api', label: '3. NEIS API 연동 규격', icon: Database },
          { id: 'functional', label: '4. 기능 요구사항 (FR)', icon: Settings },
          { id: 'nonfunctional', label: '5. 비기능 요구사항 (NFR)', icon: Cpu },
          { id: 'roadmap', label: '6. 개발 마일스톤', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* PRD Content Body */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-slate-800 space-y-8">
        
        {/* SECTION 1 */}
        {activeSection === 'summary' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                1. 프로젝트 개요 및 배경 (Overview & Objectives)
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  기존 현안 및 문제점 (Problem Statement)
                </h3>
                <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                  <li><strong>시간표 변경 실시간성 부족:</strong> 공업계 특성화고 특성상 실습실 이동수업, 교사 연수, 보강에 의한 시간표 수정이 빈번하나 정적 인쇄물은 이를 실시간으로 반영하지 못함.</li>
                  <li><strong>학과별 맞춤 시간표 식별 애로:</strong> 학년당 10개 학급이 서로 다른 전공(전기전자, AI소프트웨어, 컴퓨터소프트웨어, 스마트콘텐츠, 산업디자인)을 이수하므로 학급별 과목 구분이 매우 복잡함.</li>
                  <li><strong>모바일 접근성 부재:</strong> 학생들이 등교 전이나 쉬는 시간에 스마트폰으로 오늘 교시와 과목을 즉시 확인하기 어려움.</li>
                </ul>
              </div>

              <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 space-y-3">
                <h3 className="font-semibold text-indigo-950 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  프로젝트 목표 및 기대효과 (Expected Benefits)
                </h3>
                <ul className="text-sm text-indigo-900/80 space-y-2 list-disc list-inside">
                  <li><strong>공공데이터 실시간 자동화:</strong> 교육부 NEIS 오픈 API를 직통 연동하여 교육행정정보시스템에 입력된 정규 및 변동 시간표 데이터를 무결점 자동 수급.</li>
                  <li><strong>특성화고 맞춤형 UI:</strong> 전공 실습(NCS 실무) 과목과 일반 교과를 시각적으로 자동 분리하고, 학과별 전용 컬러 테마 제공.</li>
                  <li><strong>교직원·학생 1초 조회:</strong> 학년(1~3학년)과 반(1~10반) 원클릭 선택, 주간 뷰/일일 뷰/학년 일괄 비교 매트릭스 제공.</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 p-5 rounded-xl space-y-3">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500 text-xs font-bold text-white">타깃 페르소나</span>
                주요 사용자 그룹 및 사용 시나리오
              </h4>
              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="font-bold text-amber-300 mb-1">대진전자통신고 재학생</div>
                  <p className="text-slate-300">
                    아침 등교길 또는 쉬는 시간에 스마트폰으로 오늘 1~7교시 과목 확인 및 실습 교재·장비 지참 준비.
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="font-bold text-sky-300 mb-1">담당 교직원 및 실습 강사</div>
                  <p className="text-slate-300">
                    실습실 이동 수업, 학급별 교시 스케줄 및 학년 전체 학급의 동시간대 수업 배정 현황 일괄 비교.
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="font-bold text-emerald-300 mb-1">학부모 및 교육 행정가</div>
                  <p className="text-slate-300">
                    자녀 학년/반의 주간 수업 커리큘럼 및 전공 교과 이수 현황을 공식 NEIS 데이터로 투명하게 조회.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2 */}
        {activeSection === 'school' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                2. 학교 기본 정보 및 학과·학급 편성 명세
              </h2>
            </div>

            {/* School Info Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">항목</th>
                    <th className="py-3 px-4">시스템 식별값</th>
                    <th className="py-3 px-4">비고 / NEIS 파라미터 매핑</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">학교명 (공식)</td>
                    <td className="py-3 px-4">{SCHOOL_INFO.name} ({SCHOOL_INFO.engName})</td>
                    <td className="py-3 px-4 text-xs text-slate-500">대진전자통신고등학교</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">관할 시도교육청코드</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold">C10</span></td>
                    <td className="py-3 px-4 text-xs font-mono text-indigo-600">ATPT_OFCDC_SC_CODE=C10 (부산광역시교육청)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">행정표준학교코드</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold">7150597</span></td>
                    <td className="py-3 px-4 text-xs font-mono text-indigo-600">SD_SCHUL_CODE=7150597</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">학교 종류 / 구분</td>
                    <td className="py-3 px-4">{SCHOOL_INFO.schoolType}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{SCHOOL_INFO.businessType}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">소재지 / 연락처</td>
                    <td className="py-3 px-4">{SCHOOL_INFO.address}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">Tel: {SCHOOL_INFO.tel} / Fax: {SCHOOL_INFO.fax}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Department Breakdown */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                학과별 학급 배정 현황 (총 3개 학년, 30개 학급)
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(DEPARTMENTS).map((dept) => (
                  <div key={dept.name} className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${dept.bgLight}`}>
                        {dept.name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{dept.code}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {dept.description}
                    </p>
                    <div className="text-xs font-medium text-slate-800 pt-2 border-t border-slate-100">
                      {dept.name === 'AI소프트웨어과' ? (
                        <span className="text-purple-700 font-bold">1학년 4반, 5반</span>
                      ) : dept.name === '컴퓨터소프트웨어과' ? (
                        <span className="text-blue-700 font-bold">2~3학년 4반, 5반</span>
                      ) : dept.name === '전기전자과' ? (
                        <span className="text-sky-700 font-bold">1~3학년 1반, 2반, 3반</span>
                      ) : dept.name === '스마트콘텐츠과' ? (
                        <span className="text-emerald-700 font-bold">1~3학년 6반, 7반, 8반</span>
                      ) : (
                        <span className="text-rose-700 font-bold">1~3학년 9반, 10반</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Period Schedule */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">표준 일과 시간표 (7교시 운영)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs text-center">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">1교시</div>
                  <div className="text-slate-500">08:50 ~ 09:40</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">2교시</div>
                  <div className="text-slate-500">09:50 ~ 10:40</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">3교시</div>
                  <div className="text-slate-500">10:50 ~ 11:40</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">4교시</div>
                  <div className="text-slate-500">11:50 ~ 12:40</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">5교시</div>
                  <div className="text-slate-500">13:40 ~ 14:30</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">6교시</div>
                  <div className="text-slate-500">14:40 ~ 15:30</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="font-bold text-indigo-700">7교시</div>
                  <div className="text-slate-500">15:40 ~ 16:30</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3 */}
        {activeSection === 'api' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                3. 교육부 NEIS 오픈 API 연동 기술 명세
              </h2>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <div className="text-slate-400 mb-1">// NEIS 고등학교 시간표(hisTimetable) 호출 URL 형식</div>
              <span className="text-emerald-400">GET</span> https://open.neis.go.kr/hub/hisTimetable?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=C10&SD_SCHUL_CODE=7150597&GRADE=1&CLASS_NM=4&TI_FROM_YMD=20260928&TI_TO_YMD=20261002
            </div>

            {/* Parameter Spec */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">API 파라미터 매핑 정의서</h3>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">파라미터</th>
                      <th className="py-2.5 px-3">타입</th>
                      <th className="py-2.5 px-3">필수</th>
                      <th className="py-2.5 px-3">매핑 값 (대진전자통신고)</th>
                      <th className="py-2.5 px-3">설명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">ATPT_OFCDC_SC_CODE</td>
                      <td className="py-2.5 px-3 font-mono">String</td>
                      <td className="py-2.5 px-3 text-rose-600 font-bold">필수</td>
                      <td className="py-2.5 px-3 font-mono">C10</td>
                      <td className="py-2.5 px-3">부산광역시교육청 관할 코드</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">SD_SCHUL_CODE</td>
                      <td className="py-2.5 px-3 font-mono">String</td>
                      <td className="py-2.5 px-3 text-rose-600 font-bold">필수</td>
                      <td className="py-2.5 px-3 font-mono">7150597</td>
                      <td className="py-2.5 px-3">대진전자통신고등학교 행정표준코드</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">GRADE</td>
                      <td className="py-2.5 px-3 font-mono">String</td>
                      <td className="py-2.5 px-3 text-slate-600">선택</td>
                      <td className="py-2.5 px-3 font-mono">1, 2, 3</td>
                      <td className="py-2.5 px-3">조회할 학년</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">CLASS_NM</td>
                      <td className="py-2.5 px-3 font-mono">String</td>
                      <td className="py-2.5 px-3 text-slate-600">선택</td>
                      <td className="py-2.5 px-3 font-mono">1 ~ 10</td>
                      <td className="py-2.5 px-3">조회할 학급 (반)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">TI_FROM_YMD / TI_TO_YMD</td>
                      <td className="py-2.5 px-3 font-mono">String</td>
                      <td className="py-2.5 px-3 text-slate-600">선택</td>
                      <td className="py-2.5 px-3 font-mono">YYYYMMDD (주간 범위)</td>
                      <td className="py-2.5 px-3">월요일부터 금요일까지 5일 범위 지정</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">KEY</td>
                      <td className="py-2.5 px-3 font-mono">String</td>
                      <td className="py-2.5 px-3 text-slate-400">선택</td>
                      <td className="py-2.5 px-3 font-mono">(User Key or Open)</td>
                      <td className="py-2.5 px-3">사용자 발급 NEIS API Key (미입력 시 오픈 쿼리)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Error & Response Handling */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">NEIS 결과 코드 대응 규칙</h4>
                <div className="text-xs space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-100">
                    <span className="font-mono font-bold text-emerald-800">INFO-000</span>
                    <span className="text-emerald-700">정상 응답: 데이터 즉시 파싱 및 캐시 저장</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-100">
                    <span className="font-mono font-bold text-amber-800">INFO-200</span>
                    <span className="text-amber-700">해당 데이터 없음 (방학/휴일): 안내 메시지 & 권장 학기 데이터 안내</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-rose-50 border border-rose-100">
                    <span className="font-mono font-bold text-rose-800">ERROR-300 / 500</span>
                    <span className="text-rose-700">인증키 오류 / 서버 장애: 고정밀 학교 오프라인 데이터 자동 폴백</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">NCS 실무 과목 및 정제 규칙</h4>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <p>• <strong>별표(*) 접두사 정제:</strong> NEIS 데이터 상 <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">* SQL활용</code> 형태의 실무 과목을 <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">SQL활용</code>으로 정제.</p>
                  <p>• <strong>NCS 뱃지 자동 부여:</strong> 접두사 <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">*</code> 감지 시 [NCS 실무] 초록색 뱃지를 자동 생성하여 학생들의 실습 수업 인지성 향상.</p>
                  <p>• <strong>과목 유형별 컬러 코딩:</strong> 일반교과(파랑), NCS실무(초록), 전공이론(보라), 창의적체험활동(주황).</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4 */}
        {activeSection === 'functional' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                4. 기능 요구사항 명세서 (Functional Requirements)
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'FR-01',
                  title: '학년 및 학급 원클릭 선택 필터',
                  priority: 'Must Have',
                  input: '사용자 학년(1~3학년) 및 학급(1~10반) 버튼 클릭',
                  output: '선택된 학급의 소속 학과(전기전자과, AI소프트웨어과 등) 배지 노출 및 해당 시간표 즉시 렌더링',
                  rules: '1학년 4~5반은 AI소프트웨어과, 2~3학년 4~5반은 컴퓨터소프트웨어과로 자동 라벨링.'
                },
                {
                  id: 'FR-02',
                  title: '주간 시간표 그리드 매트릭스 뷰',
                  priority: 'Must Have',
                  input: '주간 탭 선택 및 주간 날짜 이동',
                  output: '월요일~금요일, 1~7교시 2차원 시간표 표 출력. 각 셀에 과목명, 교과구분 태그, 교시 시작/종료 시각 표기',
                  rules: '오늘 요일 및 현재 시간대에 해당하는 교시 셀에 실시간 스포트라이트 하이라이트 적용.'
                },
                {
                  id: 'FR-03',
                  title: '일일 집중 시간표 & 타임라인 뷰',
                  priority: 'Should Have',
                  input: '일일 탭 선택 및 날짜 선택',
                  output: '1~7교시 수직 타임라인 카드 뷰. 각 교시별 [종료], [진행 중], [다음 수업] 상태 실시간 표시',
                  rules: '실제 현재 시각(HH:mm)과 표준 수업 시간표(08:50~16:30)를 비교하여 상태 동적 계산.'
                },
                {
                  id: 'FR-04',
                  title: '학년 전체 10개 학급 일괄 비교 매트릭스 뷰',
                  priority: 'Should Have',
                  input: '전체 학급 비교 탭 선택',
                  output: '동일 학년의 1반부터 10반까지 10개 학급을 동일 날짜 기준 1~7교시 가로 비교 테이블 제공',
                  rules: '교사 및 행정 담당자가 반별 실습실 분산 및 이동 수업을 한눈에 점검할 수 있도록 구성.'
                },
                {
                  id: 'FR-05',
                  title: '주간 및 날짜 네비게이션 제어',
                  priority: 'Must Have',
                  input: '[이번 주], [이전 주], [다음 주] 버튼 클릭 또는 캘린더 날짜 선택',
                  output: '해당 주간의 월~금 날짜 자동 계산 및 NEIS API 동기화',
                  rules: '주말(토/일) 접속 시 자동으로 가장 가까운 평일(금요일 또는 다음 주 월요일)로 포커스.'
                },
                {
                  id: 'FR-06',
                  title: '내 반 기억하기 (Local Favorite)',
                  priority: 'Nice to Have',
                  input: '내 반 저장 별표 아이콘 클릭',
                  output: '브라우저 LocalStorage에 저장되어 다음 접속 시 해당 학년/반 시간표로 자동 초기화',
                  rules: '쿠키나 서버 계정 없이 클라이언트 로컬 저장소로 개인화 지원.'
                },
                {
                  id: 'FR-07',
                  title: '인쇄 최적화 및 이미지/클립보드 복사',
                  priority: 'Nice to Have',
                  input: '인쇄 또는 시간표 복사 버튼 클릭',
                  output: '불필요한 버튼/헤더가 숨겨진 깔끔한 A4 가로 인쇄 모드 실행',
                  rules: 'CSS @media print 규칙 적용.'
                },
                {
                  id: 'FR-08',
                  title: '실시간 캐싱 및 오프라인 폴백',
                  priority: 'Must Have',
                  input: '동일 주간/반 재조회 시',
                  output: '네트워크 재호출 없이 메모리 캐시로부터 10ms 내 초고속 렌더링',
                  rules: 'NEIS API 오류 발생 시에도 대진전자통신고 정규 커리큘럼 데이터셋을 가동하여 무중단 서비스 보장.'
                },
                {
                  id: 'FR-09',
                  title: '교과목 연계 과제 및 수행평가 관리 기능',
                  priority: 'Must Have',
                  input: '시간표 과목 셀 클릭 또는 상단 과제 등록 버튼 클릭',
                  output: '과제명, 마감일시, 중요도, 메모 등록/수정/삭제. 시간표 내 미완료 과제 뱃지 및 D-Day 인디케이터 제공',
                  rules: '브라우저 LocalStorage에 영구 보관되어 재방문 시 자동 유지되며, 완료 체크박스를 통한 실시간 진척도 관리.'
                },
              ].map((fr) => (
                <div key={fr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        {fr.id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{fr.title}</h4>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      fr.priority === 'Must Have' 
                        ? 'bg-rose-100 text-rose-800' 
                        : fr.priority === 'Should Have' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {fr.priority}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                    <div><span className="font-semibold text-slate-700">입력:</span> {fr.input}</div>
                    <div><span className="font-semibold text-slate-700">출력:</span> {fr.output}</div>
                    <div><span className="font-semibold text-slate-700">비즈니스 규칙:</span> {fr.rules}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5 */}
        {activeSection === 'nonfunctional' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                5. 비기능 요구사항 (Non-Functional Requirements)
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  [NFR-01] 반응 속도 및 성능 (Performance)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  NEIS API 응답 지연에 대비하여 첫 응답 수신 시 인메모리 맵 캐시에 보관하여 학년/반 재선택 시 50ms 미만 지연시간으로 UI를 전환합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  [NFR-02] 모바일 반응형 디자인 (Responsiveness)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  최소 해상도 360px 모바일 화면부터 4K 모니터까지 완벽 대응하며, 모바일에서는 좌우 스크롤 힌트 및 일일 집중 뷰를 제공하여 가독성을 극대화합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  [NFR-03] 접근성 및 가독성 (Accessibility)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  WCAG 2.1 AA 기준 4.5:1 이상의 텍스트 명도 대비를 준수하며, 교과 유형별(일반교과, NCS실무, 창체) 명확한 뱃지와 폰트 위계를 부여합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  [NFR-04] 신뢰성 및 가용성 (High Availability)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  NEIS 교육행정정보시스템의 야간 정기 점검 또는 방학 기간에도 서비스가 다운되지 않도록 학교 커리큘럼 기준 지능형 폴백 데이터셋을 상시 유지합니다.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6 */}
        {activeSection === 'roadmap' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                6. 개발 로드맵 및 릴리즈 마일스톤
              </h2>
            </div>

            <div className="relative border-l-2 border-indigo-200 pl-6 ml-3 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Phase 1 (MVP 구현 완료)</span>
                  <h4 className="font-bold text-slate-900 text-sm">NEIS 연계 학년/반 실시간 시간표 시스템 및 PRD 배포</h4>
                  <p className="text-xs text-slate-600">
                    대진전자통신고 1~3학년 10개 반 NEIS hisTimetable API 연동 완료, 주간 그리드 뷰, 일일 타임라인 뷰, 전체 학급 비교 뷰, 인쇄 기능 구현.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-100"></div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Phase 2 (차기 고도화 계획)</span>
                  <h4 className="font-bold text-slate-900 text-sm">NEIS 급식 식단표(mealServiceDietInfo) 연계 모듈</h4>
                  <p className="text-xs text-slate-600">
                    점심 시간표(12:40 ~ 13:40)와 연계하여 오늘의 점심 메뉴, 알레르기 유발 정보, 칼로리 영양 정보 실시간 조회 탭 확장.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100"></div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phase 3 (장기 로드맵)</span>
                  <h4 className="font-bold text-slate-900 text-sm">학사일정(SchoolSchedule) 연계 및 실습실 예약 알림</h4>
                  <p className="text-xs text-slate-600">
                    중간/기말고사 시험 시간표, 개교기념일, 축제 등 주요 학사일정 표기 및 PWA 기반 모바일 홈 화면 설치 위젯 지원.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
