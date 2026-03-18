import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const email = 'mori.k@asahi.ac.jp'

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found. Please log in to the app first.' }, { status: 404 })
  }

  if (user.role === 'teacher') {
    return NextResponse.json({ message: 'Already a teacher', user })
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: 'teacher' },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json({ message: 'Role updated to teacher', user: updated })
}
