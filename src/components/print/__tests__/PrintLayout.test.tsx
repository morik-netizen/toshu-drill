import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PrintLayout } from '../PrintLayout'
import type { PrintPayload } from '@/lib/print/format'

describe('PrintLayout', () => {
  const payload: PrintPayload = {
    student: { name: '山田太郎', email: 'taro@example.com' },
    exportDate: '2026-04-17',
    units: [
      {
        unitId: 'U01',
        title: '第1回：基礎',
        subtitle: 'サブ1',
        sections: [{ title: 'A', contentHtml: '<p>a</p>' }],
      },
      {
        unitId: 'U02',
        title: '第2回',
        subtitle: 'サブ2',
        sections: [{ title: 'B', contentHtml: '<p>b</p>' }],
      },
    ],
  }

  it('学生名・メール・出力日を表示', () => {
    render(<PrintLayout payload={payload} />)
    expect(screen.getByText(/山田太郎/)).toBeInTheDocument()
    expect(screen.getByText(/taro@example.com/)).toBeInTheDocument()
    expect(screen.getByText(/2026-04-17/)).toBeInTheDocument()
  })

  it('全ユニットを表示', () => {
    render(<PrintLayout payload={payload} />)
    expect(screen.getAllByText(/第1回：基礎/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/第2回/).length).toBeGreaterThan(0)
  })

  it('学生名がnullでも落ちない', () => {
    const p: PrintPayload = {
      ...payload,
      student: { name: null, email: null },
    }
    render(<PrintLayout payload={p} />)
    expect(screen.getByText(/2026-04-17/)).toBeInTheDocument()
  })
})
