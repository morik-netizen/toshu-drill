import { getDashboardData } from '@/lib/actions/dashboard'
import Link from 'next/link'

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <main className="min-h-screen pb-8 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <header className="px-4 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">教員ダッシュボード</h1>
          <p className="text-xs text-muted mt-1">関係法規マスター</p>
        </div>
        <Link href="/" className="text-sm text-primary underline">
          ホームへ
        </Link>
      </header>

      {/* サマリーカード */}
      <section className="mx-4 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <SummaryCard label="登録学生数" value={data.totalStudents} />
        <SummaryCard
          label="アクティブ (7日)"
          value={data.activeStudents}
          sub={`${data.totalStudents > 0 ? Math.round((data.activeStudents / data.totalStudents) * 100) : 0}%`}
        />
        <SummaryCard label="総問題数" value={data.totalQuestions} />
        <SummaryCard
          label="全体平均カバー率"
          value={`${data.students.length > 0 ? Math.round((data.students.reduce((s, st) => s + st.coverageRate, 0) / data.students.length) * 100) : 0}%`}
        />
      </section>

      {/* 学生一覧 */}
      <section className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold mb-3">学生一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted">
                <th className="pb-2 pr-2">名前</th>
                <th className="pb-2 pr-2 text-right">カバー率</th>
                <th className="pb-2 pr-2 text-right">挑戦</th>
                <th className="pb-2 pr-2 text-right">定着</th>
                <th className="pb-2 text-right">最終学習</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.id} className="border-b border-gray-50">
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      {s.name ?? s.email ?? '(未設定)'}
                    </div>
                  </td>
                  <td className="py-2 pr-2 text-right">
                    <span className={s.coverageRate >= 0.8 ? 'text-green-600 font-medium' : s.coverageRate >= 0.5 ? 'text-yellow-600' : 'text-red-600'}>
                      {Math.round(s.coverageRate * 100)}%
                    </span>
                  </td>
                  <td className="py-2 pr-2 text-right">{s.totalAttempted}/{data.totalQuestions}</td>
                  <td className="py-2 pr-2 text-right">{s.totalMastered}</td>
                  <td className="py-2 text-right text-muted">
                    {s.lastActiveAt
                      ? s.lastActiveAt.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
                      : '未学習'}
                  </td>
                </tr>
              ))}
              {data.students.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-muted">
                    まだ学生が登録されていません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 授業回別達成状況 */}
      <section className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold mb-3">授業回別の達成状況（全学生平均）</h2>
        <div className="flex flex-col gap-2">
          {data.lessonOverview.map((l) => {
            const attemptPct = Math.round(l.avgAttemptedRate * 100)
            const correctPct = Math.round(l.avgCorrectRate * 100)
            return (
              <div key={l.lesson} className="rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">第{l.lesson}回 {l.title}</span>
                  <span className="text-muted">{l.totalQuestions}問</span>
                </div>
                <div className="flex gap-4 text-xs text-muted mb-1">
                  <span>カバー率: <strong className="text-foreground">{attemptPct}%</strong></span>
                  <span>正答率: <strong className={correctPct >= 80 ? 'text-green-600' : correctPct >= 60 ? 'text-yellow-600' : 'text-red-600'}>{correctPct}%</strong></span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${attemptPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 練習テスト合格状況 */}
      <section className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold mb-3">練習テスト合格状況</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.practiceTests.map((pt) => (
            <div key={pt.quarter} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold mb-1">{pt.quarter}</div>
              <div className="text-xs text-muted mb-2">{pt.label}</div>
              <div className="text-lg font-bold text-primary">
                {Math.round(pt.passRate * 100)}%
              </div>
              <div className="text-xs text-muted">
                {pt.passCount}/{pt.uniqueStudents}人合格
              </div>
              <div className="text-xs text-muted mt-1">
                平均: {Math.round(pt.avgScore)}点
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 正答率が低いカテゴリ */}
      <section className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold mb-1">正答率が低いカテゴリ</h2>
        <p className="text-xs text-muted mb-3">授業で補強すべき分野</p>
        <div className="flex flex-col gap-2">
          {data.weakCategories.map((cat) => {
            const pct = Math.round(cat.correctRate * 100)
            return (
              <div key={cat.categoryCode}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{cat.categoryCode} {cat.categoryName}</span>
                  <span className={pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600 font-medium'}>
                    {pct}% ({cat.correctCount}/{cat.totalAnswers})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
          {data.weakCategories.length === 0 && (
            <p className="text-xs text-muted">まだデータがありません</p>
          )}
        </div>
      </section>

      {/* 難問TOP20 */}
      <section className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold mb-1">正答率が低い問題 TOP20</h2>
        <p className="text-xs text-muted mb-3">3回以上回答された問題が対象</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted">
                <th className="pb-2 pr-2">ID</th>
                <th className="pb-2 pr-2">カテゴリ</th>
                <th className="pb-2 pr-2">問題（冒頭）</th>
                <th className="pb-2 text-right">正答率</th>
              </tr>
            </thead>
            <tbody>
              {data.hardQuestions.map((q) => (
                <tr key={q.questionId} className="border-b border-gray-50">
                  <td className="py-2 pr-2 text-muted">{q.questionId}</td>
                  <td className="py-2 pr-2">{q.categoryCode}</td>
                  <td className="py-2 pr-2 max-w-[200px] truncate">
                    {q.questionText.slice(0, 50)}
                  </td>
                  <td className="py-2 text-right">
                    <span className={q.correctRate < 0.5 ? 'text-red-600 font-medium' : 'text-yellow-600'}>
                      {Math.round(q.correctRate * 100)}%
                    </span>
                    <span className="text-muted ml-1">({q.correctCount}/{q.totalAnswers})</span>
                  </td>
                </tr>
              ))}
              {data.hardQuestions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-muted">
                    まだデータがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 日別アクティブユーザー数 */}
      <section className="mx-4 mb-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold mb-1">日別アクティビティ（過去30日）</h2>
        <p className="text-xs text-muted mb-3">アクティブユーザー数と回答数</p>
        {data.dailyActivity.length > 0 ? (
          <div className="flex flex-col gap-1">
            {data.dailyActivity.map((d) => {
              const maxUsers = Math.max(...data.dailyActivity.map((dd) => dd.activeUsers), 1)
              const barWidth = Math.round((d.activeUsers / maxUsers) * 100)
              return (
                <div key={d.date} className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-muted shrink-0">
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 relative">
                    <div
                      className="bg-primary h-4 rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-muted shrink-0">
                    {d.activeUsers}人 / {d.totalAnswers}問
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-muted">まだデータがありません</p>
        )}
      </section>
    </main>
  )
}

// ============================================
// サマリーカードコンポーネント
// ============================================

function SummaryCard({
  label,
  value,
  sub,
}: {
  readonly label: string
  readonly value: string | number
  readonly sub?: string
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  )
}
