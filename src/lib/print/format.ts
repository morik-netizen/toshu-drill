import type { LectureUnit } from '@/lib/lecture-content'
import type { PhotoWithUrl } from '@/lib/actions/lectures'

export interface PrintSectionPayload {
  readonly title: string
  readonly contentHtml: string
  readonly photoSlot?: {
    readonly slotId: string
    readonly label: string
  }
  readonly photo?: {
    readonly downloadUrl: string
    readonly failed: boolean
  }
}

export interface PrintUnitPayload {
  readonly unitId: string
  readonly title: string
  readonly subtitle: string
  readonly sections: readonly PrintSectionPayload[]
}

export interface PrintPayload {
  readonly student: {
    readonly name: string | null
    readonly email: string | null
  }
  readonly exportDate: string
  readonly units: readonly PrintUnitPayload[]
}

export interface BuildPrintPayloadInput {
  readonly units: readonly LectureUnit[]
  readonly photosByUnit: Readonly<Record<string, readonly PhotoWithUrl[]>>
  readonly student: {
    readonly name: string | null
    readonly email: string | null
  }
  readonly exportDate: Date
  readonly unitIds?: readonly string[]
}

export function formatDateYMD(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function buildPrintPayload(input: BuildPrintPayloadInput): PrintPayload {
  const targetUnits = input.unitIds
    ? input.unitIds
        .map((id) => input.units.find((u) => u.unitId === id))
        .filter((u): u is LectureUnit => u !== undefined)
    : input.units

  const units: PrintUnitPayload[] = targetUnits.map((unit) => {
    const photos = input.photosByUnit[unit.unitId] ?? []
    const photoBySlot = new Map(photos.map((p) => [p.slotId, p]))

    const sections: PrintSectionPayload[] = unit.sections.map((sec) => {
      const base: PrintSectionPayload = {
        title: sec.title,
        contentHtml: sec.content,
        photoSlot: sec.photoSlot
          ? { slotId: sec.photoSlot.slotId, label: sec.photoSlot.label }
          : undefined,
      }

      if (!sec.photoSlot) {
        return base
      }

      const matched = photoBySlot.get(sec.photoSlot.slotId)
      if (!matched) {
        return base
      }

      return {
        ...base,
        photo: {
          downloadUrl: matched.downloadUrl,
          failed: matched.downloadUrl === '',
        },
      }
    })

    return {
      unitId: unit.unitId,
      title: unit.title,
      subtitle: unit.subtitle,
      sections,
    }
  })

  return {
    student: input.student,
    exportDate: formatDateYMD(input.exportDate),
    units,
  }
}
