import { DepartmentInfo, PeriodInfo, SchoolClassInfo, SubjectCategory } from '../types/timetable';

export const SCHOOL_INFO = {
  name: '대진전자통신고등학교',
  engName: 'Daejin High School of Electronics & Communication',
  officeCode: 'C10',
  officeName: '부산광역시교육청',
  schoolCode: '7150597',
  schoolType: '고등학교 (특성화고, 사립)',
  businessType: '전문계 (공업계)',
  address: '부산광역시 금정구 수림로 92 (장전동)',
  postalCode: '46247',
  tel: '051-582-8100',
  fax: '051-582-8120',
  homepage: 'http://pdj.hs.kr',
  foundedDate: '1995-10-30',
};

export const DEPARTMENTS: Record<string, DepartmentInfo> = {
  '전기전자과': {
    name: '전기전자과',
    shortName: '전기전자',
    code: 'EE',
    color: '#0284c7', // Sky-600
    bgLight: 'bg-sky-50 text-sky-800 border-sky-200',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-700',
    description: '반도체, 제어계측, 전기설비, 전자회로 설계 등 전자·전기 핵심 인재 양성',
  },
  'AI소프트웨어과': {
    name: 'AI소프트웨어과',
    shortName: 'AI소프트',
    code: 'AI_SW',
    color: '#7c3aed', // Violet-600
    bgLight: 'bg-purple-50 text-purple-800 border-purple-200',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    description: '인공지능, 빅데이터, 머신러닝 및 최신 웹/앱 소프트웨어 프로그래밍 특화',
  },
  '컴퓨터소프트웨어과': {
    name: '컴퓨터소프트웨어과',
    shortName: '컴소과',
    code: 'CS_SW',
    color: '#2563eb', // Blue-600
    bgLight: 'bg-blue-50 text-blue-800 border-blue-200',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    description: '응용 소프트웨어 개발, 데이터베이스(SQL), 시스템 및 네트워크 프로그래밍',
  },
  '스마트콘텐츠과': {
    name: '스마트콘텐츠과',
    shortName: '스마트콘텐츠',
    code: 'SMART_CT',
    color: '#059669', // Emerald-600
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    description: '모바일 콘텐츠, 웹툰, 미디어 영상, 디지털 애니메이션 및 게임 콘텐츠 기획·제작',
  },
  '산업디자인과': {
    name: '산업디자인과',
    shortName: '산디과',
    code: 'IND_DESIGN',
    color: '#e11d48', // Rose-600
    bgLight: 'bg-rose-50 text-rose-800 border-rose-200',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    description: '제품 디자인, 시각 및 환경 디자인, 3D 모델링, UX/UI 디자인 실무',
  },
};

// 1~3학년 학급별 학과 매핑
export const GRADE_CLASSES_MAPPING: Record<number, SchoolClassInfo[]> = {
  1: [
    { grade: 1, classNum: 1, department: '전기전자과' },
    { grade: 1, classNum: 2, department: '전기전자과' },
    { grade: 1, classNum: 3, department: '전기전자과' },
    { grade: 1, classNum: 4, department: 'AI소프트웨어과' },
    { grade: 1, classNum: 5, department: 'AI소프트웨어과' },
    { grade: 1, classNum: 6, department: '스마트콘텐츠과' },
    { grade: 1, classNum: 7, department: '스마트콘텐츠과' },
    { grade: 1, classNum: 8, department: '스마트콘텐츠과' },
    { grade: 1, classNum: 9, department: '산업디자인과' },
    { grade: 1, classNum: 10, department: '산업디자인과' },
  ],
  2: [
    { grade: 2, classNum: 1, department: '전기전자과' },
    { grade: 2, classNum: 2, department: '전기전자과' },
    { grade: 2, classNum: 3, department: '전기전자과' },
    { grade: 2, classNum: 4, department: '컴퓨터소프트웨어과' },
    { grade: 2, classNum: 5, department: '컴퓨터소프트웨어과' },
    { grade: 2, classNum: 6, department: '스마트콘텐츠과' },
    { grade: 2, classNum: 7, department: '스마트콘텐츠과' },
    { grade: 2, classNum: 8, department: '스마트콘텐츠과' },
    { grade: 2, classNum: 9, department: '산업디자인과' },
    { grade: 2, classNum: 10, department: '산업디자인과' },
  ],
  3: [
    { grade: 3, classNum: 1, department: '전기전자과' },
    { grade: 3, classNum: 2, department: '전기전자과' },
    { grade: 3, classNum: 3, department: '전기전자과' },
    { grade: 3, classNum: 4, department: '컴퓨터소프트웨어과' },
    { grade: 3, classNum: 5, department: '컴퓨터소프트웨어과' },
    { grade: 3, classNum: 6, department: '스마트콘텐츠과' },
    { grade: 3, classNum: 7, department: '스마트콘텐츠과' },
    { grade: 3, classNum: 8, department: '스마트콘텐츠과' },
    { grade: 3, classNum: 9, department: '산업디자인과' },
    { grade: 3, classNum: 10, department: '산업디자인과' },
  ],
};

export const STANDARD_PERIODS: PeriodInfo[] = [
  { period: 1, label: '1교시', startTime: '08:50', endTime: '09:40' },
  { period: 2, label: '2교시', startTime: '09:50', endTime: '10:40' },
  { period: 3, label: '3교시', startTime: '10:50', endTime: '11:40' },
  { period: 4, label: '4교시', startTime: '11:50', endTime: '12:40' },
  { period: 5, label: '5교시', startTime: '13:40', endTime: '14:30' },
  { period: 6, label: '6교시', startTime: '14:40', endTime: '15:30' },
  { period: 7, label: '7교시', startTime: '15:40', endTime: '16:30' },
];

export function getDepartmentForClass(grade: number, classNum: number): string {
  const classes = GRADE_CLASSES_MAPPING[grade] || [];
  const found = classes.find(c => c.classNum === classNum);
  return found ? found.department : '공통';
}

export function categorizeSubject(subject: string): { category: SubjectCategory; cleanName: string; isNcs: boolean } {
  if (!subject) return { category: 'other', cleanName: '수업 없음', isNcs: false };

  const isNcs = subject.trim().startsWith('*');
  const cleanName = subject.replace(/^\*\s*/, '').trim();

  // 창체/활동
  if (['동아리활동', '자율활동', '진로활동', '봉사활동', '스포츠클럽'].some(k => cleanName.includes(k))) {
    return { category: 'creative', cleanName, isNcs };
  }

  // NCS 전문 실무
  if (isNcs || ['펌웨어', '회로', 'SQL', '애플리케이션', '디지털디자인', '스마트문화앱', '로봇', '공기압', '하드웨어'].some(k => cleanName.includes(k))) {
    return { category: 'ncs_practical', cleanName, isNcs: true };
  }

  // 전공 이론
  if (['프로그래밍', '컴퓨터 구조', '인공지능', '전기회로', '전자회로', '정보통신', '디자인일반', '조형', '시스템소프트웨어'].some(k => cleanName.includes(k))) {
    return { category: 'specialized', cleanName, isNcs };
  }

  // 일반 교과 (국영수사과체미음 등)
  return { category: 'general', cleanName, isNcs };
}

export const CATEGORY_STYLES: Record<SubjectCategory, { badge: string; bg: string; text: string; label: string }> = {
  ncs_practical: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bg: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300',
    text: 'text-emerald-950',
    label: 'NCS 실무',
  },
  specialized: {
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bg: 'bg-indigo-50/70 border-indigo-200 hover:border-indigo-300',
    text: 'text-indigo-950',
    label: '전공 이론',
  },
  general: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    bg: 'bg-blue-50/60 border-blue-200 hover:border-blue-300',
    text: 'text-blue-950',
    label: '일반 교과',
  },
  creative: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    bg: 'bg-amber-50/70 border-amber-200 hover:border-amber-300',
    text: 'text-amber-950',
    label: '창의적 체험활동',
  },
  other: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    bg: 'bg-slate-50 border-slate-200',
    text: 'text-slate-700',
    label: '기타',
  },
};
