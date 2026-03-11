# API Surface (Draft)

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

## Orgs
- `GET /orgs`
- `POST /orgs`
- `GET /orgs/:id`

## Resumes
- `POST /resumes` (upload)
- `GET /resumes/:id`

## Skills
- `GET /skills`
- `POST /users/:id/skills`

## Jobs
- `GET /jobs`
- `GET /jobs/:id`

## Matches
- `GET /matches`
- `POST /matches/recompute`

## Approval Queue
- `GET /approvals`
- `POST /approvals/:id/approve`
- `POST /approvals/:id/reject`

## Applications
- `GET /applications`
- `GET /applications/:id`

