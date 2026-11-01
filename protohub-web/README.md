# ProtoHub Web

Next.js 15 (App Router) + TypeScript + Tailwind frontend for ProtoHub.

## Setup

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your running backend
npm run dev                  # http://localhost:3000
```

The backend (`../protohub-backend`) must be running first — see its README.

## What's built

Fully wired to the live API:
- **Auth** — register, login, logout, silent access-token refresh on 401
- **Dashboard** — your projects + recent notifications
- **Project discovery** — search, status filters
- **Project creation**
- **Project workspace** — Overview / Board / Chat / Team tabs
  - **Board**: real drag-and-drop (native HTML5 DnD, no extra library) with optimistic updates, inline task creation, task deletion
  - **Chat**: Socket.IO realtime with REST history and a REST send fallback, read receipts
  - **Team**: member list, request-to-join, accept/reject requests (owners/maintainers)
- **Profile settings**
- **Notifications** — list, mark read, mark all read
- **Search** — projects + people

## What's intentionally minimal

- **Mentorship** (`/mentorship`) — the backend API is fully built; this page is a bare read-only view, not a polished UI, to keep this pass's scope honest.
- **AI Assistant, Admin, Uploads** — backend APIs exist (see backend README) but have no frontend pages yet. Follow the pattern in `src/hooks/` + any `(app)` route to add them — each existing feature module is a template for the next.

## Architecture notes

- **`src/lib/api-client.ts`** — fetch wrapper with automatic refresh-token rotation on a 401, mirroring the backend's Auth module exactly.
- **`src/hooks/`** — one file per resource, each a thin TanStack Query wrapper. `use-tasks.ts`'s `useMoveTask` does an optimistic local reorder before the request resolves, matching the backend's reindexing transaction.
- **`src/components/ui/`** — hand-built primitives (Button, Input, Card, Avatar, StatusDot, Badge), not a full shadcn/ui install, to keep the dependency footprint small. `StatusDot` is the app's one consistent visual motif for every kind of status (project status, task priority, request status) — one color-mapping utility, used everywhere.
- **No client-side global state library** — auth session lives in a small React Context (`auth-context.tsx`); everything else is server state via TanStack Query, which doesn't need a separate client store.

## Known gaps

- No tests (component or e2e) — this frontend has not been run against a live backend in the environment it was built in (see root README for why).
- No image upload UI — the Uploads module's signed-upload flow exists on the backend but nothing in the frontend calls it yet; avatar URLs are entered as plain text for now.
