import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> }

function loadRdsCaCert(): string | undefined {
  const certPaths = [
    join(process.cwd(), 'global-bundle.pem'),
    join(__dirname, 'global-bundle.pem'),
    join(__dirname, '..', 'global-bundle.pem'),
    join(__dirname, '..', '..', 'global-bundle.pem'),
  ]
  for (const p of certPaths) {
    if (existsSync(p)) return readFileSync(p, 'utf-8')
  }
  return undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!
  const ca = loadRdsCaCert()

  const adapter = new PrismaPg({
    connectionString,
    ssl: ca
      ? { rejectUnauthorized: true, ca }
      : undefined,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
