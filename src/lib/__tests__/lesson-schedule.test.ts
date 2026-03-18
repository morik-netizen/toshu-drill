import {
  LESSON_SCHEDULE,
  getCurrentLesson,
  getCumulativeCategories,
} from '../lesson-schedule'

describe('LESSON_SCHEDULE', () => {
  it('13回の授業がある（第10-12回統合）', () => {
    expect(LESSON_SCHEDULE).toHaveLength(13)
  })

  it('第1回は4/16', () => {
    expect(LESSON_SCHEDULE[0].date).toBe('2026-04-16')
    expect(LESSON_SCHEDULE[0].lesson).toBe(1)
  })

  it('第15回は7/30', () => {
    const last = LESSON_SCHEDULE[LESSON_SCHEDULE.length - 1]
    expect(last.date).toBe('2026-07-30')
    expect(last.lesson).toBe(15)
  })

  it('5/7の授業はない（休校）', () => {
    const dates = LESSON_SCHEDULE.map((l) => l.date)
    expect(dates).not.toContain('2026-05-07')
  })

  it('第1回に2A, 2B（リスクマネジメント・個人情報保護）を含む', () => {
    const lesson1 = LESSON_SCHEDULE[0]
    expect(lesson1.categoryCodes).toContain('2A')
    expect(lesson1.categoryCodes).toContain('2B')
  })

  it('第9回に3C（介護保険）を含む', () => {
    const lesson9 = LESSON_SCHEDULE.find((l) => l.lesson === 9)
    expect(lesson9?.categoryCodes).toContain('3A')
    expect(lesson9?.categoryCodes).toContain('3C')
  })

  it('第10回に3D（療養費まとめ）を含む', () => {
    const lesson10 = LESSON_SCHEDULE.find((l) => l.lesson === 10)
    expect(lesson10?.categoryCodes).toContain('3D')
  })
})

describe('getCurrentLesson', () => {
  it('授業開始前 → 第1回', () => {
    expect(getCurrentLesson(new Date('2026-04-01'))).toBe(1)
  })

  it('第1回当日 → 第1回', () => {
    expect(getCurrentLesson(new Date('2026-04-16'))).toBe(1)
  })

  it('第1回と第2回の間 → 第1回', () => {
    expect(getCurrentLesson(new Date('2026-04-20'))).toBe(1)
  })

  it('第2回当日 → 第2回', () => {
    expect(getCurrentLesson(new Date('2026-04-23'))).toBe(2)
  })

  it('最終回以降 → 第15回', () => {
    expect(getCurrentLesson(new Date('2026-08-01'))).toBe(15)
  })
})

describe('getCumulativeCategories', () => {
  it('第1回まで → 1C, 1B, 2A, 2B', () => {
    const codes = getCumulativeCategories(1)
    expect(codes).toContain('1C')
    expect(codes).toContain('1B')
    expect(codes).toContain('2A')
    expect(codes).toContain('2B')
    expect(codes).toHaveLength(4)
  })

  it('第4回まで → 第1〜4回のカテゴリ累積', () => {
    const codes = getCumulativeCategories(4)
    expect(codes).toContain('1C')
    expect(codes).toContain('1B')
    expect(codes).toContain('2A')
    expect(codes).toContain('2B')
    expect(codes).toContain('4A')
    expect(codes).toContain('4B')
    expect(codes).toContain('4C')
    expect(codes).toContain('4D')
    expect(codes).toContain('4E')
    expect(codes).toHaveLength(9)
  })

  it('第10回まで → 全カテゴリ', () => {
    const codes = getCumulativeCategories(10)
    expect(codes.length).toBeGreaterThanOrEqual(20)
  })
})
