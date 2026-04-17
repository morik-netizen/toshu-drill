'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../db'
import { auth, isAllowedEmail } from '../auth'

export interface CategoryProgress {
  readonly categoryCode: string
  readonly categoryName: string
  readonly total: number
  readonly attempted: number
  readonly correctRate: number
}

export interface ProgressData {
  readonly totalQuestions: number
  readonly totalAttempted: number
  readonly totalMastered: number
  readonly coverageRate: number
  readonly categories: readonly CategoryProgress[]
}

export async function getProgress(): Promise<ProgressData> {
  const session = await auth()
  if (!session?.user?.id || !isAllowedEmail(session.user.email)) {
    redirect('/login')
  }

  const userId = session.user.id

  const allQuestions = await prisma.question.findMany({
    select: { id: true, categoryCode: true, categoryName: true },
  })
  const totalQuestions = allQuestions.length

  const records = await prisma.learningRecord.findMany({
    where: { userId },
    select: { questionId: true, totalAttempts: true, correctCount: true, status: true },
  })

  const totalAttempted = records.filter((r) => r.totalAttempts > 0).length
  const totalMastered = records.filter((r) => r.status === 'mastered').length
  const coverageRate = totalQuestions > 0 ? totalAttempted / totalQuestions : 0

  // カテゴリ別集計
  const categoryMap = new Map<string, { name: string; total: number; attempted: number; correct: number }>()
  for (const q of allQuestions) {
    const entry = categoryMap.get(q.categoryCode) ?? { name: q.categoryName, total: 0, attempted: 0, correct: 0 }
    entry.total++
    categoryMap.set(q.categoryCode, entry)
  }

  const recordByQuestion = new Map(records.map((r) => [r.questionId, r]))
  for (const q of allQuestions) {
    const entry = categoryMap.get(q.categoryCode)
    if (!entry) continue
    const rec = recordByQuestion.get(q.id)
    if (rec && rec.totalAttempts > 0) {
      entry.attempted++
      entry.correct += rec.correctCount
    }
  }

  const categories: CategoryProgress[] = Array.from(categoryMap.entries())
    .map(([code, entry]) => ({
      categoryCode: code,
      categoryName: entry.name,
      total: entry.total,
      attempted: entry.attempted,
      correctRate: entry.attempted > 0 ? entry.correct / entry.attempted : 0,
    }))
    .sort((a, b) => a.categoryCode.localeCompare(b.categoryCode))

  return {
    totalQuestions,
    totalAttempted,
    totalMastered,
    coverageRate,
    categories,
  }
}
