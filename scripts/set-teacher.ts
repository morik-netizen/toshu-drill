import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.argv[2] ?? process.env.TEACHER_EMAIL
  if (!email) {
    console.error('Usage: npx tsx scripts/set-teacher.ts <email>')
    console.error('   or: TEACHER_EMAIL=<email> npx tsx scripts/set-teacher.ts')
    process.exit(1)
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) {
    console.log(`User not found: ${email}`)
    console.log('You need to log in to the app first to create your account.')
    return
  }

  console.log('Before:', user)

  if (user.role === 'teacher') {
    console.log('Already a teacher. No change needed.')
    return
  }

  const result = await prisma.user.update({
    where: { email },
    data: { role: 'teacher' },
    select: { id: true, name: true, email: true, role: true },
  })

  console.log('After:', result)
  console.log('Done! Role updated to teacher.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
