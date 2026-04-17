import { formatDateYMD, buildPrintPayload } from '../format'
import type { LectureUnit } from '@/lib/lecture-content'
import type { PhotoWithUrl } from '@/lib/actions/lectures'

describe('formatDateYMD', () => {
  it('YYYY-MM-DD形式で返す', () => {
    expect(formatDateYMD(new Date('2026-04-17T12:34:56Z'))).toBe('2026-04-17')
  })

  it('月・日が1桁でもゼロパディング', () => {
    expect(formatDateYMD(new Date('2026-01-05T00:00:00Z'))).toBe('2026-01-05')
  })
})

describe('buildPrintPayload', () => {
  const mockUnits: readonly LectureUnit[] = [
    {
      unitId: 'U01',
      title: '第1回：基礎理論編',
      subtitle: 'サブ1',
      sections: [
        { title: '理論のみ', content: '<p>理論</p>' },
        {
          title: '写真あり',
          content: '<p>手順</p>',
          photoSlot: { slotId: 'U01-s1', label: 'ラベル1' },
        },
      ],
    },
    {
      unitId: 'U02',
      title: '第2回',
      subtitle: 'サブ2',
      sections: [
        {
          title: '写真未登録',
          content: '<p>本文</p>',
          photoSlot: { slotId: 'U02-s1', label: 'ラベル2' },
        },
      ],
    },
  ]

  const photosMap: Record<string, PhotoWithUrl[]> = {
    U01: [
      {
        id: 'p1',
        slotId: 'U01-s1',
        s3Key: 'key1',
        downloadUrl: 'https://example.com/p1.jpg',
      },
    ],
    U02: [],
  }

  const baseInput = {
    units: mockUnits,
    photosByUnit: photosMap,
    student: { name: '山田太郎', email: 'taro@example.com' },
    exportDate: new Date('2026-04-17T00:00:00Z'),
  }

  it('学生情報と出力日が含まれる', () => {
    const payload = buildPrintPayload(baseInput)
    expect(payload.student.name).toBe('山田太郎')
    expect(payload.student.email).toBe('taro@example.com')
    expect(payload.exportDate).toBe('2026-04-17')
  })

  it('指定ユニットIDだけに絞れる', () => {
    const payload = buildPrintPayload({ ...baseInput, unitIds: ['U01'] })
    expect(payload.units).toHaveLength(1)
    expect(payload.units[0]?.unitId).toBe('U01')
  })

  it('unitIds未指定なら全ユニット', () => {
    const payload = buildPrintPayload(baseInput)
    expect(payload.units).toHaveLength(2)
  })

  it('写真ありセクションに写真URLがマッピングされる', () => {
    const payload = buildPrintPayload(baseInput)
    const sec = payload.units[0]?.sections[1]
    expect(sec?.photo?.downloadUrl).toBe('https://example.com/p1.jpg')
    expect(sec?.photo?.failed).toBe(false)
  })

  it('photoSlotはあるが写真未登録 → photoはundefined', () => {
    const payload = buildPrintPayload(baseInput)
    const u2sec = payload.units[1]?.sections[0]
    expect(u2sec?.photoSlot).toEqual({ slotId: 'U02-s1', label: 'ラベル2' })
    expect(u2sec?.photo).toBeUndefined()
  })

  it('photoSlot無しの理論セクションも含まれる', () => {
    const payload = buildPrintPayload(baseInput)
    const sec = payload.units[0]?.sections[0]
    expect(sec?.title).toBe('理論のみ')
    expect(sec?.photoSlot).toBeUndefined()
    expect(sec?.contentHtml).toBe('<p>理論</p>')
  })

  it('presigned URL取得失敗（downloadUrlが空）の写真は failed:true', () => {
    const payload = buildPrintPayload({
      ...baseInput,
      photosByUnit: {
        U01: [{ id: 'p1', slotId: 'U01-s1', s3Key: 'key1', downloadUrl: '' }],
        U02: [],
      },
    })
    const sec = payload.units[0]?.sections[1]
    expect(sec?.photo?.failed).toBe(true)
  })

  it('存在しないunitIdは除外される', () => {
    const payload = buildPrintPayload({
      ...baseInput,
      unitIds: ['U01', 'U99'],
    })
    expect(payload.units).toHaveLength(1)
    expect(payload.units[0]?.unitId).toBe('U01')
  })
})
