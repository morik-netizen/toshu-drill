import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/BottomNav'
import { getUserPhotosForUnit } from '@/lib/actions/lectures'
import { LectureSection } from '@/components/LectureSection'
import { PhotoSlot } from '@/components/PhotoSlot'
import { LECTURE_UNITS } from '@/lib/lecture-content'

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
  const unit = LECTURE_UNITS.find((u) => u.unitId === unitId)
  if (!unit) {
    notFound()
  }

  const photos = await getUserPhotosForUnit(unitId)
  const photoBySlot = new Map(photos.map((p) => [p.slotId, p]))

  const hasSections = unit.sections.length > 0

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
          {unit.unitId} {unit.title}
        </h1>
        {unit.subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{unit.subtitle}</p>
        )}
      </header>

      {/* Unit navigation pills */}
      <nav className="px-4 pb-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {LECTURE_UNITS.map((u) => (
            <Link
              key={u.unitId}
              href={`/lectures/${u.unitId}`}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                u.unitId === unitId
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {u.unitId}
            </Link>
          ))}
        </div>
      </nav>

      {/* PDF export button */}
      <div className="px-4 pb-4">
        <a
          href={`/lectures/print?unit=${unitId}&autoprint=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 border border-emerald-300 rounded-full px-3 py-1 hover:bg-emerald-50"
        >
          📄 この回をPDFで保存
        </a>
      </div>

      {/* Content */}
      <section className="mx-4 space-y-3">
        {!hasSections && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-700">コンテンツ準備中</p>
          </div>
        )}

        {hasSections &&
          unit.sections.map((sec, idx) => {
            const existing = sec.photoSlot
              ? photoBySlot.get(sec.photoSlot.slotId)
              : undefined

            return (
              <LectureSection
                key={`${unit.unitId}-sec-${idx}`}
                title={sec.photoSlot ? `📸 ${sec.title}` : sec.title}
                defaultOpen={idx === 0 || existing !== undefined}
              >
                <div
                  className="prose prose-sm max-w-none
                    [&_table]:w-full [&_table]:text-xs [&_table]:border-collapse
                    [&_th]:bg-emerald-50 [&_th]:px-2 [&_th]:py-1 [&_th]:border [&_th]:border-gray-200 [&_th]:text-left
                    [&_td]:px-2 [&_td]:py-1 [&_td]:border [&_td]:border-gray-200
                    [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:mb-1"
                  // sec.content is sourced from LECTURE_UNITS static constants only. If this ever becomes user-sourced, sanitize with DOMPurify first.
                  dangerouslySetInnerHTML={{ __html: sec.content }}
                />
                {sec.photoSlot && (
                  <div className="mt-3">
                    <PhotoSlot
                      slotId={sec.photoSlot.slotId}
                      unitId={unitId}
                      label={sec.photoSlot.label}
                      existingPhotoUrl={existing?.downloadUrl}
                      existingPhotoId={existing?.id}
                    />
                  </div>
                )}
              </LectureSection>
            )
          })}
      </section>

      <BottomNav />
    </main>
  )
}
