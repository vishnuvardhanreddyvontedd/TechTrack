// app/(dashboard)/create/page.tsx
import type { Metadata } from 'next'
import { prisma } from '@/app/lib/prisma'
import CreateClient from './CreateClient'

export const metadata: Metadata = { title: 'Create Roadmap' }

export default async function CreatePage() {
  const templates = await prisma.roadmapTemplate.findMany({
    orderBy: { title: 'asc' },
  })
  return <CreateClient templates={templates} />
}
