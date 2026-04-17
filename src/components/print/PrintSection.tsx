import type { PrintSectionPayload } from '@/lib/print/format'

interface PrintSectionProps {
  section: PrintSectionPayload
}

export function PrintSection({ section }: PrintSectionProps) {
  return (
    <section className="print-section mb-6">
      <h3 className="text-base font-bold text-emerald-700 border-b border-emerald-200 pb-1 mb-2">
        {section.title}
      </h3>
      <div
        className="print-prose text-sm leading-relaxed"
        // contentHtml is sourced from LECTURE_UNITS static constants only. If this ever becomes user-sourced, sanitize with DOMPurify first.
        dangerouslySetInnerHTML={{ __html: section.contentHtml }}
      />
      {section.photoSlot && (
        <PhotoBlock
          label={section.photoSlot.label}
          photo={section.photo}
        />
      )}
    </section>
  )
}

interface PhotoBlockProps {
  label: string
  photo?: { downloadUrl: string; failed: boolean }
}

function PhotoBlock({ label, photo }: PhotoBlockProps) {
  if (photo && !photo.failed) {
    return (
      <figure className="print-photo mt-3">
        <img
          src={photo.downloadUrl}
          alt={label}
          className="block mx-auto border border-gray-200 rounded"
        />
        <figcaption className="text-xs text-gray-600 text-center mt-1">
          {label}
        </figcaption>
      </figure>
    )
  }

  if (photo && photo.failed) {
    return (
      <div className="print-photo-placeholder mt-3 border border-dashed border-rose-300 rounded p-6 text-center">
        <p className="text-sm text-rose-600">写真を取得できませんでした</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    )
  }

  return (
    <div className="print-photo-placeholder mt-3 border border-dashed border-gray-300 rounded p-6 text-center">
      <p className="text-sm text-gray-500 font-medium">未登録</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
