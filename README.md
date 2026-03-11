# Job Automation Platform (SaaS)

This repo is the foundation for a resume-driven job matching + approval-first auto-apply platform.
It is designed as a multi-tenant SaaS with a connector system that supports API-based, automation-based,
and manual-only job sources.

## What This Does
- Resume upload and parsing into structured profile + skills
- Skill confirmation and enrichment
- Job ingestion and matching
- Approval queue before applying
- Automated apply (where allowed) with audit trail

## High-Level Architecture
See `docs/architecture.md`.

## Data Model
See `docs/data-model.md`.

## API Surface
See `docs/api.md`.

## Workflow Orchestration (n8n)
See `docs/workflows.md`.

## Project Layout
- `apps/web`: Web app (Next.js planned)
- `apps/api`: API service (NestJS planned)
- `services/worker`: Automation worker (Playwright + queue)
- `connectors`: Per-platform connectors and policies
- `db`: Database schema and migrations
- `n8n`: Workflow templates and notes
- `docs`: System design docs

## Next Steps
1. Confirm target region and compliance constraints
2. Pick the initial connector list (prioritize)
3. Scaffold `apps/web` and `apps/api` with dependencies
4. Implement auth + orgs + resume upload flow

## Dev Commands
- `npm run dev:web`
- `npm run dev:api`
