import { getQuizQuestions } from '@/lib/actions/quiz'
import { QuizSession } from './QuizSession'
import { BottomNav } from '@/components/BottomNav'
import Link from 'next/link'

const UNIT_NAMES: Record<string, string> = {
  U01: '理論',
  U02: '足関節',
  U03: '足部・足趾',
  U04: '膝・股関節',
  U05: '仙腸関節1',
  U06: '仙腸関節2',
  U07: '骨盤1',
  U08: '骨盤2',
  U09: '腰椎',
  U10: '肩関節',
  U11: '肘関節',
  U12: '手関節と指',
}

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category
  const categoryCodes = category ? [category] : undefined
  const unitName = category ? UNIT_NAMES[category] : undefined

  const questions = await getQuizQuestions(12, categoryCodes)

  if (questions.length === 0) {
    return (
      <main className="min-h-screen pb-20 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-xl font-bold mb-2">
            {unitName ? `${unitName}の学習は完了!` : '今日の学習は完了!'}
          </h1>
          <p className="text-muted text-sm text-center mb-4">
            {unitName
              ? `${unitName}の問題をすべてクリア済みです。復習が必要な問題が出てきたらまた出題されます。`
              : '全229問をクリア済みです。素晴らしい！復習が必要な問題が出てきたらまた出題されます。'}
          </p>
          <Link
            href="/"
            className="text-sm text-primary underline"
          >
            ホームに戻る
          </Link>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      {unitName && (
        <div className="px-4 pt-4">
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            {unitName}
          </span>
        </div>
      )}
      <QuizSession questions={questions} />
      <BottomNav />
    </main>
  )
}
