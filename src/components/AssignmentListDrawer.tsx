import React, { useState, useMemo } from 'react';
import { Assignment } from '../types/timetable';
import { 
  CheckCircle2, Circle, Clock, Calendar, AlertTriangle, 
  Trash2, Edit3, Plus, Filter, BookOpen, Check
} from 'lucide-react';

interface AssignmentListDrawerProps {
  assignments: Assignment[];
  onToggleComplete: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onOpenNewModal: (preset?: Partial<Assignment>) => void;
  currentGrade: number;
  currentClassNum: number;
}

export const AssignmentListDrawer: React.FC<AssignmentListDrawerProps> = ({
  assignments,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenNewModal,
  currentGrade,
  currentClassNum,
}) => {
  const [filterMode, setFilterMode] = useState<'pending' | 'today' | 'completed' | 'all'>('pending');
  const [scopeMode, setScopeMode] = useState<'current_class' | 'all_classes'>('current_class');

  // Format today YYYY-MM-DD
  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Filter assignments based on scope (current class vs all)
  const scopedAssignments = useMemo(() => {
    if (scopeMode === 'current_class') {
      return assignments.filter(
        a => a.grade === currentGrade && a.classNum === currentClassNum
      );
    }
    return assignments;
  }, [assignments, scopeMode, currentGrade, currentClassNum]);

  // Filter based on completion status & date
  const filteredAssignments = useMemo(() => {
    return scopedAssignments.filter(a => {
      if (filterMode === 'pending') return !a.isCompleted;
      if (filterMode === 'completed') return a.isCompleted;
      if (filterMode === 'today') return a.dueDate === todayStr && !a.isCompleted;
      return true;
    }).sort((a, b) => {
      // Uncompleted first, then by dueDate ascending
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [scopedAssignments, filterMode, todayStr]);

  const counts = useMemo(() => {
    return {
      all: scopedAssignments.length,
      pending: scopedAssignments.filter(a => !a.isCompleted).length,
      today: scopedAssignments.filter(a => a.dueDate === todayStr && !a.isCompleted).length,
      completed: scopedAssignments.filter(a => a.isCompleted).length,
    };
  }, [scopedAssignments, todayStr]);

  // Calculate D-Day
  const getDDay = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dueDateStr);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return { label: 'D-Day', color: 'bg-rose-500 text-white font-black' };
    if (diffDays === 1) return { label: 'D-1', color: 'bg-amber-500 text-white font-bold' };
    if (diffDays > 1) return { label: `D-${diffDays}`, color: 'bg-indigo-100 text-indigo-700 font-semibold' };
    return { label: `${Math.abs(diffDays)}일 지남`, color: 'bg-slate-200 text-slate-600' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>시간표 과제 & 수행평가 현황</span>
              {counts.pending > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">
                  {counts.pending}건 남음
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {currentGrade}학년 {currentClassNum}반 시간표 과목과 연계된 과제 메모장
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Scope switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setScopeMode('current_class')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                scopeMode === 'current_class' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              현재 반 ({currentGrade}-{currentClassNum})
            </button>
            <button
              onClick={() => setScopeMode('all_classes')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                scopeMode === 'all_classes' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              전체 반
            </button>
          </div>

          <button
            onClick={() => onOpenNewModal({ grade: currentGrade, classNum: currentClassNum })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>과제 추가</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'pending', label: '미완료', count: counts.pending },
          { id: 'today', label: '오늘 마감 🔥', count: counts.today },
          { id: 'all', label: '전체 목록', count: counts.all },
          { id: 'completed', label: '완료됨', count: counts.completed },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterMode(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterMode === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filterMode === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Assignment Items List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-slate-700">등록된 과제가 없습니다!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              시간표 셀의 과목 카드를 클릭하거나 상단의 '+ 과제 추가'로 과제를 등록해보세요.
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const dday = getDDay(assignment.dueDate);

            return (
              <div
                key={assignment.id}
                className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                  assignment.isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : assignment.priority === 'urgent'
                    ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                    : assignment.priority === 'high'
                    ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleComplete(assignment.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                    title={assignment.isCompleted ? '미완료로 변경' : '완료로 표시'}
                  >
                    {assignment.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                        {assignment.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {assignment.grade}학년 {assignment.classNum}반
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${dday.color}`}>
                        {dday.label}
                      </span>
                      {assignment.priority === 'urgent' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold">
                          긴급 / 수행평가
                        </span>
                      )}
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold truncate ${
                      assignment.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}>
                      {assignment.title}
                    </h4>

                    {assignment.description && (
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {assignment.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        마감: {assignment.dueDate}
                      </span>
                      {assignment.dueTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.dueTime}까지
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(assignment)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="과제 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('이 과제를 삭제하시겠습니까?')) {
                        onDelete(assignment.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="과제 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
