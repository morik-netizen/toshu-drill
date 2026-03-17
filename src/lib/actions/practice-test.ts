'use server'

import { prisma } from '../db'
import { auth } from '../auth'
import { isCorrectAnswer, calculatePoints } from '../scoring'
import { redirect } from 'next/navigation'
import type { QuestionDTO } from './quiz'

// ============================================
// 練習テスト設定
// ============================================

interface QuarterConfig {
  readonly quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  readonly label: string
  readonly unlockDate: string // ISO date
  readonly categoryCodes: readonly string[]
}

const QUARTER_CONFIGS: readonly QuarterConfig[] = [
  {
    quarter: 'Q1',
    label: '第1回〜第4回 (法の体系・免許・業務・施術所)',
    unlockDate: '2026-05-14',
    categoryCodes: ['1C', '1B', '4A', '4B', '4C', '4D', '4E'],
  },
  {
    quarter: 'Q2',
    label: '第5回〜第7回 (広告・罰則・医師法・医療法)',
    unlockDate: '2026-06-04',
    categoryCodes: [
      '1C', '1B', '4A', '4B', '4C', '4D', '4E',
      '4F', '4G', '5A', '5B', '5C', '5D', '5E', '5F',
    ],
  },
  {
    quarter: 'Q3',
    label: '第8回〜第11回 (社会福祉・保険・療養費)',
    unlockDate: '2026-07-02',
    categoryCodes: [
      '1C', '1B', '4A', '4B', '4C', '4D', '4E',
      '4F', '4G', '5A', '5B', '5C', '5D', '5E', '5F',
      '3B', '3A', '3D', '3C',
    ],
  },
  {
    quarter: 'Q4',
    label: '総合テスト (全カテゴリ)',
    unlockDate: '2026-07-09',
    categoryCodes: [
      '1C', '1B', '4A', '4B', '4C', '4D', '4E',
      '4F', '4G', '5A', '5B', '5C', '5D', '5E', '5F',
      '3B', '3A', '3D', '3C', '2A', '2B',
    ],
  },
]

const TOTAL_QUESTIONS = 40
const PASSING_RATE = 0.8

// ============================================
// 型定義
// ============================================

export interface PracticeTestInfo {
  readonly quarter: string
  readonly label: string
  readonly isUnlocked: boolean
  readonly unlockDate: string
  readonly bestScore: number | null
  readonly bestTotal: number | null
  readonly bestPassed: boolean | null
  readonly attempts: number
}

export interface PracticeTestSubmitResult {
  readonly score: number
  readonly total: number
  readonly passed: boolean
  readonly categoryBreakdown: readonly {
    readonly categoryCode: string
    readonly categoryName: string
    readonly correct: number
    readonly total: number
  }[]
}

// ============================================
// 認証ヘルパー
// ============================================

async function requireAuth(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  return session.user.id
}

// ============================================
// 練習テスト一覧を取得
// ============================================

export async function getPracticeTestList(): Promise<
  readonly PracticeTestInfo[]
> {
  const userId = await requireAuth()
  const today = new Date()

  // ユーザーの過去の受験結果
  const pastTests = await prisma.practiceTest.findMany({
    where: { userId },
    orderBy: { score: 'desc' },
  })

  return QUARTER_CONFIGS.map((config) => {
    const isUnlocked = today >= new Date(config.unlockDate)
    const testsForQuarter = pastTests.filter(
      (t) => t.quarter === config.quarter
    )
    const best = testsForQuarter[0] ?? null

    return {
      quarter: config.quarter,
      label: config.label,
      isUnlocked,
      unlockDate: config.unlockDate,
      bestScore: best?.score ?? null,
      bestTotal: best?.total ?? null,
      bestPassed: best?.passed ?? null,
      attempts: testsForQuarter.length,
    }
  })
}

// ============================================
// 練習テスト問題を取得 (カテゴリ比率に応じて40問)
// ============================================

export async function getPracticeTestQuestions(
  quarter: string
): Promise<readonly QuestionDTO[]> {
  await requireAuth()

  const config = QUARTER_CONFIGS.find((c) => c.quarter === quarter)
  if (!config) throw new Error(`Invalid quarter: ${quarter}`)

  const today = new Date()
  if (today < new Date(config.unlockDate)) {
    throw new Error('This practice test is not yet unlocked')
  }

  // 対象カテゴリの問題を取得
  const questions = await prisma.question.findMany({
    where: {
      categoryCode: { in: [...config.categoryCodes] },
      unlockDate: { lte: today },
    },
  })

  // カテゴリ比率に応じてランダム抽出
  const selected = selectByRatio(questions, TOTAL_QUESTIONS)

  return selected.map((q) => ({
    id: q.id,
    categoryCode: q.categoryCode,
    categoryName: q.categoryName,
    questionText: q.questionText,
    choiceA: q.choiceA,
    choiceB: q.choiceB,
    choiceC: q.choiceC,
    choiceD: q.choiceD,
    correctAnswers: q.correctAnswers,
    correctFeedback: q.correctFeedback,
    incorrectFeedback: q.incorrectFeedback,
    similarityGroup: q.similarityGroup,
  }))
}

// ============================================
// 練習テスト回答を一括送信
// ============================================

export async function submitPracticeTest(
  quarter: string,
  answers: readonly { questionId: number; selectedAnswer: string }[],
  startedAt: string
): Promise<PracticeTestSubmitResult> {
  const userId = await requireAuth()

  // 問題を取得
  const questionIds = answers.map((a) => a.questionId)
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  })
  const questionMap = new Map(questions.map((q) => [q.id, q]))

  // 採点
  let score = 0
  const categoryResults = new Map<
    string,
    { name: string; correct: number; total: number }
  >()

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId)
    if (!question) continue

    const correct = isCorrectAnswer(
      answer.selectedAnswer,
      question.correctAnswers
    )
    if (correct) score++

    const cat = categoryResults.get(question.categoryCode) ?? {
      name: question.categoryName,
      correct: 0,
      total: 0,
    }
    cat.total++
    if (correct) cat.correct++
    categoryResults.set(question.categoryCode, cat)

    // 回答履歴に記録
    await prisma.answerHistory.create({
      data: {
        userId,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect: correct,
        quality: correct ? 4 : 1,
        sessionType: 'practice_test',
      },
    })
  }

  const total = answers.length
  const passed = total > 0 && score / total >= PASSING_RATE

  // 練習テスト結果を保存
  await prisma.practiceTest.create({
    data: {
      userId,
      quarter,
      score,
      total,
      passed,
      startedAt: new Date(startedAt),
      completedAt: new Date(),
    },
  })

  const categoryBreakdown = Array.from(categoryResults.entries())
    .map(([code, data]) => ({
      categoryCode: code,
      categoryName: data.name,
      correct: data.correct,
      total: data.total,
    }))
    .sort((a, b) => a.categoryCode.localeCompare(b.categoryCode))

  return { score, total, passed, categoryBreakdown }
}

// ============================================
// ヘルパー: カテゴリ比率に応じて抽出
// ============================================

function selectByRatio<
  T extends { categoryCode: string },
>(items: T[], target: number): T[] {
  if (items.length <= target) return [...items]

  // カテゴリごとにグループ化
  const byCategory = new Map<string, T[]>()
  for (const item of items) {
    const arr = byCategory.get(item.categoryCode) ?? []
    byCategory.set(item.categoryCode, [...arr, item])
  }

  const result: T[] = []
  const totalAvailable = items.length

  // 比率に応じて各カテゴリから抽出
  for (const [, questions] of byCategory) {
    const ratio = questions.length / totalAvailable
    const count = Math.max(1, Math.round(ratio * target))
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    result.push(...shuffled.slice(0, count))
  }

  // 端数調整
  while (result.length > target) result.pop()

  if (result.length < target) {
    const remaining = items.filter(
      (item) => !result.includes(item)
    )
    const shuffled = [...remaining].sort(() => Math.random() - 0.5)
    for (const item of shuffled) {
      if (result.length >= target) break
      result.push(item)
    }
  }

  // シャッフル
  return result.sort(() => Math.random() - 0.5)
}
