import { getQuizQuestions } from '@/lib/actions/quiz'
import { QuizSession } from './QuizSession'
import { BottomNav } from '@/components/BottomNav'
import Link from 'next/link'

export default async function QuizPage() {
  const questions = await getQuizQuestions(12)

  if (questions.length === 0) {
    return (
      <main className="min-h-screen pb-20 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-xl font-bold mb-2">
            今日の学習は完了!
          </h1>
          <p className="text-muted text-sm text-center mb-4">
            全229問をクリア済みです。素晴らしい！復習が必要な問題が出てきたらまた出題されます。
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
      <QuizSession questions={questions} />
      <BottomNav />
    </main>
  )
}
