# Setup Guide

## Environment

Create `.env.local` at the repo root or use `apps/web/.env.local`.

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
SESSION_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

## Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## Web

```bash
npm run dev
```

## Mobile

```bash
cd apps/mobile
flutter pub get
flutter analyze
```
