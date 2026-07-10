'use client'

import { isCorrectAnswer } from '@/lib/scoring'
import type { QuestionDTO } from '@/lib/actions/quiz'

interface MockTestReviewProps {
  readonly questions: readonly QuestionDTO[]
  readonly answers: readonly { questionId: number; selectedAnswer: string }[]
}

/**
 * 回答ラベル("A" / "B,D")を選択肢本文つきの表示文字列に変換する
 * ○×問題は A=○ / B=× のみ表示する
 */
function formatAnswer(answer: string, question: QuestionDTO): string {
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

/**
 * 模擬試験の結果画面で間違えた問題を一覧表示する
 */
export function MockTestReview({ questions, answers }: MockTestReviewProps) {
  const questionMap = new Map(questions.map((q) => [q.id, q]))

  const wrongAnswers = answers
    .map((a) => {
      const question = questionMap.get(a.questionId)
      if (!question) return null
      if (isCorrectAnswer(a.selectedAnswer, question.correctAnswers)) {
        return null
      }
      return { question, selectedAnswer: a.selectedAnswer }
    })
    .filter((w): w is NonNullable<typeof w> => w !== null)

  if (wrongAnswers.length === 0) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
        <div className="text-3xl mb-2">💯</div>
        <p className="text-sm font-medium">全問正解です！素晴らしい！</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium mb-3">
        間違えた問題（{wrongAnswers.length}問）
      </h3>
      <div className="flex flex-col gap-3">
        {wrongAnswers.map(({ question, selectedAnswer }) => (
          <div
            key={question.id}
            className="border border-gray-100 rounded-xl p-3"
          >
            <div className="text-xs bg-emerald-50 text-primary px-2 py-0.5 rounded inline-block mb-2">
              {question.categoryCode} {question.categoryName}
            </div>
            <p className="text-sm mb-2 leading-relaxed">
              {question.questionText}
            </p>
            <div className="text-xs mb-1">
              <span className="text-muted">あなた: </span>
              <span className="text-error font-medium">
                {formatAnswer(selectedAnswer, question)}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-muted">正解: </span>
              <span className="text-success font-medium">
                {formatAnswer(question.correctAnswers, question)}
              </span>
            </div>
            {question.incorrectFeedback && (
              <p className="text-xs text-muted mt-2 bg-gray-50 rounded p-2 leading-relaxed">
                {question.incorrectFeedback}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
