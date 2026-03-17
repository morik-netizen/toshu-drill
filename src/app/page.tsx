import Link from 'next/link'
import { BottomNav } from '@/components/BottomNav'
import { getHomeProgress } from '@/lib/actions/quiz'
import { auth, signOut } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()

  let progress: Awaited<ReturnType<typeof getHomeProgress>> | null = null
  try {
    progress = await getHomeProgress()
  } catch {
    // 未ログインまたはDB未接続時はnull
  }

  const coveragePct = progress
    ? Math.round(progress.coverageRate * 100)
    : 0

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      {/* ヘッダー */}
      <header className="px-4 pt-6 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">関係法規マスター</h1>
          <span className="text-sm bg-orange-50 text-orange-600 px-2 py-1 rounded-lg">
            🔥 {progress?.streakDays ?? 0}日目
          </span>
        </div>
        {session?.user && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted">
              ログイン中: {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <button
                type="submit"
                className="text-xs text-muted underline hover:text-foreground"
              >
                ログアウト
              </button>
            </form>
          </div>
        )}
      </header>

      {/* 今日の学習 */}
      <section className="mx-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm text-muted mb-3">今日の学習</h2>
        <div className="text-sm text-muted mb-2">
          おすすめ {progress?.recommendedCount ?? 12}問
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div
            className="bg-primary h-3 rounded-full transition-all"
            style={{ width: `${coveragePct}%` }}
          />
        </div>
        <div className="text-xs text-muted mb-4">
          {progress?.attempted ?? 0}/{progress?.totalUnlocked ?? 0}問 クリア済み
          (カバー率 {coveragePct}%)
        </div>
        <Link
          href="/quiz"
          className="block w-full py-3 bg-primary text-white rounded-xl font-medium text-center hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          学習スタート
        </Link>
      </section>

      {/* ポイント・定着 */}
      {progress && progress.attempted > 0 && (
        <section className="mx-4 mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
            <div className="text-lg font-bold text-primary">
              {progress.totalPoints}
            </div>
            <div className="text-xs text-muted">ポイント</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
            <div className="text-lg font-bold text-success">
              {progress.mastered}
            </div>
            <div className="text-xs text-muted">定着済み</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
            <div className="text-lg font-bold text-foreground">
              {progress.attempted}
            </div>
            <div className="text-xs text-muted">挑戦済み</div>
          </div>
        </section>
      )}

      {/* カテゴリ別進捗 */}
      <section className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm text-muted mb-3">📊 カテゴリ別</h2>
        {progress && progress.categoryBreakdown.length > 0 ? (
          <div className="flex flex-col gap-2">
            {progress.categoryBreakdown.map((cat) => {
              const pct =
                cat.total > 0
                  ? Math.round((cat.attempted / cat.total) * 100)
                  : 0
              return (
                <div key={cat.categoryCode}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      {cat.categoryCode} {cat.categoryName}
                    </span>
                    <span className="text-muted">
                      {cat.attempted}/{cat.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">
            学習を開始すると、カテゴリ別の進捗が表示されます
          </p>
        )}
      </section>

      {/* 練習テスト */}
      <section className="mx-4 mt-4 mb-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm text-muted mb-3">🏆 練習テスト</h2>
        <p className="text-sm text-muted mb-3">
          Q1〜Q4 各40問・80%以上で合格
        </p>
        <Link
          href="/practice-test"
          className="block w-full py-3 bg-white border-2 border-primary text-primary rounded-xl font-medium text-center hover:bg-blue-50 transition-colors"
        >
          練習テスト一覧
        </Link>
      </section>

      <BottomNav />
    </main>
  )
}
