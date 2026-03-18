import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? null

    // DB接続テスト
    const questionCount = await prisma.question.count()

    // ユーザーの学習記録数
    let recordCount = 0
    let answerCount = 0
    if (userId) {
      recordCount = await prisma.learningRecord.count({ where: { userId } })
      answerCount = await prisma.answerHistory.count({ where: { userId } })
    }

    // 全ユーザーの学習記録
    const totalRecords = await prisma.learningRecord.count()
    const totalAnswers = await prisma.answerHistory.count()

    return NextResponse.json({
      status: 'ok',
      userId,
      email: session?.user?.email,
      questionCount,
      myRecords: recordCount,
      myAnswers: answerCount,
      totalRecords,
      totalAnswers,
    })
  } catch (e) {
    return NextResponse.json({
      status: 'error',
      message: e instanceof Error ? e.message : String(e),
    }, { status: 500 })
  }
}
