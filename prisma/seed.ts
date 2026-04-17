import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as path from 'path'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuestionData {
  readonly questionType: 'four_choice' | 'true_false'
  readonly sourceId: string
  readonly questionText: string
  readonly choiceA: string
  readonly choiceB: string
  readonly choiceC: string
  readonly choiceD: string
  readonly correctAnswers: string
  readonly correctFeedback: string | null
  readonly incorrectFeedback: string | null
}

interface Category {
  readonly code: string
  readonly name: string
}

// ---------------------------------------------------------------------------
// Category assignment
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: readonly { readonly code: string; readonly name: string; readonly keywords: readonly string[] }[] = [
  {
    code: 'U02',
    name: '足関節',
    keywords: ['距腿関節', '距腿', '距骨滑車', '距骨傾斜', '遠位脛腓', '脛腓関節', '背屈時に腓骨', '底屈時に腓骨', '腓骨果部'],
  },
  {
    code: 'U03',
    name: '足部・足趾',
    keywords: ['距骨下', 'ヘンケ軸', 'ショパール', 'リスフラン', 'MTP関節', '踵立方', '立方骨', '中足骨', '足のMP', '母趾MTP', '基節骨をフック', '足趾'],
  },
  {
    code: 'U04',
    name: '膝・股関節',
    keywords: ['脛骨大腿', '膝蓋骨', '膝蓋大腿', 'PF関節', 'CKC', '終末回旋', '膝関節', '膝屈曲', '膝伸展', '股関節', '大腿骨頭', '臼蓋', '脛骨顆'],
  },
  {
    code: 'U05',
    name: '仙腸関節1',
    keywords: ['仙腸関節の運動軸', '仙腸関節に多く', 'ニューテーション時', 'カウンターニューテーション時', 'SS（仙骨溝）', 'SSの評価', 'ILA（仙骨下外側角）', '受容器', 'S2', 'ニューテーションへの', 'カウンターニューテーションへの', 'ILAをモビ', 'ニューテーション増強', 'ニューテーションでは'],
  },
  {
    code: 'U06',
    name: '仙腸関節2',
    keywords: ['SiFBT', 'StFBT', 'LET', 'LST', 'ねじれ', '前方のねじれ', '後方のねじれ', '斜軸前方', '斜軸後方', '立位前屈検査', '坐位前屈検査', '仙骨のねじれ'],
  },
  {
    code: 'U07',
    name: '骨盤1',
    keywords: ['前方回旋', '後方回旋', 'アウトフレア', 'インフレア', 'ASIS（上前腸骨棘）', 'PSIS（後上腸骨棘）', 'ASISは', 'PSISは', '腸骨の前方', '腸骨の後方', '腸骨インフレア', '腸骨アウトフレア', '骨盤の後方回旋', '骨盤の前方回旋'],
  },
  {
    code: 'U08',
    name: '骨盤2',
    keywords: ['上方変位', '下方変位', 'アップスリップ', 'ダウンスリップ', '寛骨の上方', '寛骨の下方', '下肢長の所見', '下肢長の検査', '坐骨結節'],
  },
  {
    code: 'U09',
    name: '腰椎',
    keywords: ['脊椎運動原則', '脊椎運動の原則', 'コンバーゲンス', 'ディバーゲンス', '分節モビ', 'Springing', 'ICL', '腸骨稜間線', '横突起', '椎間関節', 'フィーダー', '棘突起をノーズ', '組み合わせ運動', '正中滑り', '腹側すべり'],
  },
  {
    code: 'U10',
    name: '肩関節',
    keywords: ['肩甲上腕', '肩甲骨', 'フローティング', '疼痛性肩', '五十肩', '肩関節の離開', '背側滑り', '腹側滑り', '尾側滑り', '肩関節の背側', '肩関節の腹側', '肩関節の尾側', '第2肩関節', '肩関節外転', '肩挙上', '肩甲棘', '肩峰', '上方回旋', '下方回旋', '掌屈上肢'],
  },
  {
    code: 'U11',
    name: '肘関節',
    keywords: ['腕尺関節', '腕橈関節', '近位橈尺', '遠位橈尺', '肘関節の離開', '肘関節伸展', '肘関節の外旋', '肘関節の内旋', '橈骨頭', '尺骨頭', '回内制限', '回外制限', '回内時', '回外時', '滑車切痕', '橈尺関節伸展'],
  },
  {
    code: 'U12',
    name: '手関節と指',
    keywords: ['橈骨手根', '手根骨', 'CM関節', '鞍関節', 'MP・PIP・DIP', 'PIP', 'DIP', '掌側すべり', '背側すべり', '尺側すべり', '橈側すべり', '手関節の離開', '大菱形骨', '小菱形骨', '第1中手骨', '第1CM', '第2CM', '第4CM', '第5CM', '掌側外転', '掌側内転', '橈側外転', '尺側内転', 'MCP関節', 'MP関節のOPP', 'MP関節のCPP'],
  },
  {
    code: 'U01',
    name: '理論',
    keywords: [
      'Kaltenborn', 'Maitland', 'Nordic', 'Australian', 'エンドフィール',
      'グレードI', 'グレードII', 'グレードIII', 'CPP', 'OPP',
      '凸の法則', '凹の法則', '凹凸の法則', 'joint play', '関節の遊び',
      'ころがり', 'すべり', '副運動', 'モビライゼーションの', '過小運動性',
      '過剰可動性', '治療面', '関節包パターン', 'しまりの肢位', 'ゆるみの肢位',
      '主に学ぶ', '主要な2つの体系', '制限因子', '禁忌', '適応となる',
      '関節モビライゼーション', '凹面を持つ',
    ],
  },
] as const

function assignCategory(questionText: string): Category {
  for (const cat of CATEGORY_KEYWORDS) {
    for (const kw of cat.keywords) {
      if (questionText.includes(kw)) {
        return { code: cat.code, name: cat.name }
      }
    }
  }
  // Fallback: general theory
  return { code: 'U01', name: '理論' }
}

// ---------------------------------------------------------------------------
// CSV Parsers
// ---------------------------------------------------------------------------

/** Remove UTF-8 BOM if present */
function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/**
 * Parse 4-choice CSV (Moodle export format, no header row).
 * Columns (all quoted):
 *   0: ID, 1: questionText, 2: choiceA, 3: choiceB, 4: choiceC, 5: choiceD,
 *   6: correctAnswer, 7: space, 8: "123", 9: correctFeedback,
 *   10: explanation, 11: empty, 12: weight, 13: empty
 */
function parseFourChoiceCSV(filePath: string): readonly QuestionData[] {
  const raw = stripBom(fs.readFileSync(filePath, 'utf-8'))
  const records: string[][] = parse(raw, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  })

  return records.map((row) => ({
    questionType: 'four_choice' as const,
    sourceId: row[0],
    questionText: row[1],
    choiceA: row[2],
    choiceB: row[3],
    choiceC: row[4],
    choiceD: row[5],
    correctAnswers: row[6],
    correctFeedback: row[9] || null,
    incorrectFeedback: row[10] || null,
  }))
}

/**
 * Parse ○× CSV (4-column format with header row).
 * Header: 番号, 問題文, 正解, 解説
 * 正解 is "○" or "×"
 */
function parseMaruBatsuCSV(filePath: string): readonly QuestionData[] {
  const raw = stripBom(fs.readFileSync(filePath, 'utf-8'))
  const records: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  return records.map((row) => {
    const isCorrect = row['正解'] === '○'
    return {
      questionType: 'true_false' as const,
      sourceId: row['番号'],
      questionText: row['問題文'],
      choiceA: '○',
      choiceB: '×',
      choiceC: '',
      choiceD: '',
      correctAnswers: isCorrect ? 'A' : 'B',
      correctFeedback: row['解説'] || null,
      incorrectFeedback: null,
    }
  })
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
    console.error('Refusing to run seed in production. Set ALLOW_PROD_SEED=true to override.')
    process.exit(1)
  }

  const csvDir = path.resolve(__dirname, '..', '..')

  const sources = [
    {
      label: '4択 新規100問',
      path: path.join(csvDir, 'output', '練習問題_4択_新規100問.csv'),
      parser: parseFourChoiceCSV,
    },
    {
      label: '4択 既存19問',
      path: path.join(
        csvDir,
        'reference',
        'questions-徒手療法26-練習問題 のデフォルト-20260318-1609.csv',
      ),
      parser: parseFourChoiceCSV,
    },
    {
      label: '○× 新規60問',
      path: path.join(csvDir, 'output', '練習問題_マルバツ_新規60問.csv'),
      parser: parseMaruBatsuCSV,
    },
    {
      label: '○× 既存50問',
      path: path.join(csvDir, 'output', '練習問題_マルバツ_既存50問.csv'),
      parser: parseMaruBatsuCSV,
    },
  ] as const

  // Validate all files exist before proceeding
  for (const src of sources) {
    if (!fs.existsSync(src.path)) {
      console.error(`CSV file not found: ${src.path}`)
      process.exit(1)
    }
  }

  // Parse all sources
  const allQuestions: QuestionData[] = []
  for (const src of sources) {
    const questions = src.parser(src.path)
    console.log(`${src.label}: ${questions.length} questions parsed`)
    allQuestions.push(...questions)
  }
  console.log(`\nTotal parsed: ${allQuestions.length} questions`)

  // Clear existing data (respect FK constraints)
  await prisma.answerHistory.deleteMany()
  await prisma.learningRecord.deleteMany()
  await prisma.question.deleteMany()
  console.log('Cleared existing question data')

  // Insert questions
  let created = 0
  for (const q of allQuestions) {
    const { code, name } = assignCategory(q.questionText)

    await prisma.question.create({
      data: {
        questionType: q.questionType,
        categoryCode: code,
        categoryName: name,
        questionText: q.questionText,
        choiceA: q.choiceA,
        choiceB: q.choiceB,
        choiceC: q.choiceC,
        choiceD: q.choiceD,
        correctAnswers: q.correctAnswers,
        correctFeedback: q.correctFeedback,
        incorrectFeedback: q.incorrectFeedback,
        similarityGroup: null,
      },
    })
    created++
  }

  console.log(`\nCreated: ${created} questions`)

  // Summary by category
  const categoryStats = await prisma.question.groupBy({
    by: ['categoryCode', 'categoryName'],
    _count: true,
    orderBy: { categoryCode: 'asc' },
  })
  console.log('\nCategory breakdown:')
  for (const s of categoryStats) {
    console.log(`  ${s.categoryCode} (${s.categoryName}): ${s._count} questions`)
  }

  // Summary by type
  const typeStats = await prisma.question.groupBy({
    by: ['questionType'],
    _count: true,
    orderBy: { questionType: 'asc' },
  })
  console.log('\nType breakdown:')
  for (const s of typeStats) {
    console.log(`  ${s.questionType}: ${s._count} questions`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
