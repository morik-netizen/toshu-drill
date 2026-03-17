import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: InstanceType<typeof PrismaClient> }

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!
  const rdsCaCert = process.env.RDS_CA_CERT

  const adapter = new PrismaPg({
    connectionString,
    ssl: rdsCaCert
      ? { rejectUnauthorized: true, ca: Buffer.from(rdsCaCert, 'base64').toString() }
      : undefined,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
