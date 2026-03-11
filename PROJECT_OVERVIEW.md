# AutomateApply — Project Overview

## What This Project Is
AutomateApply is a resume‑driven job automation platform. Users upload a resume, confirm skills, view matched jobs, and approve applications before any automation runs. The platform is built as a multi‑tenant SaaS with a protected dashboard.

## Current Status
The core web app + API are implemented and secured. Authentication is enforced and user‑specific data is shown across the dashboard. The app includes matching, approvals, and job details with reference links.

---

## Features Implemented (Working)

### Authentication + Security
- Email/password sign‑up and login
- Google OAuth login (via NextAuth)
- JWT‑based API authentication
- Protected routes: only `/` (landing), `/login`, `/register` are public
- All dashboard pages require login

### User + Org
- Each user gets a personal org workspace
- Users are stored in Postgres
- User metadata is available at `GET /users/me`

### Resume Upload
- Uploads handled via API (`POST /resumes`)
- Stored on disk (uploads folder)
- Resumes listable by user (`GET /resumes`)

### Skills
- Save skills for a logged‑in user
- Fetch saved skills for profile and onboarding

### Matching
- Simple scoring based on skill match in job description
- Recompute matches on demand

### Approval Queue
- Add match to approvals
- Approve / reject from queue

### Applications
- Approving creates an application record
- Applications list available on dashboard

### Job Details + References
- Match cards show **Reference** link (actual job URL)
- “See details” opens `/jobs/[id]`

---

## Frontend Pages (All Protected Except Landing)

### Public
- `/` — Landing page
- `/login`
- `/register`

### Protected
- `/dashboard` — Main dashboard with upload, skills, matches, approvals
- `/onboarding` — Guided onboarding + existing user data
- `/matches` — Match list with reference + details buttons
- `/approvals` — Approval queue
- `/applications` — Applications status
- `/connectors` — Connector status (manual vs automation)
- `/profile` — User data, skills, resumes
- `/settings` — Automation + notification preferences
- `/jobs/[id]` — Job detail view

---

## API Endpoints Implemented

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/oauth` (Google sign‑in handshake)

### Users
- `GET /users/me`

### Resumes
- `POST /resumes`
- `GET /resumes`
- `GET /resumes/:id`

### Skills
- `GET /skills`
- `GET /skills/users/me`
- `POST /skills/users/me`

### Jobs
- `GET /jobs`
- `GET /jobs/:id`
- `POST /jobs/seed` (seed demo jobs)

### Matches
- `GET /matches`
- `POST /matches/recompute`

### Approvals
- `GET /approvals`
- `POST /approvals`
- `POST /approvals/:id/approve`
- `POST /approvals/:id/reject`

### Applications
- `GET /applications`

---

## Tech Stack

Frontend
- Next.js (App Router)
- Tailwind CSS
- NextAuth for auth

Backend
- NestJS (Node.js)
- PostgreSQL (Supabase)
- JWT authentication + bcrypt

Automation (Planned)
- n8n workflows
- Playwright worker

### Automation Flow (Planned)
1. User approves a job in the approval queue.
2. API creates an `applications` row and emits an `application_queued` event.
3. n8n listens to the event (webhook or polling).
4. n8n triggers the Playwright worker with job + user context.
5. Worker opens the job link, fills fields, uploads resume, submits.
6. Worker returns success/failure + screenshot + timing data.
7. API writes `application_events` and final status.
8. UI updates the Applications page and notifies the user.

### What I Need To Implement This
- n8n instance URL + credentials (or permission to install locally)
- Which platforms are allowed for automation first (e.g., Naukri only)
- A test user account for those platforms
- Approved approach for storage of credentials (encrypted DB or vault)
- Any compliance constraints (rate limits, manual fallback rules)

---

## What’s Still Remaining

### High Priority
1. Resume parsing (PDF/DOCX → extracted skills)
2. Real job ingestion (Naukri/LinkedIn/Indeed)
3. Automation engine (n8n + Playwright apply flow)
4. Notifications (email for approvals + application status)

### Phase 2
5. Billing + SaaS plans (Stripe)
6. Analytics + audit logs
7. Retry queue + error handling
8. Advanced matching model

---

## How to Run

Backend:
```
npm --prefix apps/api run start:dev
```

Frontend:
```
npm --prefix apps/web run dev
```

---

## Notes
- All protected pages require login.
- Landing page is public and only shows marketing content.
- The “Seed Sample Jobs” button in dashboard creates demo data for testing.
