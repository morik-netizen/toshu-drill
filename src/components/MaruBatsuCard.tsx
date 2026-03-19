'use client'

import { useState, useCallback } from 'react'
import type { Question } from '@/lib/types'

interface MaruBatsuCardProps {
  readonly question: Question
  readonly current: number
  readonly total: number
  readonly onAnswer: (selectedAnswer: string) => void
}

export function MaruBatsuCard({
  question,
  current,
  total,
  onAnswer,
}: MaruBatsuCardProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = useCallback(
    (answer: string) => {
      if (submitted) return
      setSubmitted(true)
      onAnswer(answer)
    },
    [submitted, onAnswer]
  )

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center text-sm text-muted">
        <span>
          問題 {current}/{total}
        </span>
        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium">
          {question.categoryCode} {question.categoryName}
        </span>
      </div>

      <h2 className="text-lg font-medium leading-relaxed">
        {question.questionText}
      </h2>

      <div className="flex gap-4 mt-4 justify-center">
        <button
          onClick={() => handleSelect('A')}
          disabled={submitted}
          className={`w-32 h-32 rounded-2xl border-3 text-5xl font-bold transition-all flex items-center justify-center ${
            submitted
              ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              : 'border-teal-400 bg-teal-50 text-teal-600 hover:bg-teal-100 hover:border-teal-500 active:scale-95 shadow-sm'
          }`}
        >
          ○
        </button>
        <button
          onClick={() => handleSelect('B')}
          disabled={submitted}
          className={`w-32 h-32 rounded-2xl border-3 text-5xl font-bold transition-all flex items-center justify-center ${
            submitted
              ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              : 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-500 active:scale-95 shadow-sm'
          }`}
        >
          ×
        </button>
      </div>
    </div>
  )
}
