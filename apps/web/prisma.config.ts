import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'
import * as path from 'path'

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
