'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPresignedDownloadUrl } from '@/lib/s3'

export type PhotoWithUrl = {
  id: string
  slotId: string
  s3Key: string
  downloadUrl: string
}

export async function getUserPhotosForUnit(
  unitId: string,
): Promise<PhotoWithUrl[]> {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  const photos = await prisma.lecturePhoto.findMany({
    where: { userId: session.user.id, unitId },
    orderBy: { createdAt: 'asc' },
  })

  if (photos.length === 0) {
    return []
  }

  try {
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => ({
        id: photo.id,
        slotId: photo.slotId,
        s3Key: photo.s3Key,
        downloadUrl: await getPresignedDownloadUrl(photo.s3Key),
      })),
    )
    return photosWithUrls
  } catch {
    // S3 presigned URL generation failed - return photos without URLs
    return photos.map((photo) => ({
      id: photo.id,
      slotId: photo.slotId,
      s3Key: photo.s3Key,
      downloadUrl: '',
    }))
  }
}

export type PhotoCompletionCount = {
  filled: number
  total: number
}

// Default number of photo slots per unit (can be overridden when content is defined)
const DEFAULT_SLOTS_PER_UNIT = 6

export async function getPhotoCompletionCounts(): Promise<
  Record<string, PhotoCompletionCount>
> {
  const session = await auth()
  if (!session?.user?.id) {
    return {}
  }

  const photos = await prisma.lecturePhoto.findMany({
    where: { userId: session.user.id },
    select: { unitId: true },
  })

  const countByUnit: Record<string, number> = {}
  for (const photo of photos) {
    countByUnit[photo.unitId] = (countByUnit[photo.unitId] ?? 0) + 1
  }

  const result: Record<string, PhotoCompletionCount> = {}
  for (let i = 1; i <= 12; i++) {
    const unitId = `U${String(i).padStart(2, '0')}`
    result[unitId] = {
      filled: countByUnit[unitId] ?? 0,
      total: DEFAULT_SLOTS_PER_UNIT,
    }
  }

  return result
}
