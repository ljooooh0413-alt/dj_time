import React from 'react';
import { TimetableSlot } from '../types/timetable';
import { CATEGORY_STYLES, DEPARTMENTS, getDepartmentForClass, STANDARD_PERIODS } from '../data/schoolData';
import { Users, Calendar, Sparkles } from 'lucide-react';

interface TimetableGradeMatrixProps {
  matrixData: Record<number, TimetableSlot[]>;
  grade: number;
  dateStr: string;
  currentPeriod: number | null;
  onSelectClass: (classNum: number) => void;
}

export const TimetableGradeMatrix: React.FC<TimetableGradeMatrixProps> = ({
  matrixData,
  grade,
  dateStr,
  currentPeriod,
  onSelectClass,
}) => {
  const classesList = Array.from({ length: 10 }, (_, i) => i + 1);

  const formattedDate = dateStr.length === 8
    ? `${dateStr.substring(0, 4)}년 ${dateStr.substring(4, 6)}월 ${dateStr.substring(6, 8)}일`
    : dateStr;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold mb-0.5">
            <Users className="w-3.5 h-3.5" />
            <span>학년 전체 학급(1~10반) 실시간 비교 매트릭스</span>
          </div>
          <h2 className="text-lg font-black text-slate-900">
            대진전자통신고 {grade}학년 전체 시간표 현황
          </h2>
          <p className="text-xs text-slate-500">
            기준 일자: <strong className="text-slate-800">{formattedDate}</strong> • 각 반 헤더를 클릭하면 해당 반 주간 시간표로 이동합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">학과 구분:</span>
          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[11px]">전기전자 (1~3반)</span>
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[11px]">
            {grade === 1 ? 'AI소프트' : '컴소'} (4~5반)
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">스마트콘텐츠 (6~8반)</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[11px]">산디 (9~10반)</span>
        </div>
      </div>

      {/* Grid Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left min-w-[980px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-3 w-20 text-center text-xs font-bold text-slate-600 uppercase border-r border-slate-200 sticky left-0 bg-slate-50 z-10">
                교시
              </th>
              {classesList.map((cls) => {
                const dept = getDepartmentForClass(grade, cls);
                const deptInfo = DEPARTMENTS[dept] || DEPARTMENTS['전기전자과'];

                return (
                  <th
                    key={cls}
                    onClick={() => onSelectClass(cls)}
                    className="py-3 px-2 text-center border-r border-slate-200 last:border-r-0 hover:bg-slate-100/80 cursor-pointer transition"
                    title={`${grade}학년 ${cls}반 주간 시간표 조회`}
                  >
                    <div className="font-extrabold text-sm text-slate-900">
                      {cls}반
                    </div>
                    <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold border ${deptInfo.bgLight}`}>
                      {deptInfo.shortName}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {STANDARD_PERIODS.map((period) => {
              const isCurrentPeriod = currentPeriod === period.period;

              return (
                <tr
                  key={period.period}
                  className={`hover:bg-slate-50/60 transition ${
                    isCurrentPeriod ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {/* Period Sticky Column */}
                  <td className={`py-3 px-2 text-center border-r border-slate-200 sticky left-0 z-10 ${
                    isCurrentPeriod ? 'bg-indigo-100 text-indigo-950 font-black' : 'bg-slate-50 text-slate-700 font-bold'
                  }`}>
                    <div className="text-xs">{period.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{period.startTime}</div>
                    {isCurrentPeriod && (
                      <span className="text-[9px] font-bold text-indigo-600 block mt-0.5">NOW</span>
                    )}
                  </td>

                  {/* 10 Classes Columns */}
                  {classesList.map((cls) => {
                    const classSlots = matrixData[cls] || [];
                    const slot = classSlots.find(s => s.period === period.period);

                    if (!slot) {
                      return (
                        <td key={cls} className="p-2 text-center text-xs text-slate-300 border-r border-slate-200 last:border-r-0">
                          -
                        </td>
                      );
                    }

                    const categoryStyle = CATEGORY_STYLES[slot.category] || CATEGORY_STYLES.general;

                    return (
                      <td
                        key={cls}
                        className={`p-2 border-r border-slate-200 last:border-r-0 align-top ${
                          isCurrentPeriod ? 'bg-indigo-50/20' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-xl border text-xs transition shadow-xs ${categoryStyle.bg}`}>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${categoryStyle.badge}`}>
                              {categoryStyle.label}
                            </span>
                            {slot.isNcs && (
                              <span className="text-[9px] font-black text-emerald-700">
                                NCS
                              </span>
                            )}
                          </div>
                          <div className={`font-bold text-xs leading-tight line-clamp-2 ${categoryStyle.text}`}>
                            {slot.subject}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
