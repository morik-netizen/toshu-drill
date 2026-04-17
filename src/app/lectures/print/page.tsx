import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getPrintPayload } from '@/lib/actions/lectures-print'
import { LECTURE_UNITS } from '@/lib/lecture-content'
import { PrintLayout } from '@/components/print/PrintLayout'
import { PrintPageClient } from '@/components/print/PrintPageClient'
import './print.css'

interface PrintPageProps {
  searchParams: Promise<{
    unit?: string
    all?: string
    autoprint?: string
  }>
}

export default async function PrintPage({ searchParams }: PrintPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const { unit, all, autoprint } = await searchParams

  const isAll = all === 'true'
  let targetUnitIds: string[] | undefined

  if (isAll) {
    targetUnitIds = undefined
  } else if (unit) {
    const exists = LECTURE_UNITS.some((u) => u.unitId === unit)
    if (!exists) {
      notFound()
    }
    targetUnitIds = [unit]
  } else {
    notFound()
  }

  const payload = await getPrintPayload({ unitIds: targetUnitIds })
  if (!payload) {
    redirect('/login')
  }

  return (
    <PrintPageClient autoprint={autoprint === '1'}>
      <PrintLayout payload={payload} />
    </PrintPageClient>
  )
}
