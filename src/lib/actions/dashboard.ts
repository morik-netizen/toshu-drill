'use server'

import { prisma } from '../db'
import { auth, isAllowedEmail, signOut } from '../auth'
import { redirect } from 'next/navigation'

// ============================================
// 型定義
// ============================================

export interface StudentSummary {
  readonly id: string
  readonly name: string | null
  readonly email: string | null
  readonly totalAttempted: number
  readonly totalMastered: number
  readonly coverageRate: number
  readonly lastActiveAt: Date | null
  readonly isActive: boolean // 7日以内に学習
}

export interface PracticeTestOverview {
  readonly quarter: string
  readonly label: string
  readonly totalAttempts: number
  readonly uniqueStudents: number
  readonly passCount: number
  readonly passRate: number
  readonly avgScore: number
}

export interface WeakCategory {
  readonly categoryCode: string
  readonly categoryName: string
  readonly totalAnswers: number
  readonly correctCount: number
  readonly correctRate: number
}

export interface HardQuestion {
  readonly questionId: number
  readonly categoryCode: string
  readonly categoryName: string
  readonly questionText: string
  readonly totalAnswers: number
  readonly correctCount: number
  readonly correctRate: number
}

export interface DailyActivity {
  readonly date: string
  readonly activeUsers: number
  readonly totalAnswers: number
}

export interface DashboardData {
  readonly totalStudents: number
  readonly activeStudents: number
  readonly totalQuestions: number
  readonly students: readonly StudentSummary[]
  readonly practiceTests: readonly PracticeTestOverview[]
  readonly weakCategories: readonly WeakCategory[]
  readonly hardQuestions: readonly HardQuestion[]
  readonly dailyActivity: readonly DailyActivity[]
}

// ============================================
// 認証: 教員のみ
// ============================================

async function requireTeacher(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  if (!isAllowedEmail(session.user.email)) {
    await signOut()
    redirect('/login?error=AccessDenied')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (user?.role !== 'teacher') {
    redirect('/')
  }

  return session.user.id
}

// ============================================
// ダッシュボードデータ取得
// ============================================

export async function getDashboardData(): Promise<DashboardData> {
  await requireTeacher()

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)

  // 全問題
  const allQuestions = await prisma.question.findMany({
    select: { id: true, categoryCode: true, categoryName: true, questionText: true },
  })
  const totalQuestions = allQuestions.length

  // 全学生
  const allUsers = await prisma.user.findMany({
    where: { role: 'student' },
    select: { id: true, name: true, email: true },
  })
  const totalStudents = allUsers.length

  // 全学習記録
  const allRecords = await prisma.learningRecord.findMany({
    select: { userId: true, questionId: true, totalAttempts: true, correctCount: true, status: true },
  })

  // 全回答履歴
  const allAnswers = await prisma.answerHistory.findMany({
    select: { userId: true, questionId: true, isCorrect: true, answeredAt: true },
  })

  // ---- 学生一覧 + 進捗 ----
  const recordsByUser = new Map<string, typeof allRecords>()
  for (const r of allRecords) {
    const arr = recordsByUser.get(r.userId) ?? []
    arr.push(r)
    recordsByUser.set(r.userId, arr)
  }

  const lastActiveByUser = new Map<string, Date>()
  for (const a of allAnswers) {
    const current = lastActiveByUser.get(a.userId)
    if (!current || a.answeredAt > current) {
      lastActiveByUser.set(a.userId, a.answeredAt)
    }
  }

  const students: StudentSummary[] = allUsers.map((u) => {
    const records = recordsByUser.get(u.id) ?? []
    const attempted = records.filter((r) => r.totalAttempts > 0).length
    const mastered = records.filter((r) => r.status === 'mastered').length
    const lastActive = lastActiveByUser.get(u.id) ?? null

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      totalAttempted: attempted,
      totalMastered: mastered,
      coverageRate: totalQuestions > 0 ? attempted / totalQuestions : 0,
      lastActiveAt: lastActive,
      isActive: lastActive !== null && lastActive >= sevenDaysAgo,
    }
  })

  const activeStudents = students.filter((s) => s.isActive).length

  // ---- 模擬テスト合格状況 ----
  const allMockTests = await prisma.mockTest.findMany()

  const uniqueMockStudents = new Set(allMockTests.map((t) => t.userId)).size
  const mockPassCount = new Set(
    allMockTests.filter((t) => t.passed).map((t) => t.userId)
  ).size
  const mockAvgScore = allMockTests.length > 0
    ? allMockTests.reduce((sum, t) => sum + t.score, 0) / allMockTests.length
    : 0

  const practiceTests: PracticeTestOverview[] = [{
    quarter: 'mock',
    label: '模擬テスト',
    totalAttempts: allMockTests.length,
    uniqueStudents: uniqueMockStudents,
    passCount: mockPassCount,
    passRate: uniqueMockStudents > 0 ? mockPassCount / uniqueMockStudents : 0,
    avgScore: mockAvgScore,
  }]

  // ---- 正答率が低いカテゴリ ----
  const categoryStats = new Map<string, { name: string; total: number; correct: number }>()
  for (const a of allAnswers) {
    const q = allQuestions.find((qq) => qq.id === a.questionId)
    if (!q) continue
    const stat = categoryStats.get(q.categoryCode) ?? { name: q.categoryName, total: 0, correct: 0 }
    stat.total++
    if (a.isCorrect) stat.correct++
    categoryStats.set(q.categoryCode, stat)
  }

  const weakCategories: WeakCategory[] = Array.from(categoryStats.entries())
    .map(([code, stat]) => ({
      categoryCode: code,
      categoryName: stat.name,
      totalAnswers: stat.total,
      correctCount: stat.correct,
      correctRate: stat.total > 0 ? stat.correct / stat.total : 0,
    }))
    .sort((a, b) => a.correctRate - b.correctRate)

  // ---- 正答率が低い問題TOP20 ----
  const questionStats = new Map<number, { total: number; correct: number }>()
  for (const a of allAnswers) {
    const stat = questionStats.get(a.questionId) ?? { total: 0, correct: 0 }
    stat.total++
    if (a.isCorrect) stat.correct++
    questionStats.set(a.questionId, stat)
  }

  const hardQuestions: HardQuestion[] = Array.from(questionStats.entries())
    .filter(([, stat]) => stat.total >= 3) // 最低3回以上回答がある問題
    .map(([qid, stat]) => {
      const q = allQuestions.find((qq) => qq.id === qid)
      return {
        questionId: qid,
        categoryCode: q?.categoryCode ?? '',
        categoryName: q?.categoryName ?? '',
        questionText: q?.questionText ?? '',
        totalAnswers: stat.total,
        correctCount: stat.correct,
        correctRate: stat.total > 0 ? stat.correct / stat.total : 0,
      }
    })
    .sort((a, b) => a.correctRate - b.correctRate)
    .slice(0, 20)

  // ---- 日別アクティブユーザー数 (過去30日) ----
  const recentAnswers = allAnswers.filter((a) => a.answeredAt >= thirtyDaysAgo)
  const dailyMap = new Map<string, { users: Set<string>; count: number }>()

  for (const a of recentAnswers) {
    const dateStr = a.answeredAt.toISOString().slice(0, 10)
    const entry = dailyMap.get(dateStr) ?? { users: new Set(), count: 0 }
    entry.users.add(a.userId)
    entry.count++
    dailyMap.set(dateStr, entry)
  }

  const dailyActivity: DailyActivity[] = Array.from(dailyMap.entries())
    .map(([date, entry]) => ({
      date,
      activeUsers: entry.users.size,
      totalAnswers: entry.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalStudents,
    activeStudents,
    totalQuestions,
    students: students.sort((a, b) => b.coverageRate - a.coverageRate),
    practiceTests,
    weakCategories,
    hardQuestions,
    dailyActivity,
  }
}
