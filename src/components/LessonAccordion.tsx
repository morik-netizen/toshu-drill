'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LessonItem {
  readonly lesson: number
  readonly title: string
  readonly isCurrent: boolean
  readonly totalQuestions: number
  readonly attempted: number
}

interface Props {
  readonly lessons: readonly LessonItem[]
}

export function LessonAccordion({ lessons }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  // 現在の授業回のサマリー
  const currentLesson = lessons.find((l) => l.isCurrent)
  const totalAttempted = lessons.reduce((s, l) => s + l.attempted, 0)
  const totalQuestions = lessons.reduce((s, l) => s + l.totalQuestions, 0)
  const overallPct = totalQuestions > 0 ? Math.round((totalAttempted / totalQuestions) * 100) : 0

  return (
    <section className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ヘッダー（タップで開閉） */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex justify-between items-center text-left"
      >
        <div>
          <h2 className="text-sm font-medium text-foreground">単元別に学習する</h2>
          {currentLesson && (
            <p className="text-xs text-primary mt-0.5">
              今週: 第{currentLesson.lesson === 10 ? '10-12' : currentLesson.lesson}回 {currentLesson.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{overallPct}%</span>
          <span className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* 展開コンテンツ */}
      {isOpen && (
        <div className="px-5 pb-4 flex flex-col gap-2">
          {lessons.map((lesson) => {
            const pct =
              lesson.totalQuestions > 0
                ? Math.round((lesson.attempted / lesson.totalQuestions) * 100)
                : 0
            const isComplete = pct === 100

            return (
              <div
                key={lesson.lesson}
                className={`rounded-lg p-3 ${
                  lesson.isCurrent
                    ? 'bg-blue-50 border border-primary'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className={`font-medium ${lesson.isCurrent ? 'text-primary' : ''}`}>
                    第{lesson.lesson === 10 ? '10-12' : lesson.lesson}回 {lesson.title}
                  </span>
                  <span className={isComplete ? 'text-green-600 font-medium' : 'text-muted'}>
                    {lesson.attempted}/{lesson.totalQuestions}
                    {isComplete && ' ✓'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isComplete ? 'bg-green-500' : 'bg-primary'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <Link
                    href={`/quiz?lesson=${lesson.lesson}`}
                    className="text-xs px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-hover active:scale-[0.98] transition-all"
                  >
                    この回を学習
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
