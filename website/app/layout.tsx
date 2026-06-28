// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TechTrack — Personalized Career Roadmaps',
    template: '%s | TechTrack',
  },
  description: 'Generate a personalized career roadmap for any goal, track daily tasks, earn XP, and level up your skills.',
  keywords: ['career roadmap', 'learning path', 'AI roadmap', 'daily tasks', 'skill development'],
  openGraph: {
    title: 'TechTrack — Personalized Career Roadmaps',
    description: 'AI-powered career roadmaps with daily tasks, streaks, and gamification.',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
