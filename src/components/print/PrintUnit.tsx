import { PrintSection } from './PrintSection'
import type { PrintUnitPayload } from '@/lib/print/format'

interface PrintUnitProps {
  unit: PrintUnitPayload
  isFirst: boolean
}

export function PrintUnit({ unit, isFirst }: PrintUnitProps) {
  const className = isFirst ? 'print-unit' : 'print-unit page-break-before'
  return (
    <article className={className}>
      <header className="mb-4 border-b-2 border-emerald-600 pb-2">
        <h2 className="text-xl font-bold text-emerald-800">
          {unit.unitId} {unit.title}
        </h2>
        {unit.subtitle && (
          <p className="text-sm text-gray-600 mt-1">{unit.subtitle}</p>
        )}
      </header>
      <div className="space-y-4">
        {unit.sections.map((sec, idx) => (
          <PrintSection key={`${unit.unitId}-${idx}`} section={sec} />
        ))}
      </div>
    </article>
  )
}
