import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/BottomNav'
import { getPhotoCompletionCounts } from '@/lib/actions/lectures'

const UNITS = [
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
] as const

export default async function LecturesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const completionCounts = await getPhotoCompletionCounts()

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">📓 講義ノート</h1>
        <p className="text-xs text-muted mt-1">
          各ユニットの講義写真を記録しましょう
        </p>
      </header>

      <section className="mx-4">
        <div className="grid grid-cols-2 gap-2">
          {UNITS.map((unit) => {
            const counts = completionCounts.get(unit.code)
            const filled = counts?.filled ?? 0
            const total = counts?.total ?? 6
            return (
              <Link
                key={unit.code}
                href={`/lectures/${unit.code}`}
                className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-lg">{unit.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {unit.name}
                  </div>
                  <div className="text-xs text-muted">
                    {filled}/{total}枚
                  </div>
                </div>
                {filled > 0 && (
                  <span className="text-xs font-bold text-emerald-600">
                    {Math.round((filled / total) * 100)}%
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
