// prisma.config.ts
// Prisma 7 requires datasource URL to be configured here (not in schema.prisma).
// We load .env.local manually since Next.js auto-loads it but `prisma` CLI does not.

import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local for prisma CLI commands (migrate, seed, studio)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.local') })

export default defineConfig({
  schema: '../../packages/database/prisma/schema.prisma',
  migrations: {
    path: '../../packages/database/prisma/migrations',
    seed: 'npx tsx ../../packages/database/prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
})
