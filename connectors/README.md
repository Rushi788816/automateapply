# Connectors

Each platform connector implements:
- Source metadata
- Policy (rate limits, compliance notes)
- Apply strategy (`api` | `automation` | `manual-only`)
- Mapping rules for job fields

Initial connector registry lives in `connectors/sources.json`.
We will keep everything `manual-only` until the platform’s automation policy is verified.
