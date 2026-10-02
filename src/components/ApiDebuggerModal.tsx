import React, { useState } from 'react';
import { Database, Key, RefreshCw, Check, Copy, ExternalLink, Code } from 'lucide-react';

interface ApiDebuggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  lastUrl: string;
  lastResponse: any;
  isFallback: boolean;
}

export const ApiDebuggerModal: React.FC<ApiDebuggerModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  lastUrl,
  lastResponse,
  isFallback,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(lastResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                교육부 NEIS Open API 연동 정보 및 디버거
              </h3>
              <p className="text-xs text-slate-500">
                hisTimetable (고등학교 시간표) 실시간 호출 상태 및 페이로드 검사
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

        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold text-slate-600">데이터 수신 모드:</span>
            {isFallback ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                지능형 오프라인/캐시 폴백 가동 중
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                NEIS 오픈 API 실시간 직통 수신 (INFO-000)
              </span>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              NEIS Open API 사용자 인증키 (선택 사항)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="개인 발급 32자리 NEIS API KEY (비워두면 기본 공공 오픈 쿼리)"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-indigo-500 font-mono"
              />
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                저장
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              * NEIS 오픈데이터포털(open.neis.go.kr)에서 발급받은 개인 키가 있다면 일일 10만건 이상의 고용량 쿼리가 가능합니다.
            </p>
          </div>

          {/* Request URL */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700">최근 실행된 API 요청 엔드포인트:</span>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] break-all">
              {lastUrl || 'https://open.neis.go.kr/hub/hisTimetable?Type=json&ATPT_OFCDC_SC_CODE=C10&SD_SCHUL_CODE=7150597'}
            </div>
          </div>

          {/* Response Payload */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Code className="w-3.5 h-3.5" />
                수신된 NEIS 원본 JSON 데이터:
              </span>
              <button
                onClick={copyJson}
                className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? '복사됨' : 'JSON 복사'}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] max-h-52 overflow-y-auto">
              {JSON.stringify(lastResponse || { message: '아직 수신된 데이터가 없습니다.' }, null, 2)}
            </pre>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
        >
          닫기
        </button>
      </div>
    </div>
  );
};
