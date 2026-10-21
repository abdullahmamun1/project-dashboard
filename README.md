# Project Submission & Review Dashboard

Students submit their projects (name, GitHub repository, live link, description). Mentors review them from a paginated, server-filtered dashboard, approve or reject them with feedback, and track totals. Students see the status and feedback, and can resubmit a rejected project.

| App      | Stack                                                                                       |
| -------- | ------------------------------------------------------------------------------------------- |
| `client` | Next.js 16 (App Router, cache components), TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), TanStack Query, TanStack Form, zod |
| `server` | Express 5, TypeScript (ES modules, bundled with tsup), Prisma ORM 7 + PostgreSQL (Prisma Postgres), JWT, zod |

**Demo mentor account** (seeded): `mentor@example.com` / `Mentor@12345`. Students sign up from `/register`.

## Features

**Student (`/student`)**
- Submission form with validation in the browser and the API (same rules on both sides).
- The repository must be a GitHub repo URL (`https://github.com/owner/repo`). The live link must be a real `http(s)` domain and can't be a GitHub page.
- Duplicate prevention: repo URLs are normalized (case, `www.`, `.git`, trailing slash, query), and a repository can have only one *active* (pending or approved) submission. After a rejection, the same student can resubmit it; a repo first submitted by another student is refused.
- Rate limit: at most 5 submissions per student per hour, counted in the database so it holds across serverless instances.
- Submission history with status, mentor feedback, reviewer and date, plus one-click **Resubmit** for rejected projects.

**Mentor (`/mentor`)**
- Stats: total, pending, approved, rejected and approval rate (one `groupBy` query).
- Paginated table with status tabs (All / Pending / Approved / Rejected) and search by project name, student name or email. Filtering, search and pagination all happen in the database query; the state lives in the URL, so a filtered view survives a refresh and can be shared.
- Approve / reject dialog. Rejection requires feedback (at least 10 characters). Only pending submissions can be reviewed, enforced with a conditional update, so two mentors can't review the same submission.

**Auth**
- Login page for both roles and a signup page that always creates a `STUDENT`. The mentor is seeded.
- JWT in an httpOnly cookie, a role guard on every API route (`auth(...roles)`, which re-loads the user so role changes apply immediately), and a role-based route guard in `client/src/proxy.ts`.
- Login and signup are rate-limited to 10 requests per 15 minutes per IP; the whole API to 100 per 15 minutes.

## How the pieces fit

```
Browser ──► Next.js (client)  ── /api/* rewrite ──►  Express (server) ──► Prisma ──► PostgreSQL
            proxy.ts route guard                     auth + role guard
```

The browser only ever talks to the Next.js origin. `next.config.ts` rewrites `/api/*` to the Express deployment, so the httpOnly auth cookie is first-party even though the two apps are on different domains. `proxy.ts` verifies the same JWT (shared `JWT_SECRET`) to redirect users to the right area; the API re-checks every request, so the proxy is never the security boundary.

The partial unique index `UNIQUE (repoUrl) WHERE status <> 'REJECTED'` is written by hand in the init migration (`server/prisma/migrations/*_init/migration.sql`), because Prisma's schema language can't express partial indexes.

## Project structure

```
client/src/
  app/(public)/(marketing)       landing page
  app/(public)/(authentication)  login, register
  app/(dashboard)/student|mentor dashboards (+ loading.tsx)
  api/          one file per backend module (thin apiClient calls)
  hooks/        TanStack Query hooks, URL state for the mentor table
  components/   ui (shadcn), shared, layout, modules/{auth,student,mentor,marketing}
  lib/ constants/ types/ utils/ validation/ providers/
  proxy.ts      role-based route guard

server/
  prisma/schema/   schema.prisma (generator + datasource), enums, user, submission
  prisma/seed.ts   seeds the mentor account
  src/app.ts       middleware stack, default export used by Vercel
  src/server.ts    local entry point: seeds the mentor, listens
  src/config/      validated environment loader
  src/middleware/  auth, validateRequest, rateLimiter, globalErrorHandler
  src/routes/      mounts modules under /api/v1
  src/modules/     auth, user, submission (route/controller/service/validation/interface)
  src/lib/ src/utils/
```

## Running locally

Requirements: Node.js 22+ and a PostgreSQL database (a [Prisma Postgres](https://www.prisma.io/postgres) database works; use its direct `postgres://` connection string).

```bash
# 1. API
cd server
cp .env.example .env          # fill in DATABASE_URL and JWT_SECRET
npm install                   # also generates the Prisma client
npm run db:deploy             # apply migrations (use db:migrate while changing the schema)
npm run db:seed               # create the mentor account from MENTOR_* env vars
npm run dev                   # http://localhost:4000

# 2. Web app (second terminal)
cd client
cp .env.example .env.local    # API_URL=http://localhost:4000, same JWT_SECRET as the server
npm install
npm run dev                   # http://localhost:3000
```

The API defaults to port 4000 because macOS uses port 5000 for AirPlay.

### Scripts

| Where    | Command              | What it does                                              |
| -------- | -------------------- | --------------------------------------------------------- |
| `server` | `npm run dev`        | Watch mode with tsx                                       |
|          | `npm run build`      | `prisma generate` + tsup bundle to `dist/` (ES modules)   |
|          | `npm start`          | Run the built server (`dist/server.js`)                   |
|          | `npm run typecheck`  | `tsc --noEmit`                                            |
|          | `npm run db:migrate` | Create/apply a migration in development                   |
|          | `npm run db:deploy`  | Apply pending migrations (production)                     |
|          | `npm run db:seed`    | Seed the mentor account (idempotent)                      |
| `client` | `npm run dev`        | Next.js dev server                                        |
|          | `npm run build`      | Production build                                          |
|          | `npm run lint`       | ESLint                                                    |
|          | `npm run typecheck`  | Generate route types, then `tsc --noEmit`                 |

### Environment variables

| App      | Variable                                         | Notes                                                              |
| -------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `server` | `DATABASE_URL`                                   | Direct `postgres://` connection string (not `prisma+postgres://`)  |
|          | `JWT_SECRET`                                     | At least 32 characters; must match the client                     |
|          | `JWT_EXPIRES_IN`                                 | Default `7d`                                                       |
|          | `CLIENT_URL`                                     | Allowed CORS origin(s), comma-separated                            |
|          | `PORT`                                           | Default `4000` (local only)                                        |
|          | `MENTOR_NAME`, `MENTOR_EMAIL`, `MENTOR_PASSWORD` | Used by the seed                                                   |
| `client` | `API_URL`                                        | Express base URL, no trailing slash; target of the `/api/*` rewrite |
|          | `JWT_SECRET`                                     | Same value as the server; used by `proxy.ts`                       |

## API

Base path `/api/v1`. Responses use `{ success, message, data, meta? }`; errors use `{ success: false, message, errors? }` with per-field messages.

| Method | Path                       | Access  | Purpose                                                 |
| ------ | -------------------------- | ------- | ------------------------------------------------------- |
| POST   | `/auth/register`           | public  | Student signup (sets cookie)                            |
| POST   | `/auth/login`              | public  | Login (sets cookie)                                     |
| POST   | `/auth/logout`             | any     | Clear the cookie                                        |
| GET    | `/auth/me`                 | auth    | Current user                                            |
| POST   | `/submissions`             | student | Create a submission                                     |
| GET    | `/submissions/me`          | student | Own submissions with status and feedback                |
| GET    | `/submissions`             | mentor  | `?page&limit&status=ALL\|PENDING\|APPROVED\|REJECTED&search&sortOrder` |
| GET    | `/submissions/stats`       | mentor  | `{ total, pending, approved, rejected }`                |
| PATCH  | `/submissions/:id/review`  | mentor  | `{ status: "APPROVED" \| "REJECTED", feedback? }`       |
| GET    | `/health`                  | public  | Health check                                            |

The web app uses the cookie; the API also accepts `Authorization: Bearer <token>` (login and signup return `accessToken`) for tools like Postman.

## Deployment (Vercel)

Both apps deploy as separate Vercel projects from this repository. Deploy the API first, because the web app needs its URL.

### 1. Database

Using the production `DATABASE_URL`, from `server/`:

```bash
npm run db:deploy
MENTOR_PASSWORD='<a strong password>' npm run db:seed
```

The seed never changes an existing account's password. To change the password of a mentor that's already seeded, change it in the database or seed a different `MENTOR_EMAIL`.

### 2. API project (`server/`)

`server/vercel.json` already configures the build: Express framework preset, `npm run build` (tsup) and output directory `dist`. Vercel serves `dist/app.js`, so it never type-checks or compiles the TypeScript itself.

**Dashboard:** *Add New → Project →* import the GitHub repo, set **Root Directory** to `server`, leave the other build settings as they are, add the environment variables below, then **Deploy**.

**CLI:**

```bash
cd server
vercel link                                    # create or link the project
vercel env add DATABASE_URL production --sensitive
vercel env add JWT_SECRET production --sensitive   # e.g. from: openssl rand -hex 32
vercel env add JWT_EXPIRES_IN production           # 7d
vercel deploy --prod
```

Check it: `curl https://<api-domain>/api/v1/health` should return `{"success":true,"message":"OK",...}`.

### 3. Web app project (`client/`)

**Dashboard:** import the same repo again, set **Root Directory** to `client` (Next.js is detected automatically), add the variables below, then **Deploy**.

| Variable     | Value                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| `API_URL`    | The API's production URL, e.g. `https://<api-project>.vercel.app` (no trailing slash) |
| `JWT_SECRET` | Exactly the same value as the API's `JWT_SECRET`                       |

**CLI:**

```bash
cd client
vercel link
vercel env add API_URL production
vercel env add JWT_SECRET production --sensitive
vercel deploy --prod
```

Use the API's **production** domain for `API_URL`. Preview deployment URLs are behind Vercel Deployment Protection by default, so the rewrite would get Vercel's login page instead of the API.

### 4. Connect the two

1. On the API project, set `CLIENT_URL` to the web app's production URL (for example `https://<client-project>.vercel.app`) and redeploy the API.
2. Open the web app: register a student, submit a project, log in as the mentor in another browser, and approve or reject it.
