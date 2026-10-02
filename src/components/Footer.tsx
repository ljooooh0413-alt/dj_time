import React from 'react';
import { SCHOOL_INFO } from '../data/schoolData';
import { School, ExternalLink, ShieldCheck, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <School className="w-4 h-4 text-indigo-400" />
              <span>대진전자통신고등학교 (Daejin High School of Electronics & Communication)</span>
            </div>
            <p className="text-slate-400 text-xs">
              부산광역시교육청 C10 • 행정표준코드 7150597 • 사립 특성화고등학교 (전문계)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://open.neis.go.kr/portal/data/service/selectServicePage.do?page=1&rows=10&sortColumn=&sortDirection=&infId=OPEN18620200826103326268120&infSeq=2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <span>교육부 NEIS 시간표 포털</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700">•</span>
            <a
              href={SCHOOL_INFO.homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <span>학교 공식 홈페이지</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="space-y-0.5">
            <div>주소: {SCHOOL_INFO.address} (우편번호 {SCHOOL_INFO.postalCode}) | 교무실/대표: {SCHOOL_INFO.tel} | 행정실/팩스: {SCHOOL_INFO.fax}</div>
            <div>본 시스템은 교육부 NEIS(나이스) 공공데이터포털 실시간 API를 활용하여 제작되었습니다.</div>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NEIS Open API Ver. 2.0 Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
