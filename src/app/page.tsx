import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/BottomNav'
import { getHomeProgress } from '@/lib/actions/quiz'
import { auth, signOut, isAllowedEmail } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function HomePage() {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  // Domain restriction: sign out unauthorized users
  if (session.user.email && !isAllowedEmail(session.user.email)) {
    await signOut()
    redirect('/login?error=AccessDenied')
  }

  // Check if teacher
  let isTeacher = false
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    isTeacher = user?.role === 'teacher'
  }

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
          <h1 className="text-xl font-bold">徒手療法ドリル</h1>
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
        {isTeacher && (
          <Link
            href="/dashboard"
            className="mt-2 block w-full py-2 bg-gray-900 text-white rounded-lg font-medium text-center text-sm hover:bg-gray-800 transition-colors"
          >
            教員ダッシュボード
          </Link>
        )}
      </header>

      {/* 今日の学習 */}
      <section className="mx-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🎯</span>
          <h2 className="text-sm font-bold text-foreground">今日の学習</h2>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
          <div
            className="bg-primary h-3 rounded-full transition-all"
            style={{ width: `${coveragePct}%` }}
          />
        </div>
        <div className="text-xs text-muted mb-3">
          {progress?.attempted ?? 0}/{progress?.totalUnlocked ?? 0}問 クリア済み
          (カバー率 {coveragePct}%)
        </div>
        {progress && (
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-primary">{Math.min(progress.reviewDueCount, progress.recommendedCount)}</div>
              <div className="text-xs text-muted">復習</div>
            </div>
            <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-600">{Math.max(0, progress.recommendedCount - Math.min(progress.reviewDueCount, progress.recommendedCount))}</div>
              <div className="text-xs text-muted">未挑戦</div>
            </div>
            <div className="flex-1 bg-orange-50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-orange-600">{progress.recommendedCount}</div>
              <div className="text-xs text-muted">合計</div>
            </div>
          </div>
        )}
        <Link
          href="/quiz"
          className="block w-full py-3 bg-primary text-white rounded-xl font-medium text-center hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          おすすめ{progress?.recommendedCount ?? 12}問を始める →
        </Link>
      </section>

      {/* 単元別学習 */}
      <section className="mx-4 mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-foreground mb-3">📚 単元別学習</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { code: 'U01', name: '理論', icon: '📖' },
            { code: 'U02', name: '足関節', icon: '🦶' },
            { code: 'U03', name: '足部・足趾', icon: '🦶' },
            { code: 'U04', name: '膝・股関節', icon: '🦵' },
            { code: 'U05', name: '仙腸関節1', icon: '🦴' },
            { code: 'U06', name: '仙腸関節2', icon: '🦴' },
            { code: 'U07', name: '骨盤1', icon: '🦴' },
            { code: 'U08', name: '骨盤2', icon: '🦴' },
            { code: 'U09', name: '腰椎', icon: '🦴' },
            { code: 'U10', name: '肩関節', icon: '💪' },
            { code: 'U11', name: '肘関節', icon: '💪' },
            { code: 'U12', name: '手関節と指', icon: '✋' },
          ].map((unit) => {
            const cat = progress?.categoryBreakdown?.find(
              (c) => c.categoryCode === unit.code
            )
            const pct = cat && cat.total > 0
              ? Math.round((cat.attempted / cat.total) * 100)
              : 0
            return (
              <Link
                key={unit.code}
                href={`/quiz?category=${unit.code}`}
                className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-lg">{unit.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{unit.name}</div>
                  <div className="text-xs text-muted">{cat?.total ?? 0}問</div>
                </div>
                {pct > 0 && (
                  <span className="text-xs font-bold text-emerald-600">{pct}%</span>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* 模擬試験 */}
      <section className="mx-4 mt-4 mb-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm text-muted mb-3">🏆 模擬試験</h2>
        <p className="text-sm text-muted mb-3">
          229問からランダム25問・60%以上で合格
        </p>
        <Link
          href="/mock-test"
          className="block w-full py-3 bg-white border-2 border-primary text-primary rounded-xl font-medium text-center hover:bg-emerald-50 transition-colors"
        >
          模擬試験を始める
        </Link>
      </section>

      <BottomNav />
    </main>
  )
}
