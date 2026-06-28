# API Routes

The backend is exposed from `apps/web/app/api`.

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## User and Onboarding

- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/progress`
- `POST /api/onboarding`
- `GET /api/onboarding/status`

## Roadmaps and Tasks

- `POST /api/roadmaps/generate`
- `GET /api/roadmaps/me`
- `GET /api/roadmaps/[id]`
- `GET /api/tasks/today`
- `POST /api/tasks/[id]/complete`
- `POST /api/tasks/[id]/skip`
- `POST /api/tasks/reschedule`

## AI

- `POST /api/ai/roadmap`
- `POST /api/ai/mentor`
- `POST /api/ai/daily-task`
- `POST /api/ai/quiz`

## Admin

Admin routes should require `User.role = ADMIN`.

- `GET /api/admin/users`
- `GET /api/admin/analytics`
- CRUD `/api/admin/careers`
- CRUD `/api/admin/prompts`
