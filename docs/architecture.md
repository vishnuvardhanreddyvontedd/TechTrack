# Architecture

TechTrack AI uses a monorepo with a Next.js backend-for-frontend and Flutter as a lightweight API-driven client.

## Applications

- `apps/web`: renders the public site, learner dashboard, admin surfaces, and exposes shared REST APIs through Next.js route handlers.
- `apps/mobile`: Flutter UI, local token storage, Dio API client, Riverpod state providers, and notification-ready platform folders.

## Packages

- `packages/database`: Prisma schema, migrations, generated client target, and seed scripts.
- `packages/shared-types`: API contracts and AI roadmap output contracts.
- `packages/shared-config`: career constants, XP values, and server environment validation.

## Backend Pattern

Route handlers under `apps/web/app/api` are the shared backend for web and mobile. Heavy logic stays server-side: AI calls, roadmap persistence, analytics, gamification, and admin operations.

## Future Agents

The schema and folders are ready for Roadmap, Mentor, Interview, Resume, GitHub Review, Progress, and Job agents. Each agent should own a prompt, tool boundary, user context loader, validation schema, and persistence strategy.
