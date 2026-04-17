import { PrintUnit } from './PrintUnit'
import type { PrintPayload } from '@/lib/print/format'

interface PrintLayoutProps {
  payload: PrintPayload
}

export function PrintLayout({ payload }: PrintLayoutProps) {
  const { student, exportDate, units } = payload
  const isSingle = units.length === 1
  const title = isSingle && units[0]
    ? `${units[0].unitId} ${units[0].title}`
    : '徒手療法論 講義ノート'

  return (
    <div className="print-root">
      <header className="print-cover mb-8">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6">{title}</h1>
        <dl className="text-sm space-y-1">
          <div className="flex">
            <dt className="w-20 text-gray-600">学生氏名</dt>
            <dd className="font-medium">{student.name ?? '（未設定）'}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 text-gray-600">メール</dt>
            <dd>{student.email ?? '（未設定）'}</dd>
          </div>
          <div className="flex">
            <dt className="w-20 text-gray-600">出力日</dt>
            <dd>{exportDate}</dd>
          </div>
        </dl>
        {!isSingle && (
          <div className="mt-6">
            <p className="text-sm font-bold text-gray-700 mb-2">含まれるユニット</p>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-0.5">
              {units.map((u) => (
                <li key={u.unitId}>
                  {u.unitId} {u.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {units.map((u, idx) => (
        <PrintUnit key={u.unitId} unit={u} isFirst={idx === 0} />
      ))}
    </div>
  )
}
