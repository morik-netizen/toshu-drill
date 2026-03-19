import Link from 'next/link'
import { BottomNav } from '@/components/BottomNav'
import { getMockTestHistory } from '@/lib/actions/practice-test'
import type { MockTestResult } from '@/lib/actions/practice-test'

export default async function MockTestPage() {
  let history: readonly MockTestResult[] = []

  try {
    history = await getMockTestHistory()
  } catch {
    // 未ログインまたはDB未接続
  }

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← ホームに戻る
        </Link>
        <h1 className="text-xl font-bold mt-2">模擬試験</h1>
        <p className="text-xs text-muted mt-1">
          229問からランダム25問・60%以上で合格
        </p>
      </header>

      <div className="mx-4 flex flex-col gap-4">
        {/* 模擬試験を始めるボタン */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-sm text-muted mb-4">
            全範囲からランダムに25問出題されます。<br />
            60%（15問）以上正解で合格です。
          </p>
          <Link
            href="/mock-test/session"
            className="block w-full py-3 bg-primary text-white rounded-xl font-medium text-center hover:bg-primary-hover active:scale-[0.98] transition-all"
          >
            模擬試験を始める（25問）
          </Link>
        </div>

        {/* 過去の結果 */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold mb-3">過去の結果</h2>
            <div className="flex flex-col gap-2">
              {history.map((result) => {
                const pct = result.total > 0
                  ? Math.round((result.score / result.total) * 100)
                  : 0
                const date = new Date(result.startedAt)
                const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`

                return (
                  <div
                    key={result.id}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                          result.passed
                            ? 'bg-green-50 text-success'
                            : 'bg-red-50 text-error'
                        }`}
                      >
                        {result.passed ? '合格' : '不合格'}
                      </span>
                      <span className="text-sm font-medium">
                        {result.score}/{result.total} ({pct}%)
                      </span>
                    </div>
                    <span className="text-xs text-muted">{dateStr}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
