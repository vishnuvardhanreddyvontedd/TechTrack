This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## About TechTrack

TechTrack is a learning roadmap builder and tracker. Users can pick from curated roadmap templates or generate custom roadmaps, follow daily tasks, and earn XP, levels, streaks, and badges as they progress.

Key points:
- Prebuilt roadmap templates live in `app/lib/roadmap-data.ts`.
- User profile shows XP, progress bars, streaks, badges, and roadmap history (`app/(dashboard)/profile/page.tsx`).
- Built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma.

## Features
- Curated and extensible roadmap templates (frontend, backend, AI/ML, DevOps, mobile, data, and more).
- Create or generate custom roadmaps (AI-assisted).
- Per-day tasks with progress tracking and XP rewards.
- Gamification: levels, streaks, and badges to motivate learning.

## Dev Quickstart

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 and sign up or log in to explore roadmaps and your profile.

## Where to look in the code
- Templates: [app/lib/roadmap-data.ts](app/lib/roadmap-data.ts#L1-L400)
- Profile UI: [app/(dashboard)/profile/page.tsx](app/(dashboard)/profile/page.tsx#L1-L200)
- API routes and actions: `app/actions` and `app/api`
- Prisma schema and seeds: `prisma/`

## Contributing
PRs welcome. If you add templates or UI changes, prefer small, focused commits and update seeded data in `prisma/seed.mjs` when relevant.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
