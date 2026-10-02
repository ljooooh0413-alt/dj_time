import React, { useState } from 'react';
import { Assignment, TimetableSlot } from '../types/timetable';
import { CATEGORY_STYLES, DEPARTMENTS, STANDARD_PERIODS } from '../data/schoolData';
import { Sparkles, Clock, BookOpen, Info, CheckCircle2, Circle, Plus, AlertCircle } from 'lucide-react';

interface TimetableWeeklyProps {
  slots: TimetableSlot[];
  weekDays: { dateStr: string; dayName: string; formatted: string; isToday: boolean }[];
  currentPeriod: number | null;
  selectedDepartment: string;
  grade: number;
  classNum: number;
  assignments: Assignment[];
  onAddAssignmentForSubject: (subject: string, period?: number, date?: string) => void;
  onToggleCompleteAssignment: (id: string) => void;
}

export const TimetableWeekly: React.FC<TimetableWeeklyProps> = ({
  slots,
  weekDays,
  currentPeriod,
  selectedDepartment,
  grade,
  classNum,
  assignments,
  onAddAssignmentForSubject,
  onToggleCompleteAssignment,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);

  // Group slots by day (YYYYMMDD) and period (1~7)
  const slotsByDayAndPeriod = React.useMemo(() => {
    const map = new Map<string, TimetableSlot>();
    slots.forEach(slot => {
      const key = `${slot.date}_${slot.period}`;
      map.set(key, slot);
    });
    return map;
  }, [slots]);

  // Helper to find pending assignments for a subject
  const getSubjectAssignments = (subject: string) => {
    return assignments.filter(
      a => a.grade === grade && a.classNum === classNum && a.subject.toLowerCase() === subject.toLowerCase()
    );
  };

  const deptInfo = DEPARTMENTS[selectedDepartment] || DEPARTMENTS['전기전자과'];

  return (
    <div className="space-y-4">
      {/* Legend & Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">과목 범례:</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              NCS 실무 (실습)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              전공 이론
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              일반 교과
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              창의적 체험활동
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            셀 클릭 시 과제 등록/확인 가능
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="hidden sm:flex items-center gap-1 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>점심시간: 12:40 ~ 13:40</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left min-w-[720px]">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200">
              <th className="py-3 px-4 w-28 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">
                교시 / 시간
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.dateStr}
                  className={`py-3 px-4 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                    day.isToday
                      ? 'bg-indigo-50/90 text-indigo-950 font-black'
                      : 'text-slate-700 font-bold'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm flex items-center gap-1">
                      {day.dayName}요일
                      {day.isToday && (
                        <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                          오늘
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-slate-400 font-normal mt-0.5">
                      {day.formatted}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {STANDARD_PERIODS.map((period) => {
              const isCurrentActivePeriod = currentPeriod === period.period;

              return (
                <React.Fragment key={period.period}>
                  {/* Lunch break indicator after 4th period */}
                  {period.period === 5 && (
                    <tr className="bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/70 text-amber-900 border-y border-amber-200 text-xs">
                      <td colSpan={6} className="py-2.5 px-4 text-center font-bold tracking-wide">
                        🍱 점심시간 (12:40 ~ 13:40) & 급식 배식 시간
                      </td>
                    </tr>
                  )}

                  <tr className="hover:bg-slate-50/50 transition">
                    {/* Period Header */}
                    <td className={`py-3 px-3 text-center border-r border-slate-200 ${
                      isCurrentActivePeriod ? 'bg-indigo-50/80 font-bold text-indigo-900' : 'bg-slate-50/40 text-slate-700'
                    }`}>
                      <div className="font-extrabold text-sm">{period.label}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {period.startTime}~{period.endTime}
                      </div>
                      {isCurrentActivePeriod && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white animate-pulse">
                          진행 중
                        </span>
                      )}
                    </td>

                    {/* Day Cells */}
                    {weekDays.map((day) => {
                      const key = `${day.dateStr}_${period.period}`;
                      const slot = slotsByDayAndPeriod.get(key);
                      const isCellActiveNow = day.isToday && isCurrentActivePeriod;

                      if (!slot) {
                        return (
                          <td
                            key={day.dateStr}
                            className={`p-2.5 text-center text-xs text-slate-400 border-r border-slate-200 last:border-r-0 ${
                              day.isToday ? 'bg-indigo-50/20' : ''
                            }`}
                          >
                            <span className="text-slate-300">-</span>
                          </td>
                        );
                      }

                      const categoryStyle = CATEGORY_STYLES[slot.category] || CATEGORY_STYLES.general;
                      const subjectAssignments = getSubjectAssignments(slot.subject);
                      const pendingCount = subjectAssignments.filter(a => !a.isCompleted).length;

                      return (
                        <td
                          key={day.dateStr}
                          className={`p-2.5 border-r border-slate-200 last:border-r-0 align-top transition-colors ${
                            isCellActiveNow ? 'ring-2 ring-indigo-500 bg-indigo-50/40' : day.isToday ? 'bg-indigo-50/15' : ''
                          }`}
                        >
                          <div
                            onClick={() => setSelectedSlot(slot)}
                            className={`group relative rounded-xl p-2.5 border transition cursor-pointer active:scale-98 shadow-xs ${categoryStyle.bg}`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${categoryStyle.badge}`}
                              >
                                {categoryStyle.label}
                              </span>
                              
                              <div className="flex items-center gap-1">
                                {slot.isNcs && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-1 rounded">
                                    NCS
                                  </span>
                                )}
                                {pendingCount > 0 && (
                                  <span
                                    className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs animate-bounce"
                                    title={`과제 ${pendingCount}건 진행 중`}
                                  >
                                    과제 {pendingCount}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className={`font-bold text-xs sm:text-sm tracking-tight leading-snug line-clamp-2 ${categoryStyle.text}`}>
                              {slot.subject}
                            </div>

                            <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500">
                              <span>{deptInfo.shortName}</span>
                              <span className="opacity-0 group-hover:opacity-100 text-indigo-600 font-semibold transition">
                                상세 / 과제 ↗
                              </span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Subject Detail & Assignment Modal */}
      {selectedSlot && (() => {
        const slotAssignments = getSubjectAssignments(selectedSlot.subject);
        const pendingList = slotAssignments.filter(a => !a.isCompleted);
        const completedList = slotAssignments.filter(a => a.isCompleted);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
            onClick={() => setSelectedSlot(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${CATEGORY_STYLES[selectedSlot.category].badge}`}>
                    {CATEGORY_STYLES[selectedSlot.category].label}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {selectedSlot.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Class Schedule Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">대상 학급</span>
                  <span className="font-bold text-slate-900">{grade}학년 {classNum}반 ({selectedSlot.department})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">수업 교시</span>
                  <span className="font-bold text-slate-900">{selectedSlot.period}교시 ({selectedSlot.timeRange})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">수업 일자</span>
                  <span className="font-bold text-slate-900">{selectedSlot.date} ({selectedSlot.dayOfWeek}요일)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">NEIS 원본 명칭</span>
                  <span className="font-mono text-indigo-700 font-semibold">{selectedSlot.originalSubject}</span>
                </div>
              </div>

              {/* Assignments Section for this subject */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>이 과목 등록 과제 ({slotAssignments.length}건)</span>
                  </h4>
                  <button
                    onClick={() => {
                      const subj = selectedSlot.subject;
                      const p = selectedSlot.period;
                      const d = selectedSlot.date;
                      setSelectedSlot(null);
                      onAddAssignmentForSubject(subj, p, d);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>과제 추가</span>
                  </button>
                </div>

                {slotAssignments.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                    등록된 과제가 없습니다. 과제 추가 버튼을 눌러 새 과제를 등록해 보세요!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {slotAssignments.map((a) => (
                      <div
                        key={a.id}
                        className={`p-3 rounded-xl border transition flex items-start justify-between gap-2 text-xs ${
                          a.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <button
                            onClick={() => onToggleCompleteAssignment(a.id)}
                            className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          >
                            {a.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <div className="space-y-0.5">
                            <div className={`font-bold ${a.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {a.title}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              마감: {a.dueDate} {a.dueTime}
                            </div>
                          </div>
                        </div>
                        {a.priority === 'urgent' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                            긴급
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedSlot(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
