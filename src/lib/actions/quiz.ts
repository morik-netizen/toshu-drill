'use server'

import { prisma } from '../db'
import { auth, isAllowedEmail, signOut } from '../auth'
import { isCorrectAnswer, calculatePoints } from '../scoring'
import { calculateSM2, evaluateQuality } from '../sm2'
import type { Quality } from '../types'
import { redirect } from 'next/navigation'
import { LESSON_SCHEDULE, getCurrentLesson } from '../lesson-schedule'

// ============================================
// 型定義 (Server Action用、Date→string変換済み)
// ============================================

export interface QuestionDTO {
  readonly id: number
  readonly categoryCode: string
  readonly categoryName: string
  readonly questionText: string
  readonly choiceA: string
  readonly choiceB: string
  readonly choiceC: string
  readonly choiceD: string
  readonly correctAnswers: string
  readonly correctFeedback: string | null
  readonly incorrectFeedback: string | null
  readonly similarityGroup: number | null
}

export interface SubmitAnswerResult {
  readonly isCorrect: boolean
  readonly correctAnswers: string
  readonly feedback: string
  readonly pointsEarned: number
  readonly newStatus: string
}

export interface LessonProgress {
  readonly lesson: number
  readonly date: string
  readonly title: string
  readonly type: string
  readonly isCurrent: boolean
  readonly totalQuestions: number
  readonly attempted: number
  readonly mastered: number
}

export interface HomeProgress {
  readonly totalUnlocked: number
  readonly attempted: number
  readonly mastered: number
  readonly coverageRate: number
  readonly totalPoints: number
  readonly streakDays: number
  readonly recommendedCount: number
  readonly reviewDueCount: number
  readonly unattemptedCount: number
  readonly categoryBreakdown: readonly CategoryProgress[]
  readonly lessonProgress: readonly LessonProgress[]
  readonly currentLesson: number
}

export interface CategoryProgress {
  readonly categoryCode: string
  readonly categoryName: string
  readonly total: number
  readonly attempted: number
  readonly mastered: number
}

// ============================================
// 認証ヘルパー
// ============================================

async function requireAuth(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  if (!isAllowedEmail(session.user.email)) {
    await signOut()
    redirect('/login?error=AccessDenied')
  }
  return session.user.id
}

// ============================================
// 出題: 解放済み問題をSM-2優先で取得
// ============================================

export async function getQuizQuestions(
  maxQuestions: number = 12,
  categoryCodes?: readonly string[]
): Promise<readonly QuestionDTO[]> {
  const userId = await requireAuth()
  const today = new Date()

  // 1. 問題を取得（カテゴリ指定がある場合はフィルタ）
  const allQuestions = await prisma.question.findMany({
    where: categoryCodes && categoryCodes.length > 0
      ? { categoryCode: { in: [...categoryCodes] } }
      : undefined,
    orderBy: { id: 'asc' },
  })

  // 2. ユーザーの学習記録を取得
  const records = await prisma.learningRecord.findMany({
    where: { userId },
  })

  const recordMap = new Map(records.map((r) => [r.questionId, r]))

  // 3. mastered を除外
  const candidates = allQuestions.filter((q) => {
    const record = recordMap.get(q.id)
    return !record || record.status !== 'mastered'
  })

  // 4. 未挑戦を優先
  const unattempted = candidates.filter((q) => !recordMap.has(q.id))

  // 5. 復習対象 (nextReviewDate <= today)
  const reviewDue = candidates.filter((q) => {
    const record = recordMap.get(q.id)
    if (!record || !record.nextReviewDate) return false
    return record.nextReviewDate.getTime() <= today.getTime()
  })

  // 6. 類似グループ制約を適用しながら選択
  const selected: typeof allQuestions = []
  const usedGroups = new Set<number>()

  const tryAdd = (q: (typeof allQuestions)[number]): boolean => {
    if (selected.length >= maxQuestions) return false
    if (q.similarityGroup !== null) {
      if (usedGroups.has(q.similarityGroup)) return false
      usedGroups.add(q.similarityGroup)
    }
    selected.push(q)
    return true
  }

  for (const q of unattempted) tryAdd(q)
  for (const q of reviewDue) {
    if (!selected.some((s) => s.id === q.id)) tryAdd(q)
  }

  // 7. DTO変換 (Date除去)
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
// 回答送信: 採点 + SM-2更新 + 履歴記録
// ============================================

export async function submitAnswer(
  questionId: number,
  selectedAnswer: string,
  responseTimeMs: number
): Promise<SubmitAnswerResult> {
  // 入力バリデーション
  if (!Number.isInteger(questionId) || questionId <= 0) {
    throw new Error('不正なリクエストです')
  }
  if (!/^[A-D](,[A-D])*$/.test(selectedAnswer)) {
    throw new Error('不正なリクエストです')
  }
  if (!Number.isFinite(responseTimeMs) || responseTimeMs < 0 || responseTimeMs > 600_000) {
    throw new Error('不正なリクエストです')
  }

  const userId = await requireAuth()

  // 1. 問題を取得
  const question = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
  })

  // 2. 採点
  const correct = isCorrectAnswer(selectedAnswer, question.correctAnswers)
  const points = calculatePoints(correct)
  const quality: Quality = evaluateQuality(correct)

  // 3. 既存の学習記録を取得 or 作成
  const existing = await prisma.learningRecord.findUnique({
    where: { userId_questionId: { userId, questionId } },
  })

  const previousEF = existing ? Number(existing.easinessFactor) : 2.5
  const previousInterval = existing?.intervalDays ?? 0
  const previousRepetitions = existing?.repetitions ?? 0

  // 4. SM-2計算
  const sm2 = calculateSM2(
    { quality, previousEF, previousInterval, previousRepetitions },
    new Date()
  )

  // 5. 学習記録を更新 (upsert)
  await prisma.learningRecord.upsert({
    where: { userId_questionId: { userId, questionId } },
    create: {
      userId,
      questionId,
      easinessFactor: sm2.easinessFactor,
      intervalDays: sm2.intervalDays,
      repetitions: sm2.repetitions,
      nextReviewDate: sm2.nextReviewDate,
      status: sm2.status,
      totalAttempts: 1,
      correctCount: correct ? 1 : 0,
      lastAnswer: selectedAnswer,
      lastQuality: quality,
      lastAttemptedAt: new Date(),
    },
    update: {
      easinessFactor: sm2.easinessFactor,
      intervalDays: sm2.intervalDays,
      repetitions: sm2.repetitions,
      nextReviewDate: sm2.nextReviewDate,
      status: sm2.status,
      totalAttempts: { increment: 1 },
      correctCount: correct ? { increment: 1 } : undefined,
      lastAnswer: selectedAnswer,
      lastQuality: quality,
      lastAttemptedAt: new Date(),
    },
  })

  // 6. 回答履歴を記録
  await prisma.answerHistory.create({
    data: {
      userId,
      questionId,
      selectedAnswer,
      isCorrect: correct,
      quality,
      responseTimeMs,
      sessionType: 'daily',
    },
  })

  return {
    isCorrect: correct,
    correctAnswers: question.correctAnswers,
    feedback: correct
      ? (question.correctFeedback ?? '正解です！')
      : (question.incorrectFeedback ?? '不正解です。'),
    pointsEarned: points,
    newStatus: sm2.status,
  }
}

// ============================================
// ホーム画面用の進捗データ取得
// ============================================

export async function getHomeProgress(): Promise<HomeProgress> {
  const userId = await requireAuth()
  const today = new Date()

  // 全問題数（全コンテンツ公開方式）
  const unlockedQuestions = await prisma.question.findMany({
    select: { id: true, categoryCode: true, categoryName: true },
  })
  const totalUnlocked = unlockedQuestions.length

  // 学習記録
  const records = await prisma.learningRecord.findMany({
    where: { userId },
  })

  const attempted = records.filter((r) => r.totalAttempts > 0).length
  const mastered = records.filter((r) => r.status === 'mastered').length
  const coverageRate = totalUnlocked > 0 ? attempted / totalUnlocked : 0

  // ポイント計算
  const correctAnswers = await prisma.answerHistory.count({
    where: { userId, isCorrect: true },
  })
  const totalPoints = correctAnswers * 10

  // 今週の学習日数
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const weeklyAnswers = await prisma.answerHistory.findMany({
    where: {
      userId,
      answeredAt: { gte: weekStart },
    },
    select: { answeredAt: true },
  })
  const uniqueDays = new Set(
    weeklyAnswers.map((a) => a.answeredAt.toISOString().slice(0, 10))
  )
  const streakDays = uniqueDays.size

  // 推奨問題数
  const reviewDueCount = records.filter(
    (r) => r.nextReviewDate && r.nextReviewDate.getTime() <= today.getTime()
  ).length
  const unattemptedCount = totalUnlocked - attempted
  const daysUntilNextTest = 30 // 簡易版
  const raw =
    daysUntilNextTest > 0
      ? Math.ceil(unattemptedCount / daysUntilNextTest) + reviewDueCount
      : reviewDueCount
  const recommendedCount = Math.min(30, Math.max(5, raw))

  // カテゴリ別進捗
  const recordMap = new Map(records.map((r) => [r.questionId, r]))
  const categoryMap = new Map<
    string,
    { name: string; total: number; attempted: number; mastered: number }
  >()

  for (const q of unlockedQuestions) {
    const cat = categoryMap.get(q.categoryCode) ?? {
      name: q.categoryName,
      total: 0,
      attempted: 0,
      mastered: 0,
    }
    cat.total++
    const record = recordMap.get(q.id)
    if (record && record.totalAttempts > 0) cat.attempted++
    if (record && record.status === 'mastered') cat.mastered++
    categoryMap.set(q.categoryCode, cat)
  }

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([code, data]) => ({
      categoryCode: code,
      categoryName: data.name,
      total: data.total,
      attempted: data.attempted,
      mastered: data.mastered,
    }))
    .sort((a, b) => a.categoryCode.localeCompare(b.categoryCode))

  // 授業回別進捗
  const currentLesson = getCurrentLesson(today)
  const lessonProgress: LessonProgress[] = LESSON_SCHEDULE
    .filter((l) => l.categoryCodes.length > 0)
    .map((l) => {
      let lessonTotal = 0
      let lessonAttempted = 0
      let lessonMastered = 0
      for (const q of unlockedQuestions) {
        if (l.categoryCodes.includes(q.categoryCode)) {
          lessonTotal++
          const record = recordMap.get(q.id)
          if (record && record.totalAttempts > 0) lessonAttempted++
          if (record && record.status === 'mastered') lessonMastered++
        }
      }
      return {
        lesson: l.lesson,
        date: l.date,
        title: l.title,
        type: l.type,
        isCurrent: l.lesson === currentLesson,
        totalQuestions: lessonTotal,
        attempted: lessonAttempted,
        mastered: lessonMastered,
      }
    })

  return {
    totalUnlocked,
    attempted,
    mastered,
    coverageRate,
    totalPoints,
    streakDays,
    recommendedCount,
    reviewDueCount,
    unattemptedCount,
    categoryBreakdown,
    lessonProgress,
    currentLesson,
  }
}

// ============================================
// 間違いノート: 不正解問題を取得
// ============================================

export async function getMistakes(): Promise<
  readonly {
    readonly questionId: number
    readonly categoryCode: string
    readonly categoryName: string
    readonly questionText: string
    readonly correctAnswers: string
    readonly incorrectFeedback: string | null
    readonly lastAnswer: string | null
    readonly totalAttempts: number
    readonly correctCount: number
  }[]
> {
  const userId = await requireAuth()

  const records = await prisma.learningRecord.findMany({
    where: { userId, totalAttempts: { gt: 0 } },
    include: { question: true },
    orderBy: { updatedAt: 'desc' },
  })

  // 間違えたことがあり、かつ直近3回連続正解していない問題
  return records
    .filter((r) => r.correctCount < r.totalAttempts && r.repetitions < 3)
    .map((r) => ({
      questionId: r.questionId,
      categoryCode: r.question.categoryCode,
      categoryName: r.question.categoryName,
      questionText: r.question.questionText,
      correctAnswers: r.question.correctAnswers,
      incorrectFeedback: r.question.incorrectFeedback,
      lastAnswer: r.lastAnswer,
      totalAttempts: r.totalAttempts,
      correctCount: r.correctCount,
    }))
}
