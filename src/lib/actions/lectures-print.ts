'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPresignedDownloadUrl } from '@/lib/s3'
import { LECTURE_UNITS } from '@/lib/lecture-content'
import { buildPrintPayload } from '@/lib/print/format'
import type { PrintPayload } from '@/lib/print/format'
import type { PhotoWithUrl } from '@/lib/actions/lectures'

export type { PrintPayload } from '@/lib/print/format'

export async function getUserPhotosForUnits(
  unitIds: readonly string[],
): Promise<Record<string, PhotoWithUrl[]>> {
  const session = await auth()
  if (!session?.user?.id) {
    return {}
  }

  if (unitIds.length === 0) {
    return {}
  }

  const photos = await prisma.lecturePhoto.findMany({
    where: {
      userId: session.user.id,
      unitId: { in: [...unitIds] },
    },
    orderBy: { createdAt: 'asc' },
  })

  const urlResults = await Promise.allSettled(
    photos.map((photo) => getPresignedDownloadUrl(photo.s3Key)),
  )

  const byUnit: Record<string, PhotoWithUrl[]> = {}
  for (const unitId of unitIds) {
    byUnit[unitId] = []
  }

  photos.forEach((photo, idx) => {
    const result = urlResults[idx]
    const downloadUrl =
      result && result.status === 'fulfilled' ? result.value : ''
    const entry: PhotoWithUrl = {
      id: photo.id,
      slotId: photo.slotId,
      s3Key: photo.s3Key,
      downloadUrl,
    }
    const bucket = byUnit[photo.unitId]
    if (bucket) {
      bucket.push(entry)
    } else {
      byUnit[photo.unitId] = [entry]
    }
  })

  return byUnit
}

export interface GetPrintPayloadParams {
  readonly unitIds?: readonly string[]
}

export async function getPrintPayload(
  params: GetPrintPayloadParams = {},
): Promise<PrintPayload | null> {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const targetUnitIds =
    params.unitIds && params.unitIds.length > 0
      ? params.unitIds
      : LECTURE_UNITS.map((u) => u.unitId)

  const photosByUnit = await getUserPhotosForUnits(targetUnitIds)

  return buildPrintPayload({
    units: LECTURE_UNITS,
    photosByUnit,
    student: {
      name: session.user.name ?? null,
      email: session.user.email ?? null,
    },
    exportDate: new Date(),
    unitIds: targetUnitIds,
  })
}
