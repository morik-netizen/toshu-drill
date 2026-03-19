import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/BottomNav'
import { getUserPhotosForUnit } from '@/lib/actions/lectures'
import { LectureSection } from '@/components/LectureSection'
import { PhotoSlot } from '@/components/PhotoSlot'

const UNITS = [
  { code: 'U01', name: '理論' },
  { code: 'U02', name: '足関節' },
  { code: 'U03', name: '足部・足趾' },
  { code: 'U04', name: '膝・股関節' },
  { code: 'U05', name: '仙腸関節1' },
  { code: 'U06', name: '仙腸関節2' },
  { code: 'U07', name: '骨盤1' },
  { code: 'U08', name: '骨盤2' },
  { code: 'U09', name: '腰椎' },
  { code: 'U10', name: '肩関節' },
  { code: 'U11', name: '肘関節' },
  { code: 'U12', name: '手関節と指' },
] as const

// Default photo slots for units without specific content yet
const DEFAULT_SLOTS = [
  { slotId: 'slot-1', label: '写真 1' },
  { slotId: 'slot-2', label: '写真 2' },
  { slotId: 'slot-3', label: '写真 3' },
  { slotId: 'slot-4', label: '写真 4' },
  { slotId: 'slot-5', label: '写真 5' },
  { slotId: 'slot-6', label: '写真 6' },
]

export default async function LectureDetailPage({
  params,
}: {
  params: Promise<{ unitId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { unitId } = await params
  const unit = UNITS.find((u) => u.code === unitId)
  if (!unit) {
    notFound()
  }

  const photos = await getUserPhotosForUnit(unitId)
  const photoBySlot = new Map(photos.map((p) => [p.slotId, p]))

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <Link
          href="/lectures"
          className="text-xs text-emerald-600 hover:underline"
        >
          &larr; 講義ノート一覧
        </Link>
        <h1 className="text-xl font-bold mt-1">
          {unit.code} {unit.name}
        </h1>
      </header>

      {/* Unit navigation pills */}
      <nav className="px-4 pb-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {UNITS.map((u) => (
            <Link
              key={u.code}
              href={`/lectures/${u.code}`}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                u.code === unitId
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {u.code}
            </Link>
          ))}
        </div>
      </nav>

      {/* Content */}
      <section className="mx-4 space-y-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-700">講義コンテンツ準備中</p>
          <p className="text-xs text-amber-600 mt-1">
            下の写真スロットに講義中の写真を記録できます
          </p>
        </div>

        <LectureSection title="講義写真" defaultOpen>
          <div className="grid grid-cols-2 gap-3">
            {DEFAULT_SLOTS.map((slot) => {
              const existing = photoBySlot.get(slot.slotId)
              return (
                <PhotoSlot
                  key={slot.slotId}
                  slotId={slot.slotId}
                  unitId={unitId}
                  label={slot.label}
                  existingPhotoUrl={existing?.downloadUrl}
                  existingPhotoId={existing?.id}
                />
              )
            })}
          </div>
        </LectureSection>
      </section>

      <BottomNav />
    </main>
  )
}
