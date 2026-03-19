import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { deleteObject } from '@/lib/s3'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { id } = await params

  const photo = await prisma.lecturePhoto.findUnique({ where: { id } })

  if (!photo) {
    return NextResponse.json({ error: '写真が見つかりません' }, { status: 404 })
  }

  if (photo.userId !== session.user.id) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  try {
    await deleteObject(photo.s3Key)
  } catch {
    // S3 object may already be gone; continue with DB cleanup
  }

  await prisma.lecturePhoto.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
