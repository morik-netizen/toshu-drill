import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPresignedUploadUrl, deleteObject } from '@/lib/s3'

const UNIT_ID_PATTERN = /^U(0[1-9]|1[0-2])$/

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const userId = session.user.id

  let body: { unitId?: string; slotId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '不正なリクエストです' }, { status: 400 })
  }

  const { unitId, slotId } = body

  if (!unitId || !slotId) {
    return NextResponse.json(
      { error: 'unitId と slotId は必須です' },
      { status: 400 },
    )
  }

  if (!UNIT_ID_PATTERN.test(unitId)) {
    return NextResponse.json(
      { error: 'unitId の形式が不正です（U01〜U12）' },
      { status: 400 },
    )
  }

  const s3Key = `lecture-photos/${userId}/${unitId}/${slotId}_${Date.now()}.webp`

  // Check for existing photo and delete old S3 object if present
  const existing = await prisma.lecturePhoto.findUnique({
    where: { userId_unitId_slotId: { userId, unitId, slotId } },
  })

  if (existing) {
    try {
      await deleteObject(existing.s3Key)
    } catch {
      // Old object may already be gone; continue
    }
  }

  // Upsert LecturePhoto record
  const photo = await prisma.lecturePhoto.upsert({
    where: { userId_unitId_slotId: { userId, unitId, slotId } },
    update: { s3Key },
    create: { userId, unitId, slotId, s3Key },
  })

  const uploadUrl = await getPresignedUploadUrl(s3Key, 'image/webp')

  return NextResponse.json({
    uploadUrl,
    photoId: photo.id,
    s3Key,
  })
}
