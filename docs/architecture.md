# Architecture

## Goals
- Multi-tenant SaaS with approval-first automation
- Extensible connector system for many job platforms
- Compliance-aware automation (API where possible, automation where allowed, manual-only otherwise)

## Core Services
- Web App (Next.js)
- API Service (NestJS/Node)
- Matching + Parsing Service
- Automation Orchestrator (n8n)
- Automation Worker (Playwright + queue)
- Data Store (Postgres)
- File Store (S3)
- Queue/Cache (Redis)

## Connector Types
- `api`: Official platform APIs, preferred
- `automation`: Headless browser automation (approval required)
- `manual-only`: Assisted apply (open link + pre-fill guidance)

## Data Flow
1. User uploads resume
2. Parser extracts skills and experience
3. User confirms/edit skills
4. Job sources ingest jobs (API or automation)
5. Matching engine ranks jobs by fit
6. User approves a job for application
7. Orchestrator launches connector workflow
8. Worker applies and logs results
9. Audit trail updates application status

## Security & Compliance
- Approval gate before any automated action
- Per-source rate limiting and throttling
- Audit logs for every action
- Respect platform terms where required

