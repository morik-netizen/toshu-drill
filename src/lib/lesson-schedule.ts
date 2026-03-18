// ============================================
// 授業スケジュール定義
// 第1回(4/16) 〜 第15回(7/30), 5/7休校
// ============================================

export interface Lesson {
  readonly lesson: number
  readonly date: string // ISO date (Thursday)
  readonly title: string
  readonly categoryCodes: readonly string[]
  readonly type: 'lecture' | 'review' | 'practice_test' | 'final_exam'
}

export const LESSON_SCHEDULE: readonly Lesson[] = [
  { lesson: 1,  date: '2026-04-16', title: '法の体系・衛生法規の概要', categoryCodes: ['1C', '1B'], type: 'lecture' },
  { lesson: 2,  date: '2026-04-23', title: '柔道整復師の免許', categoryCodes: ['4A', '4B'], type: 'lecture' },
  { lesson: 3,  date: '2026-04-30', title: '柔道整復師の業務', categoryCodes: ['4C', '4D'], type: 'lecture' },
  { lesson: 4,  date: '2026-05-14', title: '施術所', categoryCodes: ['4E'], type: 'lecture' },
  { lesson: 5,  date: '2026-05-21', title: '広告・罰則', categoryCodes: ['4F', '4G'], type: 'lecture' },
  { lesson: 6,  date: '2026-05-28', title: '医師法・歯科医師法・保健師助産師看護師法', categoryCodes: ['5A', '5B', '5C', '5D', '5E'], type: 'lecture' },
  { lesson: 7,  date: '2026-06-04', title: '医療法', categoryCodes: ['5F'], type: 'lecture' },
  { lesson: 8,  date: '2026-06-11', title: '社会福祉', categoryCodes: ['3B'], type: 'lecture' },
  { lesson: 9,  date: '2026-06-18', title: '社会保険', categoryCodes: ['3A'], type: 'lecture' },
  { lesson: 10, date: '2026-06-25', title: '療養費', categoryCodes: ['3D'], type: 'lecture' },
  { lesson: 11, date: '2026-07-02', title: '介護保険', categoryCodes: ['3C'], type: 'lecture' },
  { lesson: 12, date: '2026-07-09', title: '医療安全・個人情報保護', categoryCodes: ['2A', '2B'], type: 'lecture' },
  { lesson: 13, date: '2026-07-16', title: '総復習', categoryCodes: [], type: 'review' },
  { lesson: 14, date: '2026-07-23', title: '総復習・試験対策', categoryCodes: [], type: 'review' },
  { lesson: 15, date: '2026-07-30', title: '終講試験', categoryCodes: [], type: 'final_exam' },
]

/**
 * 現在の授業回を取得する
 * 直近の過去の授業日を基準に、次の授業を「今週のおすすめ」とする
 */
export function getCurrentLesson(today: Date): number {
  const todayStr = today.toISOString().slice(0, 10)

  // まだ授業開始前
  if (todayStr < LESSON_SCHEDULE[0].date) return 1

  // 最終回以降
  const lastLesson = LESSON_SCHEDULE[LESSON_SCHEDULE.length - 1]
  if (todayStr >= lastLesson.date) return lastLesson.lesson

  // 直近の授業回を探す
  for (let i = LESSON_SCHEDULE.length - 1; i >= 0; i--) {
    if (todayStr >= LESSON_SCHEDULE[i].date) {
      return LESSON_SCHEDULE[i].lesson
    }
  }

  return 1
}

/**
 * 指定した授業回までの累積カテゴリコードを取得
 */
export function getCumulativeCategories(upToLesson: number): readonly string[] {
  const codes = new Set<string>()
  for (const lesson of LESSON_SCHEDULE) {
    if (lesson.lesson > upToLesson) break
    for (const code of lesson.categoryCodes) {
      codes.add(code)
    }
  }
  return Array.from(codes)
}
