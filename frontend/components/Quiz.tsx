import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, Trophy, ChevronRight, Lightbulb } from 'lucide-react';
import { DAILY_QUIZ, REWARD_POINTS, INITIAL_WALLET } from '../constants';

export const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(INITIAL_WALLET.todayQuizCompleted);

  const currentQuestion = DAILY_QUIZ[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isLastQuestion = currentQuestionIndex === DAILY_QUIZ.length - 1;

  const handleAnswer = (answer: string | boolean) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setTotalPoints(totalPoints + currentQuestion.points);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTotalPoints(0);
    setQuizCompleted(false);
  };

  // 퀴즈 완료 화면
  if (quizCompleted && currentQuestionIndex === DAILY_QUIZ.length - 1 && isAnswered) {
    return (
      <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>

          <h2 className="text-2xl font-black mb-2">오늘의 퀴즈 완료!</h2>
          <p className="text-slate-500 mb-6">수고하셨습니다</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-3xl font-black text-blue-600">{score}/{DAILY_QUIZ.length}</p>
                <p className="text-sm text-slate-500 font-medium">정답</p>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-3xl font-black text-green-600">+{totalPoints}P</p>
                <p className="text-sm text-slate-500 font-medium">획득 포인트</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
            >
              다시 풀기
            </button>
            <p className="text-xs text-slate-400">포인트는 1일 1회만 지급됩니다</p>
          </div>
        </div>
      </div>
    );
  }

  // 퀴즈 이미 완료 상태
  if (quizCompleted && !isAnswered) {
    return (
      <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-black mb-2">오늘의 퀴즈 완료!</h2>
          <p className="text-slate-500 mb-6">내일 새로운 퀴즈가 준비됩니다</p>

          <button
            onClick={handleRestart}
            className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
          >
            복습하기 (포인트 없음)
          </button>
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
            +{currentQuestion.points}P
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
                  {isCorrect ? `정답입니다! +${currentQuestion.points}P` : '아쉽네요!'}
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
