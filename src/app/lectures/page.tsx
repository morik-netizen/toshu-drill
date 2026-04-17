import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/BottomNav'
import { getPhotoCompletionCounts } from '@/lib/actions/lectures'
import { LECTURE_UNITS } from '@/lib/lecture-content'

const UNIT_ICONS: Record<string, string> = {
  U01: '📖',
  U02: '🦶',
  U03: '🦶',
  U04: '🦵',
  U05: '🦴',
  U06: '🦴',
  U07: '🦴',
  U08: '🦴',
  U09: '🦴',
  U10: '💪',
  U11: '💪',
  U12: '✋',
}

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

      <section className="mx-4 mb-3">
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-800">
            ⚠️ 年度末にデータが削除されます
          </p>
          <p className="text-[11px] text-amber-700 mt-1 leading-snug">
            来年度の学生用にサーバーをリセットするため、アップロードした写真やノートは消えます。
            必ず下のボタンからPDFで手元に保存しておいてください。
          </p>
        </div>
      </section>

      <section className="mx-4 mb-4">
        <a
          href="/lectures/print?all=true&autoprint=1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <span className="text-sm">📄 全12回分をPDFで保存</span>
          <span className="text-[10px] font-normal opacity-90">
            ブラウザの印刷ダイアログで「PDFとして保存」を選択
          </span>
        </a>
      </section>

      <section className="mx-4">
        <div className="grid grid-cols-2 gap-2">
          {LECTURE_UNITS.map((unit) => {
            const photoSlotCount = unit.sections.filter(
              (s) => s.photoSlot !== undefined,
            ).length
            const total = photoSlotCount > 0 ? photoSlotCount : 0
            const counts = completionCounts[unit.unitId]
            const filled = counts?.filled ?? 0
            const icon = UNIT_ICONS[unit.unitId] ?? '📄'
            return (
              <Link
                key={unit.unitId}
                href={`/lectures/${unit.unitId}`}
                className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-lg">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {unit.title}
                  </div>
                  {total > 0 ? (
                    <div className="text-xs text-muted">
                      {filled}/{total}枚
                    </div>
                  ) : (
                    <div className="text-xs text-muted">準備中</div>
                  )}
                </div>
                {total > 0 && filled > 0 && (
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
