# TechTrack AI

TechTrack AI is an AI-powered career growth and gamified learning platform for roadmap generation, daily tasks, XP, streaks, AI mentor support, progress tracking, and job-readiness workflows.

## Monorepo Structure

- `apps/web` - Next.js App Router web app and shared REST backend route handlers.
- `apps/mobile` - Flutter mobile client.
- `packages/database` - Prisma schema, migrations, seed files, and database package scripts.
- `packages/shared-types` - Shared TypeScript API and AI roadmap contract types.
- `packages/shared-config` - Shared constants and environment validation.
- `docs` - Architecture, API, setup, deployment, and AI prompt docs.

## Quick Start

```bash
npm install
cp apps/web/.env.local .env.local
npm run db:up
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The shared backend is served by Next.js route handlers under `apps/web/app/api`.

## Mobile

```bash
cd apps/mobile
flutter pub get
flutter run --dart-define=TECHTRACK_API_URL=http://localhost:3000
```

For Android emulators, use `http://10.0.2.2:3000`.

## Core MVP

- Email/password auth with shared session APIs.
- Career templates and AI-ready custom roadmap generation.
- Daily task planning, completion, XP, streaks, and levels.
- AI mentor and roadmap service structure.
- Admin-ready schema and dashboard folder structure.
- Future-ready models for subscriptions, notifications, audits, resume/interview agents, and organization roles.

## Useful Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run db:up
npm run db:generate
npm run db:push
npm run db:seed
```
