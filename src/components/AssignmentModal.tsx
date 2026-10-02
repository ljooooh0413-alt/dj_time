import React, { useState, useEffect } from 'react';
import { Assignment, AssignmentPriority } from '../types/timetable';
import { BookOpen, Calendar, Clock, AlertTriangle, Check, Trash2, X, Plus } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
  initialData?: Partial<Assignment>;
  availableSubjects?: string[];
  defaultGrade: number;
  defaultClassNum: number;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  availableSubjects = [],
  defaultGrade,
  defaultClassNum,
}) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('17:00');
  const [priority, setPriority] = useState<AssignmentPriority>('normal');
  const [grade, setGrade] = useState(defaultGrade);
  const [classNum, setClassNum] = useState(defaultClassNum);
  const [period, setPeriod] = useState<number | undefined>(undefined);

  // Set today's date formatted as YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (isOpen) {
      setSubject(initialData?.subject || availableSubjects[0] || '공통교과');
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setDueDate(initialData?.dueDate || getTodayStr());
      setDueTime(initialData?.dueTime || '17:00');
      setPriority(initialData?.priority || 'normal');
      setGrade(initialData?.grade || defaultGrade);
      setClassNum(initialData?.classNum || defaultClassNum);
      setPeriod(initialData?.period);
    }
  }, [isOpen, initialData, defaultGrade, defaultClassNum, availableSubjects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('과제 제목을 입력해 주세요.');
      return;
    }
    if (!subject.trim()) {
      alert('과목을 선택하거나 입력해 주세요.');
      return;
    }

    onSave(
      {
        grade,
        classNum,
        subject: subject.trim(),
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        isCompleted: initialData?.isCompleted ?? false,
        period,
      },
      initialData?.id
    );
    onClose();
  };

  const handleQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData?.id ? '시간표 과제 수정' : '새 시간표 과제 등록'}
              </h3>
              <p className="text-xs text-slate-500">
                {grade}학년 {classNum}반 시간표 연계 과제 및 수행평가
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Grade & Class Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">대상 학년</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500 bg-white"
              >
                <option value={1}>1학년</option>
                <option value={2}>2학년</option>
                <option value={3}>3학년</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">대상 학급</label>
              <select
                value={classNum}
                onChange={(e) => setClassNum(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500 bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}반</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              연계 과목명 <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 프로그래밍, 컴퓨터 구조, 공통수학1"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500"
                required
              />
              {availableSubjects.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 self-center">빠른 선택:</span>
                  {availableSubjects.slice(0, 6).map((subj) => (
                    <button
                      type="button"
                      key={subj}
                      onClick={() => setSubject(subj)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition cursor-pointer ${
                        subject === subj
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignment Title */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              과제 제목 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 파이썬 반복문 실습 과제 제출 및 보고서 작성"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500 font-medium"
              required
            />
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                마감 일자 <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500"
                required
              />
              <div className="flex gap-1 mt-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                >
                  오늘
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                >
                  내일
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(3)}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                >
                  +3일
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(7)}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                >
                  다음 주
                </button>
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                마감 시각
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">중요도 / 우선순위</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'normal', label: '보통', bg: 'hover:bg-slate-100', active: 'bg-slate-100 border-slate-400 text-slate-800' },
                { value: 'high', label: '중요 ⚠️', bg: 'hover:bg-amber-50', active: 'bg-amber-100 border-amber-400 text-amber-900 font-bold' },
                { value: 'urgent', label: '긴급 / 수행평가 🔥', bg: 'hover:bg-rose-50', active: 'bg-rose-100 border-rose-400 text-rose-900 font-bold' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setPriority(p.value as AssignmentPriority)}
                  className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                    priority === p.value ? p.active : 'border-slate-200 text-slate-600 ' + p.bg
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              상세 메모 / 준비물 / 제출 방식
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 교과서 p.54 문제 풀이 노트 지참, 실습 파일은 USB 또는 구글 클래스룸에 제출할 것"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {initialData?.id && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('이 과제를 삭제하시겠습니까?')) {
                    onDelete(initialData.id!);
                    onClose();
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold transition cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-sm transition active:scale-95 cursor-pointer"
              >
                {initialData?.id ? '수정 완료' : '과제 등록'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
