'use server'

import { prisma } from '../db'
import { auth, isAllowedEmail, signOut } from '../auth'
import { redirect } from 'next/navigation'

// ============================================
// 型定義
// ============================================

export interface LeaderboardEntry {
  readonly rank: number
  readonly name: string
  readonly totalAttempted: number
  readonly totalMastered: number
  readonly coverageRate: number
  readonly isCurrentUser: boolean
}

export interface LeaderboardData {
  readonly totalQuestions: number
  readonly entries: readonly LeaderboardEntry[]
  readonly currentUserRank: number | null
}

// ============================================
// リーダーボード取得
// ============================================

export async function getLeaderboard(): Promise<LeaderboardData> {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }
  if (!isAllowedEmail(session.user.email)) {
    await signOut()
    redirect('/login?error=AccessDenied')
  }

  const currentUserId = session.user.id

  // 全問題数
  const totalQuestions = await prisma.question.count()

  // 全学生
  const students = await prisma.user.findMany({
    where: { role: 'student' },
    select: { id: true, name: true, email: true },
  })

  // 全学習記録
  const allRecords = await prisma.learningRecord.findMany({
    select: { userId: true, totalAttempts: true, status: true },
  })

  // ユーザーごとに集計
  const recordsByUser = new Map<string, typeof allRecords>()
  for (const r of allRecords) {
    const arr = recordsByUser.get(r.userId) ?? []
    arr.push(r)
    recordsByUser.set(r.userId, arr)
  }

  const unsorted = students.map((s) => {
    const records = recordsByUser.get(s.id) ?? []
    const attempted = records.filter((r) => r.totalAttempts > 0).length
    const mastered = records.filter((r) => r.status === 'mastered').length
    const coverageRate = totalQuestions > 0 ? attempted / totalQuestions : 0

    return {
      id: s.id,
      name: s.name ?? `匿名 #${students.indexOf(s) + 1}`,
      totalAttempted: attempted,
      totalMastered: mastered,
      coverageRate,
    }
  })

  // カバー率でソート（同率は定着数で決着）
  const sorted = unsorted.sort((a, b) => {
    if (b.coverageRate !== a.coverageRate) return b.coverageRate - a.coverageRate
    return b.totalMastered - a.totalMastered
  })

  let currentUserRank: number | null = null

  const entries: LeaderboardEntry[] = sorted.map((s, i) => {
    const rank = i + 1
    const isCurrentUser = s.id === currentUserId
    if (isCurrentUser) currentUserRank = rank

    return {
      rank,
      name: s.name,
      totalAttempted: s.totalAttempted,
      totalMastered: s.totalMastered,
      coverageRate: s.coverageRate,
      isCurrentUser,
    }
  })

  // 教員がリーダーボードを見た場合（ランク外）
  if (currentUserRank === null) {
    const teacherRecords = recordsByUser.get(currentUserId) ?? []
    const attempted = teacherRecords.filter((r) => r.totalAttempts > 0).length
    if (attempted > 0) {
      // 教員もエントリに含める（ランク外表示）
      currentUserRank = -1
    }
  }

  return { totalQuestions, entries, currentUserRank }
}
