'use client'

import { useState, useCallback } from 'react'
import type { Question } from '@/lib/types'

interface QuizCardProps {
  readonly question: Question
  readonly current: number
  readonly total: number
  readonly onAnswer: (selectedAnswer: string) => void
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D'] as const

export function QuizCard({
  question,
  current,
  total,
  onAnswer,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const choices = [
    question.choiceA,
    question.choiceB,
    question.choiceC,
    question.choiceD,
  ]

  const handleSelect = useCallback(
    (label: string) => {
      if (selected !== null) return // 選択済みなら無視
      setSelected(label)
      onAnswer(label)
    },
    [selected, onAnswer]
  )

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center text-sm text-muted">
        <span>
          問題 {current}/{total}
        </span>
        <span className="bg-blue-50 text-primary px-2 py-0.5 rounded text-xs font-medium">
          {question.categoryCode} {question.categoryName}
        </span>
      </div>

      <h2 className="text-lg font-medium leading-relaxed">
        {question.questionText}
      </h2>

      <div className="flex flex-col gap-3 mt-2">
        {choices.map((choice, idx) => {
          const label = CHOICE_LABELS[idx]
          const isSelected = selected === label
          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-blue-50'
                  : selected !== null
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white hover:border-primary hover:bg-blue-50 active:scale-[0.98]'
              }`}
            >
              <span className="font-semibold text-primary mr-2">{label}</span>
              <span>{choice}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
