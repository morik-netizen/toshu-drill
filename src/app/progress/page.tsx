import { BottomNav } from '@/components/BottomNav'

export default function ProgressPage() {
  return (
    <main className="min-h-screen pb-20 max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">みんなの進捗</h1>
        <div className="flex gap-2 mt-3">
          {['総合', '伸び率', '継続日数'].map((tab) => (
            <button
              key={tab}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-muted hover:bg-blue-50 hover:text-primary transition-colors"
            >
              {tab}
            </button>
          ))}
        </div>
      </header>
      <div className="mx-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-muted text-sm">
          まだランキングデータがありません
        </p>
      </div>
      <BottomNav />
    </main>
  )
}
