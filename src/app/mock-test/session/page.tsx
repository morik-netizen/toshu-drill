import { getMockTestQuestions } from '@/lib/actions/practice-test'
import { MockTestSession } from './MockTestSession'
import { BottomNav } from '@/components/BottomNav'

export default async function MockTestSessionPage() {
  let questions: Awaited<ReturnType<typeof getMockTestQuestions>> = []
  let error: string | null = null

  try {
    questions = await getMockTestQuestions()
  } catch (e) {
    console.error('Mock test error:', e)
    error = 'テストの読み込みに失敗しました。もう一度お試しください。'
  }

  if (error) {
    return (
      <main className="min-h-screen pb-20 max-w-lg mx-auto flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted mb-4">{error}</p>
          <a
            href="/mock-test"
            className="text-primary text-sm underline"
          >
            模擬試験に戻る
          </a>
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      <MockTestSession questions={questions} />
      <BottomNav />
    </main>
  )
}
