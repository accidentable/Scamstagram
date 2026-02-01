import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, X, AlertTriangle, CheckCircle, Clock, Gift } from 'lucide-react';
import { analyzeScamMedia } from '../services/geminiService';
import { ScanResult } from '../types';
import { REWARD_POINTS, INITIAL_WALLET } from '../constants';

export const Report: React.FC = () => {
  const [media, setMedia] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [todayReported, setTodayReported] = useState(INITIAL_WALLET.todayReported);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type = file.type.split('/')[0];
      if (type !== 'image') {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setMimeType(file.type);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!media) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeScamMedia(media, mimeType);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("분석에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublish = () => {
    if (todayReported) {
      alert("오늘의 신고 보상은 이미 받으셨습니다. 내일 다시 시도해주세요!");
      return;
    }
    setTodayReported(true);
    alert(`신고가 접수되었습니다! +${REWARD_POINTS.REPORT}P 획득!`);
    setMedia(null);
    setResult(null);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-400 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'CRITICAL': return '매우 위험';
      case 'HIGH': return '위험';
      case 'MEDIUM': return '주의';
      default: return '안전';
    }
  };

  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col items-center">
      {/* 오늘의 신고 상태 */}
      <div className={`w-full max-w-md mb-6 p-4 rounded-2xl flex items-center gap-3 ${
        todayReported ? 'bg-slate-100' : 'bg-blue-50 border border-blue-200'
      }`}>
        {todayReported ? (
          <>
            <Clock className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <p className="font-bold text-slate-600">오늘의 신고 완료</p>
              <p className="text-xs text-slate-400">내일 다시 보상을 받을 수 있어요</p>
            </div>
          </>
        ) : (
          <>
            <Gift className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-bold text-blue-800">오늘의 신고 보상</p>
              <p className="text-xs text-blue-600">스캠을 신고하고 {REWARD_POINTS.REPORT}P 받으세요!</p>
            </div>
            <span className="text-lg font-black text-blue-600">+{REWARD_POINTS.REPORT}P</span>
          </>
        )}
      </div>

      {!media ? (
        <div className="w-full max-w-md">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-sm border-2 border-dashed border-slate-200 hover:border-blue-500 transition-colors group"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <Camera className="w-10 h-10 text-blue-600" />
            </div>

            <h2 className="text-2xl font-black text-black mb-2">스캠 신고하기</h2>
            <p className="text-slate-500 font-medium mb-6">
              스미싱 문자, 가짜 사이트, SNS 사기 광고 등<br />
              의심스러운 스크린샷을 업로드하세요
            </p>

            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold w-full hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              이미지 선택
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* 신고 가이드 */}
          <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3">신고 가이드</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>스미싱 문자: 의심스러운 링크가 포함된 문자 캡처</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>피싱 사이트: 가짜 로그인 페이지나 결제 페이지</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>SNS 사기: 투자 권유, 가짜 쇼핑몰 광고 등</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col">
          {/* 이미지 컨테이너 */}
          <div className="relative bg-white p-3 rounded-3xl shadow-lg mb-6">
            <div className="relative">
              <img
                src={media}
                alt="미리보기"
                className={`w-full h-auto max-h-[50vh] object-contain rounded-2xl bg-slate-100 ${
                  isAnalyzing ? 'blur-sm scale-105 transition-transform duration-1000' : ''
                }`}
              />

              {/* 분석 로딩 */}
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-2xl">
                  <div className="bg-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="font-bold text-sm">AI가 분석 중...</span>
                  </div>
                </div>
              )}

              {/* 닫기 버튼 */}
              {!isAnalyzing && !result && (
                <button
                  onClick={() => setMedia(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 분석 버튼 */}
          {!result && !isAnalyzing && (
            <button
              onClick={handleAnalyze}
              className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95"
            >
              AI 분석 시작
            </button>
          )}

          {/* 분석 결과 */}
          {result && (
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-full ${result.isScam ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {result.isScam ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-black text-xl leading-none">{result.isScam ? '스캠 의심' : '안전해 보임'}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block ${getRiskColor(result.riskLevel)}`}>
                    {getRiskLabel(result.riskLevel)} · 신뢰도 {result.confidenceScore}%
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{result.analysis}</p>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                {result.extractedTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePublish}
                  disabled={todayReported && result.isScam}
                  className={`py-3 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    todayReported
                      ? 'bg-slate-100 text-slate-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  {todayReported ? '신고 완료' : `신고 (+${REWARD_POINTS.REPORT}P)`}
                </button>
                <button
                  onClick={() => { setMedia(null); setResult(null); }}
                  className="py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200"
                >
                  다시 하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
