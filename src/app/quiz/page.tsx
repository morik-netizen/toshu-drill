import { getQuizQuestions } from '@/lib/actions/quiz'
import { QuizSession } from './QuizSession'
import { BottomNav } from '@/components/BottomNav'

export default async function QuizPage() {
  const questions = await getQuizQuestions(12)

  if (questions.length === 0) {
    return (
      <main className="min-h-screen pb-20 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-xl font-bold mb-2">今日の学習は完了!</h1>
          <p className="text-muted text-sm text-center">
            解放済みの問題をすべてクリアしました。
            次の授業で新しい問題が追加されます。
          </p>
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
