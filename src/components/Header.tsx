import React, { useState, useEffect } from 'react';
import { School, Calendar, FileText, Database, Printer, Bookmark, Star, Clock, Sparkles } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface HeaderProps {
  activeTab: 'timetable' | 'prd';
  setActiveTab: (tab: 'timetable' | 'prd') => void;
  onOpenApiModal: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  grade: number;
  classNum: number;
  pendingAssignmentsCount: number;
  onOpenNewAssignment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiModal,
  isFavorite,
  onToggleFavorite,
  grade,
  classNum,
  pendingAssignmentsCount,
  onOpenNewAssignment,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const dayName = days[now.getDay()];
      setCurrentTime(`${year}.${month}.${date} (${dayName}) ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  대진전자통신고등학교
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  부산 C10 • 7150597
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>Daejin High School of Electronics & Communication</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline font-mono text-emerald-600 font-semibold">NEIS Live Timetable</span>
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('timetable')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>실시간 시간표</span>
            </button>
            <button
              onClick={() => setActiveTab('prd')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition cursor-pointer ${
                activeTab === 'prd'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>시스템 PRD 명세서</span>
            </button>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs">
            <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-mono text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={onOpenNewAssignment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold transition cursor-pointer active:scale-95"
              title="시간표 과제 추가"
            >
              <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
              <span>과제 등록</span>
              {pendingAssignmentsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {pendingAssignmentsCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleFavorite}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="현재 학년/반을 내 기본 반으로 저장"
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isFavorite ? '내 반 저장됨' : '내 반 저장'}</span>
            </button>

            <button
              onClick={onOpenApiModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition cursor-pointer"
              title="NEIS Open API 연동 정보"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">NEIS API</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer"
              title="시간표 인쇄 / PDF 저장"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">인쇄</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
