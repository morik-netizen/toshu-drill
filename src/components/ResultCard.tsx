'use client'

import type { AnswerResult, Question } from '@/lib/types'

interface ResultCardProps {
  readonly result: AnswerResult
  readonly selectedAnswer: string
  readonly onNext: () => void
  readonly isLast: boolean
  readonly question: Question
}

/**
 * 回答ラベル("A" / "B,D")を選択肢本文つきの表示文字列に変換する
 * ○×問題は A=○ / B=× のみ表示する
 */
function formatAnswer(answer: string, question: Question): string {
  if (question.questionType === 'true_false') {
    if (answer === 'A') return '○'
    if (answer === 'B') return '×'
    return answer
  }

  const choiceMap: Record<string, string> = {
    A: question.choiceA,
    B: question.choiceB,
    C: question.choiceC,
    D: question.choiceD,
  }

  return answer
    .split(',')
    .map((label) => {
      const text = choiceMap[label]
      return text ? `${label}. ${text}` : label
    })
    .join(' / ')
}

export function ResultCard({
  result,
  selectedAnswer,
  onNext,
  isLast,
  question,
}: ResultCardProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div
        className={`text-center py-6 rounded-xl ${
          result.isCorrect ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        <div className="text-4xl mb-2">
          {result.isCorrect ? '⭕' : '❌'}
        </div>
        <div
          className={`text-xl font-bold ${
            result.isCorrect ? 'text-success' : 'text-error'
          }`}
        >
          {result.isCorrect ? '正解!' : '不正解'}
        </div>
        {result.isCorrect && (
          <div className="text-success text-sm mt-1">
            +{result.pointsEarned}pt
          </div>
        )}
      </div>

      {/* 問題文 (結果画面でも文脈を確認できるように表示) */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="text-xs text-muted mb-1">
          {question.categoryCode} {question.categoryName}
        </div>
        <p className="text-sm leading-relaxed">{question.questionText}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm">
        {!result.isCorrect && (
          <>
            <div className="text-muted mb-1">あなたの回答</div>
            <div className="font-medium text-error mb-3">
              {formatAnswer(selectedAnswer, question)}
            </div>
          </>
        )}
        <div className="text-muted mb-1">正解</div>
        <div className="font-medium text-success">
          {formatAnswer(result.correctAnswers, question)}
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4">
        <div className="text-sm font-medium text-primary mb-2">解説</div>
        <p className="text-sm leading-relaxed">{result.feedback}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover active:scale-[0.98] transition-all"
      >
        {isLast ? '結果を見る' : '次の問題へ →'}
      </button>
    </div>
  )
}
