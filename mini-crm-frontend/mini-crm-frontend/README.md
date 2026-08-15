# Mini CRM — Frontend (Next.js + TypeScript + Tailwind)

Frontend for the Mini CRM (Zoho-lite) app, built against your Spring Boot + MySQL backend.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- axios for API calls, JWT stored in `localStorage`
- recharts for the Reports & Analytics charts
- lucide-react for icons

## Pages built

- `/login`, `/register` — JWT auth against `/api/auth/login` and `/api/auth/register`
- `/dashboard` — stat cards, pipeline funnel, upcoming follow-ups (`/api/dashboard/stats`)
- `/contacts` — searchable, paginated contact list with add/edit/delete
- `/leads` — Kanban board (drag & drop stage changes via `PATCH /api/leads/{id}/status`)
- `/leads/[id]` — lead detail, stage workflow, activity timeline, schedule follow-up
- `/follow-ups` — all / today's follow-ups, add/edit/mark done/delete
- `/tasks` — task list with priority/status, add/edit/delete
- `/reports` — leads by source (pie) and by status (bar), plus summary stats
- `/settings` — user & role management (`/api/users`); an "Integrations" panel is shown for
  visual parity with the mockup but isn't wired to anything (your backend has no integrations
  API yet)

## Setup

```bash
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev
```

App runs on `http://localhost:3000`. `NEXT_PUBLIC_API_URL` defaults to
`http://localhost:8080/api`, matching your controllers' `@RequestMapping("/api/...")` prefixes.

## ⚠️ Your backend zip won't compile as-is

I built this frontend by reading every controller/DTO/service/repository in `mini-crm.zip` to
match your real API contract, field names, and enums exactly. While doing that I noticed the zip
is missing several files it depends on:

- **`entity/Lead.java`, `entity/User.java`, `entity/Contact.java`** — referenced everywhere
  (repositories, services, `DataSeeder`) but not present in `src/main/java/com/minicrm/entity/`.
- **`security/JwtUtil.java`** and a Spring Security config (`SecurityConfig`) — `AuthService`
  injects `JwtUtil` and `AuthenticationManager`, but the `security/` package is empty and there's
  no `PasswordEncoder`/`AuthenticationManager` bean definition anywhere.
- **`application.properties`** only has `spring.application.name` — no `spring.datasource.*`
  (MySQL URL/user/password), no JWT secret, and no CORS configuration for the frontend to call
  it from `localhost:3000`.

None of this affects how I built the frontend — the controllers, DTOs, and enums that *are*
present fully define the contract, so I coded against those. But the backend won't start until
those three pieces exist. Happy to write the missing `Lead`/`User`/`Contact` entities, a
`JwtUtil` + `SecurityConfig` (with CORS opened for `localhost:3000`), and a filled-in
`application.properties` if you'd like — just say the word.

## Notes / assumptions

- `Lead.status` enum assumed as `NEW, CONTACTED, INTERESTED, PROPOSAL, NEGOTIATION, WON, LOST`
  (matches the funnel stages in your mockup and the `DataSeeder` sample data).
- `User.role` assumed as `ADMIN, MANAGER, SALES_REP` (confirmed from `DataSeeder`).
- The `ActivityController` only exposes `GET /api/activities` and
  `GET /api/activities/lead/{leadId}` — there's no `POST`, so the lead detail page shows the
  activity timeline read-only. Activities do get created automatically server-side (lead
  creation, stage changes, follow-up scheduling), so the timeline still populates.
- Deals (`/api/deals`) aren't shown in your mockup as their own screen, so I didn't build a
  dedicated Deals UI — the pipeline/kanban view works off `Lead`, matching the mockup. Let me
  know if you want a Deals board too.
