import { BottomNav } from '@/components/BottomNav'
import { getProgress } from '@/lib/actions/progress'

export default async function ProgressPage() {
  let data: Awaited<ReturnType<typeof getProgress>> | null = null
  try {
    data = await getProgress()
  } catch {
    // 未ログインまたはDB未接続
  }

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">学習進捗</h1>
        <p className="text-xs text-muted mt-1">カテゴリ別の正答率</p>
      </header>

      {data ? (
        <>
          {/* 全体サマリー */}
          <section className="mx-4 mb-4">
            <div className="bg-primary text-white rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium text-sm">全体カバー率</div>
                <div className="text-xs opacity-80 mt-0.5">
                  {data.totalAttempted}/{data.totalQuestions}問クリア・定着 {data.totalMastered}問
                </div>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(data.coverageRate * 100)}%
              </div>
            </div>
          </section>

          {/* カテゴリ別進捗 */}
          <section className="mx-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {data.categories.length > 0 ? (
                data.categories.map((cat, i) => {
                  const pct = Math.round(cat.correctRate * 100)
                  return (
                    <div
                      key={cat.categoryCode}
                      className={`px-4 py-3 ${i < data.categories.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {cat.categoryCode} {cat.categoryName}
                        </span>
                        <span className={`text-sm font-semibold ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-primary'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted mt-1">
                        {cat.attempted}/{cat.total}問
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted text-sm">まだ学習記録がありません</p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="mx-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-muted text-sm">ログインすると進捗が表示されます</p>
          </div>
        </section>
      )}

      <BottomNav />
    </main>
  )
}
