import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockTestReview } from '../MockTestReview'
import type { QuestionDTO } from '@/lib/actions/quiz'

function makeQuestion(overrides: Partial<QuestionDTO> = {}): QuestionDTO {
  return {
    id: 1,
    questionType: 'four_choice',
    categoryCode: 'U01',
    categoryName: '理論',
    questionText: '副運動のうち「ころがり」の特徴として正しいのはどれか。',
    choiceA: '選択肢A本文',
    choiceB: '選択肢B本文',
    choiceC: '選択肢C本文',
    choiceD: '選択肢D本文',
    correctAnswers: 'B',
    correctFeedback: '正解です',
    incorrectFeedback: '不正解の解説文',
    similarityGroup: null,
    ...overrides,
  }
}

describe('MockTestReview', () => {
  it('全問正解: お祝いメッセージを表示', () => {
    const q = makeQuestion()
    render(
      <MockTestReview
        questions={[q]}
        answers={[{ questionId: 1, selectedAnswer: 'B' }]}
      />
    )
    expect(screen.getByText('全問正解です！素晴らしい！')).toBeInTheDocument()
  })

  it('不正解あり: 問題文・自分の回答・正解・解説を選択肢本文つきで表示', () => {
    const q = makeQuestion()
    render(
      <MockTestReview
        questions={[q]}
        answers={[{ questionId: 1, selectedAnswer: 'D' }]}
      />
    )
    expect(screen.getByText('間違えた問題（1問）')).toBeInTheDocument()
    expect(
      screen.getByText('副運動のうち「ころがり」の特徴として正しいのはどれか。')
    ).toBeInTheDocument()
    expect(screen.getByText('D. 選択肢D本文')).toBeInTheDocument()
    expect(screen.getByText('B. 選択肢B本文')).toBeInTheDocument()
    expect(screen.getByText('不正解の解説文')).toBeInTheDocument()
  })

  it('複数選択の不正解: 順序不問で採点しラベルを結合表示', () => {
    const q = makeQuestion({ correctAnswers: 'A,C' })
    render(
      <MockTestReview
        questions={[q]}
        answers={[{ questionId: 1, selectedAnswer: 'A,D' }]}
      />
    )
    expect(screen.getByText('間違えた問題（1問）')).toBeInTheDocument()
    expect(
      screen.getByText('A. 選択肢A本文 / D. 選択肢D本文')
    ).toBeInTheDocument()
    expect(
      screen.getByText('A. 選択肢A本文 / C. 選択肢C本文')
    ).toBeInTheDocument()
  })

  it('○×問題の不正解: ○×で表示', () => {
    const q = makeQuestion({
      questionType: 'true_false',
      correctAnswers: 'A',
    })
    render(
      <MockTestReview
        questions={[q]}
        answers={[{ questionId: 1, selectedAnswer: 'B' }]}
      />
    )
    expect(screen.getByText('×')).toBeInTheDocument()
    expect(screen.getByText('○')).toBeInTheDocument()
  })
})
