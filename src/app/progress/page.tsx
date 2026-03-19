import { BottomNav } from '@/components/BottomNav'
import { getLeaderboard } from '@/lib/actions/leaderboard'

export default async function ProgressPage() {
  let data: Awaited<ReturnType<typeof getLeaderboard>> | null = null
  try {
    data = await getLeaderboard()
  } catch {
    // 未ログインまたはDB未接続
  }

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">みんなの進捗</h1>
        <p className="text-xs text-muted mt-1">
          カバー率ランキング（{data?.totalQuestions ?? 393}問中）
        </p>
      </header>

      {/* 自分のランク */}
      {data && data.currentUserRank !== null && data.currentUserRank > 0 && (
        <section className="mx-4 mb-4">
          {data.entries
            .filter((e) => e.isCurrentUser)
            .map((me) => (
              <div
                key={me.rank}
                className="bg-primary text-white rounded-xl p-4 flex items-center gap-4"
              >
                <div className="text-2xl font-bold w-10 text-center">
                  {me.rank}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{me.name}</div>
                  <div className="text-xs opacity-80 mt-0.5">
                    {me.totalAttempted}/{data.totalQuestions}問クリア
                    ・定着 {me.totalMastered}問
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(me.coverageRate * 100)}%
                </div>
              </div>
            ))}
        </section>
      )}

      {/* ランキング一覧 */}
      <section className="mx-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {data && data.entries.length > 0 ? (
            data.entries.map((entry, i) => {
              const pct = Math.round(entry.coverageRate * 100)
              const isTop3 = entry.rank <= 3
              const medals = ['', '🥇', '🥈', '🥉']

              return (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < data.entries.length - 1 ? 'border-b border-gray-50' : ''
                  } ${entry.isCurrentUser ? 'bg-blue-50' : ''}`}
                >
                  {/* 順位 */}
                  <div className="w-8 text-center shrink-0">
                    {isTop3 ? (
                      <span className="text-lg">{medals[entry.rank]}</span>
                    ) : (
                      <span className="text-sm text-muted font-medium">{entry.rank}</span>
                    )}
                  </div>

                  {/* 名前 + サブ情報 */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${entry.isCurrentUser ? 'font-semibold text-primary' : ''}`}>
                      {entry.name}
                      {entry.isCurrentUser && ' (あなた)'}
                    </div>
                    <div className="text-xs text-muted">
                      定着 {entry.totalMastered}問
                    </div>
                  </div>

                  {/* カバー率 + バー */}
                  <div className="w-24 shrink-0">
                    <div className="text-sm font-semibold text-right mb-1">
                      {pct}%
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          pct === 100 ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted text-sm">
                ログインするとランキングが表示されます
              </p>
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
