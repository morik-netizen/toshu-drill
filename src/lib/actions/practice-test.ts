'use server'

import { prisma } from '../db'
import { auth, isAllowedEmail, signOut } from '../auth'
import { isCorrectAnswer } from '../scoring'
import { redirect } from 'next/navigation'
import type { QuestionDTO } from './quiz'

// ============================================
// 模擬テスト設定
// ============================================

const TOTAL_QUESTIONS = 25
const PASSING_RATE = 0.6

// ============================================
// 型定義
// ============================================

export interface MockTestResult {
  readonly id: number
  readonly score: number
  readonly total: number
  readonly passed: boolean
  readonly startedAt: string
  readonly completedAt: string | null
}

export interface MockTestSubmitResult {
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
  if (!isAllowedEmail(session.user.email)) {
    await signOut()
    redirect('/login?error=AccessDenied')
  }
  return session.user.id
}

// ============================================
// 模擬テスト問題を取得 (全問題から25問ランダム)
// ============================================

export async function getMockTestQuestions(): Promise<readonly QuestionDTO[]> {
  await requireAuth()

  // 全問題を取得
  const allQuestions = await prisma.question.findMany()

  // ランダムに25問抽出
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, TOTAL_QUESTIONS)

  return selected.map((q) => ({
    id: q.id,
    questionType: q.questionType,
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
// 模擬テスト回答を一括送信
// ============================================

export async function submitMockTest(
  answers: readonly { questionId: number; selectedAnswer: string }[],
  startedAt: string
): Promise<MockTestSubmitResult> {
  // 入力バリデーション
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > 30) {
    throw new Error('不正なリクエストです')
  }
  for (const a of answers) {
    if (!Number.isInteger(a.questionId) || a.questionId <= 0) {
      throw new Error('不正なリクエストです')
    }
    if (!/^[A-D](,[A-D])*$/.test(a.selectedAnswer)) {
      throw new Error('不正なリクエストです')
    }
  }
  const parsedStartedAt = new Date(startedAt)
  if (isNaN(parsedStartedAt.getTime())) {
    throw new Error('不正なリクエストです')
  }

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
        sessionType: 'mock_test',
      },
    })
  }

  const total = answers.length
  const passed = total > 0 && score / total >= PASSING_RATE

  // 模擬テスト結果を保存
  await prisma.mockTest.create({
    data: {
      userId,
      score,
      total,
      passed,
      startedAt: parsedStartedAt,
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
// 模擬テスト履歴を取得
// ============================================

export async function getMockTestHistory(): Promise<readonly MockTestResult[]> {
  const userId = await requireAuth()

  const tests = await prisma.mockTest.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
  })

  return tests.map((t) => ({
    id: t.id,
    score: t.score,
    total: t.total,
    passed: t.passed,
    startedAt: t.startedAt.toISOString(),
    completedAt: t.completedAt?.toISOString() ?? null,
  }))
}
