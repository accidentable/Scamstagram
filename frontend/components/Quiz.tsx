import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Trophy, ChevronRight, Lightbulb, Play, Gift, Lock } from 'lucide-react';
import { DAILY_QUIZ } from '../constants';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://scamkeep-api-932863380761.asia-northeast3.run.app/api/v1';
const QUIZ_POINTS = 50; // 퀴즈 완료 시 지급 포인트

export const Quiz: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [todayQuizDone, setTodayQuizDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // 오늘 퀴즈 완료 여부 확인
  useEffect(() => {
    const checkQuizStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE}/wallet/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTodayQuizDone(data.today_quiz_completed || false);
        }
      } catch (e) {
        console.error('Failed to check quiz status:', e);
      } finally {
        setLoading(false);
      }
    };
    checkQuizStatus();
  }, []);

  const currentQuestion = DAILY_QUIZ[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const isLastQuestion = currentQuestionIndex === DAILY_QUIZ.length - 1;

  const handleStartQuiz = () => {
    if (todayQuizDone) return;
    setQuizStarted(true);
  };

  const handleAnswer = (answer: string | boolean) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
      // 퀴즈 완료 시 포인트 지급 API 호출
      await awardQuizPoints();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const awardQuizPoints = async () => {
    const token = localStorage.getItem('token');
    if (!token || todayQuizDone) return;
    
    try {
      const res = await fetch(`${API_BASE}/wallet/quiz-reward`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setPointsAwarded(true);
        setTodayQuizDone(true);
      }
    } catch (e) {
      console.error('Failed to award quiz points:', e);
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // 퀴즈 시작 전 화면
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <HelpCircle className="w-12 h-12 text-white" />
          </div>

          <h2 className="text-2xl font-black mb-2">오늘의 스캠 퀴즈</h2>
          <p className="text-slate-500 mb-6">3문제를 모두 풀면 포인트를 받아요!</p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">3</p>
                <p className="text-sm text-slate-500 font-medium">문제</p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center">
                <p className="text-3xl font-black text-green-600">+{QUIZ_POINTS}P</p>
                <p className="text-sm text-slate-500 font-medium">완료 보상</p>
              </div>
            </div>
          </div>

          {todayQuizDone ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">오늘의 퀴즈 완료!</span>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                복습하기 (포인트 없음)
              </button>
              <p className="text-xs text-slate-400">내일 새로운 퀴즈가 준비됩니다</p>
            </div>
          ) : (
            <button
              onClick={handleStartQuiz}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              오늘의 퀴즈 풀기
            </button>
          )}
        </div>
      </div>
    );
  }

  // 퀴즈 완료 화면
  if (quizCompleted) {
    return (
      <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>

          <h2 className="text-2xl font-black mb-2">퀴즈 완료!</h2>
          <p className="text-slate-500 mb-6">수고하셨습니다 🎉</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">{score}/{DAILY_QUIZ.length}</p>
                <p className="text-sm text-slate-500 font-medium">정답</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Gift className="w-5 h-5 text-green-600" />
                  <p className="text-3xl font-black text-green-600">+{pointsAwarded ? QUIZ_POINTS : 0}P</p>
                </div>
                <p className="text-sm text-slate-500 font-medium">획득 포인트</p>
              </div>
            </div>
          </div>

          {pointsAwarded && (
            <div className="bg-green-50 text-green-700 rounded-xl p-3 mb-4 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">포인트가 지급되었습니다!</span>
            </div>
          )}

          <p className="text-xs text-slate-400">포인트는 하루 1회만 지급됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col">
      {/* 진행 상태 */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-500">
            문제 {currentQuestionIndex + 1} / {DAILY_QUIZ.length}
          </span>
          <span className="text-sm font-bold text-blue-600">
            +{QUIZ_POINTS}P
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / DAILY_QUIZ.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 퀴즈 카드 */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col">
        <div className="bg-white rounded-3xl p-6 shadow-lg flex-1 flex flex-col">
          {/* 질문 */}
          <div className="flex items-start gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* 답변 옵션 */}
          <div className="flex-1 flex flex-col gap-3">
            {currentQuestion.type === 'ox' ? (
              // OX 퀴즈
              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={isAnswered}
                  className={`flex-1 py-8 rounded-2xl font-black text-2xl transition-all ${
                    isAnswered
                      ? selectedAnswer === true
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : currentQuestion.correctAnswer === true
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-slate-100 text-slate-400'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-200'
                  }`}
                >
                  O
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  disabled={isAnswered}
                  className={`flex-1 py-8 rounded-2xl font-black text-2xl transition-all ${
                    isAnswered
                      ? selectedAnswer === false
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : currentQuestion.correctAnswer === false
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-slate-100 text-slate-400'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-2 border-orange-200'
                  }`}
                >
                  X
                </button>
              </div>
            ) : (
              // 객관식
              currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 ${
                    isAnswered
                      ? selectedAnswer === option
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : currentQuestion.correctAnswer === option
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-slate-100 text-slate-400'
                      : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isAnswered
                      ? selectedAnswer === option
                        ? 'bg-white/20 text-inherit'
                        : currentQuestion.correctAnswer === option
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  {option}
                </button>
              ))
            )}
          </div>

          {/* 정답 해설 */}
          {isAnswered && (
            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '정답입니다!' : '아쉽네요!'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 다음 버튼 */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="mt-4 w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {isLastQuestion ? '결과 보기' : '다음 문제'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
