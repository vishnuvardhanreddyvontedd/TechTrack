// lib/prisma.ts
// Prisma 7 requires a Driver Adapter — we use @prisma/adapter-pg with the `pg` Pool.
// The singleton pattern avoids creating a new Pool on every hot-reload in development.

import 'server-only'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/app/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pgPool: Pool | undefined
}

function createPrismaClient(): PrismaClient {
  globalForPrisma.pgPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  })

  const adapter = new PrismaPg(globalForPrisma.pgPool)

  return new PrismaClient({
    adapter,
    // Enable query logging in development
    ...(process.env.NODE_ENV === 'development' && {
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    }),
  })
}

export function getPrisma() {
  globalForPrisma.prisma ??= createPrismaClient()
  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPrisma(), prop, receiver)
  },
})
