// prisma/seed.ts — run with: npm run db:seed (uses npx tsx)
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'
import { ROADMAP_TEMPLATES } from '../app/lib/roadmap-data'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as any)

async function main() {
  console.log('🌱 Seeding roadmap templates...')
  for (const template of ROADMAP_TEMPLATES) {
    const { days, ...templateData } = template
    const existing = await prisma.roadmapTemplate.findUnique({ where: { slug: templateData.slug } })
    if (existing) { console.log(`  ⏭  Skipping "${templateData.title}"`); continue }
    await prisma.roadmapTemplate.create({
      data: {
        ...templateData,
        dayTemplates: {
          create: days.map((d) => ({
            dayNumber: d.dayNumber, title: d.title,
            description: d.description, estimatedMinutes: d.estimatedMinutes,
            resources: d.resources,
          })),
        },
      },
    })
    console.log(`  ✅ Created "${templateData.title}" (${days.length} days)`)
  }
  console.log('✨ Done!')
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })
