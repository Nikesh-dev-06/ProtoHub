# ProtoHub

The Operating System for Project-Based Learning and Mentorship — a production-track SaaS platform where students, mentors, and industry professionals discover projects, form teams, and build together in a shared workspace (Kanban board, group chat, AI assistant, files, activity timeline).

This repo has two parts:

```
protohub-backend/   NestJS + PostgreSQL + Prisma API
protohub-web/        Next.js 15 + TypeScript + Tailwind frontend
```

Each has its own README with setup instructions. Start the backend first.

## Honest status

This was built across an extended session, module by module, following: Requirement Analysis → Database Design → API Design → Backend Implementation → Frontend Implementation → Testing → Refactoring. That process was kept for the backend's core modules. Later modules and the entire frontend were built faster to cover the full MVP scope, with lighter testing — flagged honestly below rather than glossed over.

**What's real and verified:**
- Full Postgres schema (20 models), migration, seed data
- All 11 backend modules implemented, type-checked clean
- Backend unit tests for Auth, Projects, Tasks, Chat (the modules with the highest-risk logic — token rotation, drag-and-drop reindexing, authorization boundaries, event-driven membership sync)
- Frontend **actually built with `npx next build`** — a real production build, not just a type-check — covering Auth, Dashboard, Project discovery/creation, the full Project workspace (Kanban board with real drag-and-drop, Socket.IO chat, team management), Profile settings, Notifications, Search

**What's genuinely incomplete — read this before treating it as production-ready:**
- **The backend has never run against a live database.** The sandbox this was built in has no network access to Prisma's engine binaries or a real Postgres instance. The migration SQL was hand-verified against the schema, not generated and executed. **Your first step should be `npx prisma migrate deploy` against a real database** — that's the actual integration test this project hasn't had yet.
- **Backend and frontend have never talked to each other.** Both were verified independently (backend via `tsc`, frontend via a real `next build`). Wiring them together for the first time will likely surface small mismatches — mismatched field names, an endpoint shape that's slightly off, a CORS setting to adjust.
- **Test coverage thins out after the first four backend modules.** Users, Mentorship, Notifications, Search, Uploads, AI, and Admin have no automated tests.
- **Frontend coverage thins out too.** Mentorship has only a bare read-only stub page. AI Assistant, Admin, and Uploads have working backend APIs but **no frontend at all** — follow the pattern in any existing `(app)` route + its matching `src/hooks/*.ts` file to add them; each built feature is a template for the next.
- **No e2e tests, no CI pipeline, no Dockerfile, no deployment config** for the Vercel/Railway/Neon targets named in the original brief.
- **The AI module's OpenAI integration is untested** — `api.openai.com` isn't reachable from the sandbox this was built in, so it's correct by code review, not by execution.

## Recommended next steps, in order

1. `cd protohub-backend && npm install && npx prisma generate && npx prisma migrate deploy && npm run prisma:seed`
2. `npm run start:dev` — confirm the API boots and `GET /api/v1/auth/me` (with a real token from `/auth/register`) works
3. `cd ../protohub-web && npm install && npm run dev` — point `NEXT_PUBLIC_API_URL` at the running backend, walk through register → create a project → add a task → drag it → send a chat message
4. Fix whatever breaks in step 3 — there will be something
5. Add tests for the modules that don't have them yet, starting with whichever one you're about to build on top of
6. Then, and only then, start thinking about CI/Docker/deployment

## Design system (frontend)

Linear/Notion/GitHub-inspired per the original brief: dark-mode-first, a single violet-indigo accent (`#6C5CE7`), and one consistent signature motif — a small colored **status dot** used for every kind of status in the app (project status, task priority, join-request state, mentorship state) via one shared color-mapping utility (`components/ui/status-dot.tsx`), so status always looks and means the same thing everywhere.
