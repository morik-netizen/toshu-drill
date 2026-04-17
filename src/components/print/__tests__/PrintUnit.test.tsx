import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PrintUnit } from '../PrintUnit'
import type { PrintUnitPayload } from '@/lib/print/format'

describe('PrintUnit', () => {
  const unit: PrintUnitPayload = {
    unitId: 'U01',
    title: '第1回：基礎理論編',
    subtitle: '関節モビライゼーションの原理',
    sections: [
      { title: 'セクション1', contentHtml: '<p>A</p>' },
      { title: 'セクション2', contentHtml: '<p>B</p>' },
    ],
  }

  it('タイトル・サブタイトルをレンダリング', () => {
    const { container } = render(<PrintUnit unit={unit} isFirst={false} />)
    expect(screen.getByText(/第1回：基礎理論編/)).toBeInTheDocument()
    expect(screen.getByText('関節モビライゼーションの原理')).toBeInTheDocument()
    expect(container.querySelector('.print-unit')).toBeInTheDocument()
  })

  it('先頭以外はpage-break-before用クラスが付く', () => {
    const { container } = render(<PrintUnit unit={unit} isFirst={false} />)
    expect(container.querySelector('.print-unit.page-break-before')).toBeInTheDocument()
  })

  it('isFirst=trueのときpage-break-beforeクラスなし', () => {
    const { container } = render(<PrintUnit unit={unit} isFirst={true} />)
    expect(container.querySelector('.page-break-before')).not.toBeInTheDocument()
  })

  it('全セクションをレンダリング', () => {
    render(<PrintUnit unit={unit} isFirst={true} />)
    expect(screen.getByText('セクション1')).toBeInTheDocument()
    expect(screen.getByText('セクション2')).toBeInTheDocument()
  })
})
