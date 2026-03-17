// ============================================
// 出題エンジン
// ============================================

import type { Question, LearningRecord, QuizSession, UserProgress } from './types'

/**
 * カバー率優先方式で出題する問題を選択する
 *
 * 1. 未挑戦の問題を優先
 * 2. SM-2の復習日が来た問題を追加
 * 3. 同一類似グループから1問まで
 * 4. 上限30問/日
 */
export function selectQuestions(
  availableQuestions: readonly Question[],
  learningRecords: readonly LearningRecord[],
  today: Date,
  maxQuestions: number
): QuizSession {
  const recordMap = new Map(learningRecords.map((r) => [r.questionId, r]))

  // mastered を除外
  const candidates = availableQuestions.filter((q) => {
    const record = recordMap.get(q.id)
    return !record || record.status !== 'mastered'
  })

  // 未挑戦
  const unattempted = candidates.filter((q) => !recordMap.has(q.id))

  // 復習対象 (nextReviewDate <= today)
  const reviewDue = candidates.filter((q) => {
    const record = recordMap.get(q.id)
    if (!record || !record.nextReviewDate) return false
    return record.nextReviewDate.getTime() <= today.getTime()
  })

  // 類似グループ制約を適用しながら選択
  const selected: Question[] = []
  const usedGroups = new Set<number>()

  const tryAdd = (q: Question): boolean => {
    if (selected.length >= maxQuestions) return false
    if (q.similarityGroup !== null) {
      if (usedGroups.has(q.similarityGroup)) return false
      usedGroups.add(q.similarityGroup)
    }
    selected.push(q)
    return true
  }

  // 未挑戦を優先
  let newCount = 0
  for (const q of unattempted) {
    if (tryAdd(q)) newCount++
  }

  // 復習問題を追加
  let reviewCount = 0
  for (const q of reviewDue) {
    // 未挑戦で既に追加済みの場合はスキップ
    if (selected.some((s) => s.id === q.id)) continue
    if (tryAdd(q)) reviewCount++
  }

  return { questions: selected, newCount, reviewCount }
}

/**
 * 今日の推奨問題数を計算する
 * 推奨量 = 未挑戦問題数 ÷ 次のテストまでの残日数 + SM-2復習問題数
 * 下限: 5問, 上限: 30問
 */
export function calculateRecommendedDaily(
  unatttemptedCount: number,
  daysUntilNextTest: number,
  reviewDueCount: number
): number {
  const daily =
    daysUntilNextTest > 0
      ? Math.ceil(unatttemptedCount / daysUntilNextTest) + reviewDueCount
      : reviewDueCount
  return Math.min(30, Math.max(5, daily))
}

/**
 * ユーザーの進捗情報を計算する
 */
export function calculateProgress(
  totalUnlocked: number,
  learningRecords: readonly LearningRecord[],
  totalPoints: number,
  weeklyActiveDays: number,
  daysUntilNextTest: number
): UserProgress {
  const attempted = learningRecords.filter((r) => r.totalAttempts > 0).length
  const mastered = learningRecords.filter((r) => r.status === 'mastered').length
  const coverageRate = totalUnlocked > 0 ? attempted / totalUnlocked : 0
  const reviewDueCount = 0 // simplified for now
  const recommendedDaily = calculateRecommendedDaily(
    totalUnlocked - attempted,
    daysUntilNextTest,
    reviewDueCount
  )

  return {
    totalQuestions: totalUnlocked,
    attempted,
    mastered,
    coverageRate,
    totalPoints,
    streakDays: weeklyActiveDays,
    recommendedDaily,
  }
}

/**
 * 解放済みの問題をフィルタリングする（授業進度連動）
 */
export function filterUnlockedQuestions(
  allQuestions: readonly Question[],
  today: Date
): readonly Question[] {
  return allQuestions.filter((q) => q.unlockDate.getTime() <= today.getTime())
}

/**
 * 練習テスト用に問題をカテゴリ比率に応じて抽出する
 */
export function selectPracticeTestQuestions(
  availableQuestions: readonly Question[],
  totalQuestions: number
): readonly Question[] {
  if (availableQuestions.length <= totalQuestions) {
    return availableQuestions
  }

  // カテゴリごとにグループ化
  const byCategory = new Map<string, Question[]>()
  for (const q of availableQuestions) {
    const existing = byCategory.get(q.categoryCode) ?? []
    byCategory.set(q.categoryCode, [...existing, q])
  }

  // 比率に応じて各カテゴリから抽出
  const result: Question[] = []
  const totalAvailable = availableQuestions.length

  for (const [, questions] of byCategory) {
    const ratio = questions.length / totalAvailable
    const count = Math.round(ratio * totalQuestions)
    // シャッフルして指定数を取得
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    result.push(...shuffled.slice(0, Math.max(1, count)))
  }

  // 端数調整: 多すぎたら削る、少なすぎたら追加
  while (result.length > totalQuestions) {
    result.pop()
  }
  if (result.length < totalQuestions) {
    const remaining = availableQuestions.filter(
      (q) => !result.some((r) => r.id === q.id)
    )
    const shuffledRemaining = [...remaining].sort(() => Math.random() - 0.5)
    for (const q of shuffledRemaining) {
      if (result.length >= totalQuestions) break
      result.push(q)
    }
  }

  return result
}
