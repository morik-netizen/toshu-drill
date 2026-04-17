'use client'

import { useEffect, useState } from 'react'

interface PrintPageClientProps {
  autoprint: boolean
  children: React.ReactNode
}

export function PrintPageClient({ autoprint, children }: PrintPageClientProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!autoprint) return

    const images = Array.from(document.images)
    if (images.length === 0) {
      setReady(true)
      return
    }

    const timeout = window.setTimeout(() => setReady(true), 10000)

    const waitFor = images.map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true })
        img.addEventListener('error', () => resolve(), { once: true })
      })
    })

    Promise.all(waitFor).then(() => {
      window.clearTimeout(timeout)
      setReady(true)
    })

    return () => window.clearTimeout(timeout)
  }, [autoprint])

  useEffect(() => {
    if (ready && autoprint) {
      window.print()
    }
  }, [ready, autoprint])

  return (
    <>
      <div className="no-print sticky top-0 z-10 bg-emerald-50 border-b border-emerald-200 px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-xs text-emerald-800 leading-snug">
          ブラウザの印刷ダイアログで「PDFとして保存」を選んでください。
          {autoprint && !ready && '（画像の読み込みを待っています…）'}
        </p>
        <button
          onClick={() => window.print()}
          className="shrink-0 bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded hover:bg-emerald-700"
        >
          印刷 / PDF保存
        </button>
      </div>
      {children}
    </>
  )
}
