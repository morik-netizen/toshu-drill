import { PrismaClient } from '../src/generated/prisma/client'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// カテゴリ → unlock_date マッピング (木曜6:00 AM)
const UNLOCK_DATES: Record<string, string> = {
  '1C': '2026-04-16',
  '1B': '2026-04-16',
  '4A': '2026-04-23',
  '4B': '2026-04-23',
  '4C': '2026-04-30',
  '4D': '2026-04-30',
  '4E': '2026-05-14',
  '4F': '2026-05-21',
  '4G': '2026-05-21',
  '5A': '2026-05-28',
  '5B': '2026-05-28',
  '5C': '2026-05-28',
  '5D': '2026-05-28',
  '5E': '2026-05-28',
  '5F': '2026-06-04',
  '3B': '2026-06-11',
  '3A': '2026-06-18',
  '3D': '2026-06-25',
  '3C': '2026-07-02',
  '2A': '2026-07-09',
  '2B': '2026-07-09',
}

interface CsvRow {
  questionname: string
  questiontext: string
  A: string
  B: string
  C: string
  D: string
  'Answer 1': string
  'Answer 2': string
  answernumbering: string
  correctfeedback: string
  partiallycorrectfeedback: string
  incorrectfeedback: string
  defaultmark: string
}

function parseCategoryCode(questionname: string): {
  categoryCode: string
  categoryName: string
} {
  const firstSpace = questionname.indexOf(' ')
  if (firstSpace === -1) {
    return { categoryCode: questionname, categoryName: questionname }
  }
  return {
    categoryCode: questionname.substring(0, firstSpace),
    categoryName: questionname.substring(firstSpace + 1),
  }
}

function buildCorrectAnswers(answer1: string, answer2: string): string {
  const parts = [answer1.trim()].filter(Boolean)
  if (answer2.trim()) {
    parts.push(answer2.trim())
  }
  return parts.sort().join(',')
}

async function main() {
  const csvPath = path.resolve(
    __dirname,
    '../../refelence/関係法規2026年_出題基準ベース項目わけ.csv'
  )

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const records: CsvRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  console.log(`Parsed ${records.length} questions from CSV`)

  // 既存データをクリア
  await prisma.question.deleteMany()

  let created = 0
  let skipped = 0

  for (const row of records) {
    const { categoryCode, categoryName } = parseCategoryCode(row.questionname)
    const unlockDateStr = UNLOCK_DATES[categoryCode]

    if (!unlockDateStr) {
      console.warn(
        `Unknown category code: ${categoryCode} (${row.questionname})`
      )
      skipped++
      continue
    }

    const correctAnswers = buildCorrectAnswers(
      row['Answer 1'],
      row['Answer 2']
    )

    await prisma.question.create({
      data: {
        categoryCode,
        categoryName,
        questionText: row.questiontext,
        choiceA: row.A,
        choiceB: row.B,
        choiceC: row.C,
        choiceD: row.D,
        correctAnswers,
        correctFeedback: row.correctfeedback || null,
        incorrectFeedback: row.incorrectfeedback || null,
        similarityGroup: null,
        unlockDate: new Date(unlockDateStr),
      },
    })
    created++
  }

  console.log(`Created: ${created}, Skipped: ${skipped}`)

  // 集計表示
  const stats = await prisma.question.groupBy({
    by: ['categoryCode'],
    _count: true,
    orderBy: { categoryCode: 'asc' },
  })
  console.log('\nCategory breakdown:')
  for (const s of stats) {
    console.log(`  ${s.categoryCode}: ${s._count} questions`)
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
