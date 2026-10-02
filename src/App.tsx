import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PrdViewer } from './components/PrdViewer';
import { TimetableWeekly } from './components/TimetableWeekly';
import { TimetableDaily } from './components/TimetableDaily';
import { TimetableGradeMatrix } from './components/TimetableGradeMatrix';
import { ApiDebuggerModal } from './components/ApiDebuggerModal';
import { AssignmentModal } from './components/AssignmentModal';
import { AssignmentListDrawer } from './components/AssignmentListDrawer';
import { 
  fetchNeisTimetable, 
  fetchGradeAllClassesForDate, 
  mapRowsToSlots 
} from './services/neisApi';
import { 
  DEPARTMENTS, 
  GRADE_CLASSES_MAPPING, 
  getDepartmentForClass, 
  STANDARD_PERIODS 
} from './data/schoolData';
import { Assignment, TimetableSlot } from './types/timetable';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sparkles, 
  RefreshCw, 
  LayoutGrid, 
  CalendarDays, 
  ListOrdered, 
  GraduationCap, 
  Building2, 
  CheckCircle,
  AlertCircle,
  BookOpen,
  Plus
} from 'lucide-react';

const DEFAULT_SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    grade: 1,
    classNum: 4,
    subject: '프로그래밍 기초',
    title: '파이썬 제어문(if, for, while) 실습 과제 및 코드 제출',
    description: '교과서 p.82~85 프로그래밍 연습문제 풀이 후 구글 클래스룸에 py 파일 업로드',
    dueDate: '2026-10-05',
    dueTime: '23:59',
    priority: 'high',
    isCompleted: false,
    createdAt: '2026-10-01',
    period: 1,
  },
  {
    id: 'asg-2',
    grade: 1,
    classNum: 4,
    subject: '인공지능 일반',
    title: '머신러닝 지도학습 분류 모델 조사 보고서',
    description: 'A4 2장 분량 조사 리포트 작성 및 다음 시간 발표 준비',
    dueDate: '2026-10-07',
    dueTime: '16:00',
    priority: 'urgent',
    isCompleted: false,
    createdAt: '2026-10-02',
    period: 5,
  },
  {
    id: 'asg-3',
    grade: 1,
    classNum: 4,
    subject: '공통수학1',
    title: '수학익힘책 대단원 종합문제 1~15번 풀이 노트',
    description: '오답 풀이 과정 반드시 정리할 것 (수행평가 10% 반영)',
    dueDate: '2026-10-06',
    dueTime: '08:50',
    priority: 'normal',
    isCompleted: true,
    createdAt: '2026-09-30',
    period: 3,
  }
];

export default function App() {
  // Navigation & View mode
  const [activeTab, setActiveTab] = useState<'timetable' | 'prd'>('timetable');
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'matrix'>('weekly');

  // Grade & Class
  const [grade, setGrade] = useState<number>(1);
  const [classNum, setClassNum] = useState<number>(4); // Default to AI Software / Computer Software

  // Date state (Defaults to current date)
  const [currentDateObj, setCurrentDateObj] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    if (day === 0) now.setDate(now.getDate() + 1); // Sunday -> Monday
    if (day === 6) now.setDate(now.getDate() + 2); // Saturday -> Monday
    return now;
  });

  // Search keyword for subjects
  const [searchQuery, setSearchQuery] = useState('');

  // Timetable data
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [matrixData, setMatrixData] = useState<Record<number, TimetableSlot[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Debugger modal & API Key
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('djhs_neis_api_key') || '');
  const [lastApiUrl, setLastApiUrl] = useState('');
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);

  // Assignments State & LocalStorage Persistence
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('djhs_timetable_assignments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved assignments:', e);
      }
    }
    return DEFAULT_SAMPLE_ASSIGNMENTS;
  });

  // Assignment Modal State
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>(undefined);
  const [assignmentModalPreset, setAssignmentModalPreset] = useState<Partial<Assignment> | undefined>(undefined);

  // Favorite Class
  const [favoriteClass, setFavoriteClass] = useState<{ grade: number; classNum: number } | null>(() => {
    const saved = localStorage.getItem('djhs_favorite_class');
    return saved ? JSON.parse(saved) : null;
  });

  // Save assignments to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('djhs_timetable_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Calculate Monday through Friday of the currently selected week
  const weekDays = useMemo(() => {
    const curr = new Date(currentDateObj);
    const day = curr.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(curr);
    monday.setDate(curr.getDate() + diffToMonday);

    const daysNames = ['월', '화', '수', '목', '금'];
    const today = new Date();
    const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

    return daysNames.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}${mm}${dd}`;

      return {
        dateStr,
        dayName,
        formatted: `${mm}.${dd}`,
        isToday: dateStr === todayStr,
      };
    });
  }, [currentDateObj]);

  const fromDateStr = weekDays[0].dateStr;
  const toDateStr = weekDays[4].dateStr;
  const targetDateStr = useMemo(() => {
    const yyyy = currentDateObj.getFullYear();
    const mm = String(currentDateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDateObj.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }, [currentDateObj]);

  // Determine current active period based on time of day
  const currentPeriod = useMemo(() => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    for (const p of STANDARD_PERIODS) {
      const [sh, sm] = p.startTime.split(':').map(Number);
      const [eh, em] = p.endTime.split(':').map(Number);
      const startMins = sh * 60 + sm;
      const endMins = eh * 60 + em;

      if (currentMins >= startMins && currentMins <= endMins) {
        return p.period;
      }
    }
    return null;
  }, []);

  // Department of currently selected class
  const currentDept = useMemo(() => {
    return getDepartmentForClass(grade, classNum);
  }, [grade, classNum]);

  const deptInfo = DEPARTMENTS[currentDept] || DEPARTMENTS['전기전자과'];

  // Available subjects for assignment quick selection
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    slots.forEach(s => {
      if (s.subject && s.subject !== '수업 없음') set.add(s.subject);
    });
    return Array.from(set);
  }, [slots]);

  // Fetch timetable data
  const loadTimetable = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const year = targetDateStr.substring(0, 4);

    try {
      if (viewMode === 'matrix') {
        const matrixResult = await fetchGradeAllClassesForDate(grade, targetDateStr, apiKey);
        setMatrixData(matrixResult);
        setIsFallback(false);
      } else {
        const result = await fetchNeisTimetable({
          year,
          grade,
          classNum,
          fromDate: fromDateStr,
          toDate: toDateStr,
          apiKey,
        });

        setIsFallback(result.isFallback);
        if (result.error) setErrorMsg(result.error);

        const mappedSlots = mapRowsToSlots(result.rows, grade, classNum);
        setSlots(mappedSlots);
        setLastApiResponse(result.rows);
        setLastApiUrl(`https://open.neis.go.kr/hub/hisTimetable?ATPT_OFCDC_SC_CODE=C10&SD_SCHUL_CODE=7150597&GRADE=${grade}&CLASS_NM=${classNum}&TI_FROM_YMD=${fromDateStr}&TI_TO_YMD=${toDateStr}`);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg('시간표 수신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [grade, classNum, fromDateStr, toDateStr, targetDateStr, viewMode, apiKey]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  // Week navigation
  const handlePrevWeek = () => {
    const next = new Date(currentDateObj);
    next.setDate(next.getDate() - 7);
    setCurrentDateObj(next);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDateObj);
    next.setDate(next.getDate() + 7);
    setCurrentDateObj(next);
  };

  const handleResetToToday = () => {
    setCurrentDateObj(new Date());
  };

  // Favorite toggle
  const isFavorite = favoriteClass?.grade === grade && favoriteClass?.classNum === classNum;
  const toggleFavorite = () => {
    if (isFavorite) {
      localStorage.removeItem('djhs_favorite_class');
      setFavoriteClass(null);
    } else {
      const fav = { grade, classNum };
      localStorage.setItem('djhs_favorite_class', JSON.stringify(fav));
      setFavoriteClass(fav);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('djhs_neis_api_key', key);
    setIsApiModalOpen(false);
    loadTimetable();
  };

  // Assignment CRUD
  const handleSaveAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      setAssignments(prev =>
        prev.map(a => (a.id === existingId ? { ...a, ...assignmentData } : a))
      );
    } else {
      const newAssignment: Assignment = {
        ...assignmentData,
        id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        createdAt: new Date().toISOString(),
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }
  };

  const handleToggleCompleteAssignment = (id: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === id ? { ...a, isCompleted: !a.isCompleted } : a))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleOpenNewAssignment = (preset?: Partial<Assignment>) => {
    setEditingAssignment(undefined);
    setAssignmentModalPreset(preset || { grade, classNum });
    setIsAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setAssignmentModalPreset(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleAddAssignmentForSubject = (subject: string, period?: number, date?: string) => {
    // Convert YYYYMMDD to YYYY-MM-DD
    let formattedDueDate = '';
    if (date && date.length === 8) {
      formattedDueDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    }
    handleOpenNewAssignment({
      subject,
      grade,
      classNum,
      period,
      dueDate: formattedDueDate,
    });
  };

  // Pending count for current class
  const pendingAssignmentsCount = useMemo(() => {
    return assignments.filter(a => a.grade === grade && a.classNum === classNum && !a.isCompleted).length;
  }, [assignments, grade, classNum]);

  // Filter slots if search query
  const filteredSlots = useMemo(() => {
    if (!searchQuery.trim()) return slots;
    const q = searchQuery.toLowerCase();
    return slots.filter(s => 
      s.subject.toLowerCase().includes(q) || 
      s.originalSubject.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  }, [slots, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        grade={grade}
        classNum={classNum}
        pendingAssignmentsCount={pendingAssignmentsCount}
        onOpenNewAssignment={() => handleOpenNewAssignment({ grade, classNum })}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: PRD DOCUMENTATION */}
        {activeTab === 'prd' && <PrdViewer />}

        {/* TAB 2: LIVE TIMETABLE SYSTEM */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            
            {/* Top Selection Bar: Grade & Class */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Grade Selector (1~3학년) */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 min-w-14">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    학년 선택:
                  </span>
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {[1, 2, 3].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          grade === g
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        {g}학년
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode Tabs (주간 / 일일 / 학년 전체) */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start lg:self-auto text-xs font-bold">
                  <button
                    onClick={() => setViewMode('weekly')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'weekly'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>주간 시간표</span>
                  </button>
                  <button
                    onClick={() => setViewMode('daily')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'daily'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                    <span>일일 타임라인</span>
                  </button>
                  <button
                    onClick={() => setViewMode('matrix')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'matrix'
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>학년 전체 비교 (1~10반)</span>
                  </button>
                </div>
              </div>

              {/* Class Selector (1~10반 with Department Badges) */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    학급 선택 ({grade}학년 1~10반):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">선택된 학과:</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${deptInfo.bgLight}`}>
                      {deptInfo.name} ({grade}학년 {classNum}반)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                  {(GRADE_CLASSES_MAPPING[grade] || []).map((cls) => {
                    const isSelected = classNum === cls.classNum;
                    const cDept = DEPARTMENTS[cls.department] || DEPARTMENTS['전기전자과'];

                    return (
                      <button
                        key={cls.classNum}
                        onClick={() => {
                          setClassNum(cls.classNum);
                          if (viewMode === 'matrix') setViewMode('weekly');
                        }}
                        className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-indigo-500 shadow-md'
                            : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="text-xs font-black">{cls.classNum}반</span>
                        <span
                          className={`text-[10px] font-bold mt-1 px-1.5 py-0.2 rounded border ${
                            isSelected ? 'bg-indigo-600 text-white border-indigo-400' : cDept.bgLight
                          }`}
                        >
                          {cDept.shortName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Date & Week Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevWeek}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title="이전 주"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-sm font-bold text-slate-900 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  <span>
                    {weekDays[0].formatted} ~ {weekDays[4].formatted} ({targetDateStr.substring(0, 4)}학년도)
                  </span>
                </div>

                <button
                  onClick={handleNextWeek}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title="다음 주"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleResetToToday}
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                >
                  오늘 / 이번 주
                </button>
              </div>

              {/* Subject Search / Filter & Add Assignment */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="과목명 빠른 검색 (예: 프로그래밍, 수학)"
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500 w-48 sm:w-60"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleOpenNewAssignment({ grade, classNum })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  title="새 과제 등록"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">과제 추가</span>
                </button>

                <button
                  onClick={loadTimetable}
                  disabled={isLoading}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer disabled:opacity-50"
                  title="새로고침"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Offline / Fallback Notice Banner if applicable */}
            {isFallback && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>안내:</strong> 해당 주간은 학사 일정(방학/휴업일) 또는 외부 NEIS 서버 점검 시간으로 대진전자통신고 <strong>정규 커리큘럼 기준 시간표</strong>를 표시 중입니다.
                  </span>
                </div>
                <button
                  onClick={() => setIsApiModalOpen(true)}
                  className="text-amber-800 underline font-bold hover:text-amber-950 shrink-0 ml-2 cursor-pointer"
                >
                  API 상태 확인
                </button>
              </div>
            )}

            {/* Main Timetable View Switch */}
            {isLoading ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <div className="text-sm font-bold text-slate-800">
                  교육부 NEIS 시간표 데이터 수신 중...
                </div>
                <p className="text-xs text-slate-400">
                  대진전자통신고 {grade}학년 {classNum}반 ({deptInfo.name}) 시간표를 불러오고 있습니다.
                </p>
              </div>
            ) : viewMode === 'weekly' ? (
              <TimetableWeekly
                slots={filteredSlots}
                weekDays={weekDays}
                currentPeriod={currentPeriod}
                selectedDepartment={currentDept}
                grade={grade}
                classNum={classNum}
                assignments={assignments}
                onAddAssignmentForSubject={handleAddAssignmentForSubject}
                onToggleCompleteAssignment={handleToggleCompleteAssignment}
              />
            ) : viewMode === 'daily' ? (
              <TimetableDaily
                slots={filteredSlots.filter(s => s.date === targetDateStr)}
                targetDate={targetDateStr}
                currentPeriod={currentPeriod}
                department={currentDept}
                grade={grade}
                classNum={classNum}
                assignments={assignments}
                onAddAssignment={(subj, p) => handleAddAssignmentForSubject(subj, p, targetDateStr)}
                onToggleCompleteAssignment={handleToggleCompleteAssignment}
              />
            ) : (
              <TimetableGradeMatrix
                matrixData={matrixData}
                grade={grade}
                dateStr={targetDateStr}
                currentPeriod={currentPeriod}
                onSelectClass={(selected) => {
                  setClassNum(selected);
                  setViewMode('weekly');
                }}
              />
            )}

            {/* Dedicated Assignment Manager Panel (Always accessible right under the timetable) */}
            <AssignmentListDrawer
              assignments={assignments}
              onToggleComplete={handleToggleCompleteAssignment}
              onEdit={handleEditAssignment}
              onDelete={handleDeleteAssignment}
              onOpenNewModal={handleOpenNewAssignment}
              currentGrade={grade}
              currentClassNum={classNum}
            />

          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Assignment Create / Edit Modal */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onSave={handleSaveAssignment}
        onDelete={handleDeleteAssignment}
        initialData={editingAssignment || assignmentModalPreset}
        availableSubjects={availableSubjects}
        defaultGrade={grade}
        defaultClassNum={classNum}
      />

      {/* NEIS API Debugger Modal */}
      <ApiDebuggerModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        lastUrl={lastApiUrl}
        lastResponse={lastApiResponse}
        isFallback={isFallback}
      />
    </div>
  );
}
