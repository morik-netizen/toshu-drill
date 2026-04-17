import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PrintSection } from '../PrintSection'
import type { PrintSectionPayload } from '@/lib/print/format'

describe('PrintSection', () => {
  it('photoSlot無し: HTMLコンテンツのみレンダリング', () => {
    const section: PrintSectionPayload = {
      title: '理論セクション',
      contentHtml: '<p>本文テスト</p>',
    }
    render(<PrintSection section={section} />)
    expect(screen.getByText('理論セクション')).toBeInTheDocument()
    expect(screen.getByText('本文テスト')).toBeInTheDocument()
    expect(screen.queryByText('未登録')).not.toBeInTheDocument()
  })

  it('photoSlotあり・写真あり: imgがレンダリングされる', () => {
    const section: PrintSectionPayload = {
      title: '写真セクション',
      contentHtml: '<p>手順</p>',
      photoSlot: { slotId: 's1', label: 'キャプションA' },
      photo: { downloadUrl: 'https://example.com/a.jpg', failed: false },
    }
    render(<PrintSection section={section} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/a.jpg')
    expect(screen.getByText('キャプションA')).toBeInTheDocument()
  })

  it('photoSlotあり・写真なし: 未登録プレースホルダ表示', () => {
    const section: PrintSectionPayload = {
      title: '未登録セクション',
      contentHtml: '<p>説明</p>',
      photoSlot: { slotId: 's2', label: 'キャプションB' },
    }
    render(<PrintSection section={section} />)
    expect(screen.getByText('未登録')).toBeInTheDocument()
    expect(screen.getByText('キャプションB')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('photoSlotあり・presigned URL失敗(failed:true): エラーメッセージ表示', () => {
    const section: PrintSectionPayload = {
      title: '失敗セクション',
      contentHtml: '<p>本文</p>',
      photoSlot: { slotId: 's3', label: 'ラベル' },
      photo: { downloadUrl: '', failed: true },
    }
    render(<PrintSection section={section} />)
    expect(screen.getByText(/写真を取得できませんでした/)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
