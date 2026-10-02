import React from 'react';
import { Assignment, TimetableSlot } from '../types/timetable';
import { CATEGORY_STYLES, DEPARTMENTS, STANDARD_PERIODS } from '../data/schoolData';
import { Clock, Calendar, CheckCircle2, Circle, PlayCircle, Hourglass, Plus, BookOpen } from 'lucide-react';

interface TimetableDailyProps {
  slots: TimetableSlot[];
  targetDate: string; // YYYYMMDD
  currentPeriod: number | null;
  department: string;
  grade: number;
  classNum: number;
  assignments: Assignment[];
  onAddAssignment: (subject: string, period?: number) => void;
  onToggleCompleteAssignment: (id: string) => void;
}

export const TimetableDaily: React.FC<TimetableDailyProps> = ({
  slots,
  targetDate,
  currentPeriod,
  department,
  grade,
  classNum,
  assignments,
  onAddAssignment,
  onToggleCompleteAssignment,
}) => {
  const deptInfo = DEPARTMENTS[department] || DEPARTMENTS['전기전자과'];

  // Match standard 7 periods
  const slotsMap = new Map<number, TimetableSlot>();
  slots.forEach(slot => {
    slotsMap.set(slot.period, slot);
  });

  const formattedDate = targetDate.length === 8
    ? `${targetDate.substring(0, 4)}년 ${targetDate.substring(4, 6)}월 ${targetDate.substring(6, 8)}일`
    : targetDate;

  // Helper to find assignments for subject
  const getSubjectAssignments = (subject: string) => {
    return assignments.filter(
      a => a.grade === grade && a.classNum === classNum && a.subject.toLowerCase() === subject.toLowerCase()
    );
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>일일 집중 시간표 타임라인</span>
          </div>
          <h2 className="text-xl font-black text-white">
            {grade}학년 {classNum}반 • {deptInfo.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {formattedDate} 기준 수업 일정 (총 {slots.length}개 교시 편성)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-amber-300" />
          <span>
            {currentPeriod ? (
              <span className="font-bold text-amber-300">현재 {currentPeriod}교시 진행 중</span>
            ) : (
              <span className="text-slate-300">현재 정규 수업 외 시간</span>
            )}
          </span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {STANDARD_PERIODS.map((period) => {
          const slot = slotsMap.get(period.period);
          const isCurrent = currentPeriod === period.period;
          const isPassed = currentPeriod !== null && currentPeriod > period.period;
          const isUpcoming = currentPeriod !== null && currentPeriod < period.period;

          const categoryStyle = slot ? (CATEGORY_STYLES[slot.category] || CATEGORY_STYLES.general) : CATEGORY_STYLES.other;
          const subjectAssignments = slot ? getSubjectAssignments(slot.subject) : [];
          const pendingAssignments = subjectAssignments.filter(a => !a.isCompleted);

          return (
            <React.Fragment key={period.period}>
              {/* Lunch separator */}
              {period.period === 5 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shadow-xs">
                  <span>🍱 점심시간 (12:40 ~ 13:40)</span>
                  <span className="text-amber-700 font-normal">급식실 이동 및 휴식</span>
                </div>
              )}

              <div
                className={`relative rounded-2xl p-4 transition border ${
                  isCurrent
                    ? 'ring-2 ring-indigo-600 bg-indigo-50/70 border-indigo-300 shadow-md'
                    : isPassed
                    ? 'bg-slate-50/80 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Period & Time */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-center shrink-0 ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isPassed
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      <span className="text-xs font-extrabold">{period.label}</span>
                      <span className="text-[10px] font-mono leading-none opacity-80 mt-0.5">{period.startTime}</span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${categoryStyle.badge}`}>
                          {categoryStyle.label}
                        </span>
                        {slot?.isNcs && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            NCS 실무
                          </span>
                        )}
                        {pendingAssignments.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white animate-pulse">
                            과제 {pendingAssignments.length}건
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {slot ? slot.subject : '수업 없음 / 자율'}
                      </h3>

                      <div className="text-xs text-slate-500 font-mono">
                        {period.startTime} ~ {period.endTime} ({slot?.department || deptInfo.shortName})
                      </div>

                      {/* Associated Assignments for this class period */}
                      {subjectAssignments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
                          {subjectAssignments.map((a) => (
                            <div
                              key={a.id}
                              className={`flex items-center justify-between p-2 rounded-lg text-xs border ${
                                a.isCompleted ? 'bg-slate-100 border-slate-200 line-through text-slate-400' : 'bg-rose-50/70 border-rose-200 text-slate-800 font-semibold'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <button
                                  onClick={() => onToggleCompleteAssignment(a.id)}
                                  className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                                >
                                  {a.isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4" />}
                                </button>
                                <span className="truncate">{a.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                                {a.dueDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Status badge & Add assignment */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div>
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold animate-pulse shadow-sm">
                          <PlayCircle className="w-3.5 h-3.5" />
                          진행 중
                        </span>
                      ) : isPassed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                          종료됨
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          <Hourglass className="w-3.5 h-3.5 text-slate-400" />
                          수업 예정
                        </span>
                      )}
                    </div>

                    {slot && (
                      <button
                        onClick={() => onAddAssignment(slot.subject, period.period)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-xs font-semibold transition cursor-pointer border border-slate-200 hover:border-indigo-200"
                        title="이 교시에 과제 등록"
                      >
                        <Plus className="w-3 h-3" />
                        <span>과제</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
