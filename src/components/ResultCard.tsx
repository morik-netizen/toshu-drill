'use client'

import type { AnswerResult } from '@/lib/types'

interface ResultCardProps {
  readonly result: AnswerResult
  readonly selectedAnswer: string
  readonly onNext: () => void
  readonly isLast: boolean
  readonly questionType?: 'four_choice' | 'true_false'
}

function formatAnswer(answer: string, questionType?: 'four_choice' | 'true_false'): string {
  if (questionType === 'true_false') {
    if (answer === 'A') return '○'
    if (answer === 'B') return '×'
  }
  return answer
}

export function ResultCard({
  result,
  selectedAnswer,
  onNext,
  isLast,
  questionType,
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

      {!result.isCorrect && (
        <div className="bg-gray-50 rounded-xl p-4 text-sm">
          <div className="text-muted mb-1">あなたの回答</div>
          <div className="font-medium text-error mb-3">{formatAnswer(selectedAnswer, questionType)}</div>
          <div className="text-muted mb-1">正解</div>
          <div className="font-medium text-success">
            {formatAnswer(result.correctAnswers, questionType)}
          </div>
        </div>
      )}

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
