# n8n Workflows (Draft)

## Approval Gate
1. Trigger on `approval_approved` event
2. Fetch job + user + resume + connector config
3. Validate compliance policy
4. Launch connector workflow
5. Emit `application_event`

## Connector Workflow (Per Source)
1. Authenticate (if required)
2. Navigate to job posting
3. Fill forms + upload resume
4. Submit
5. Capture result + screenshot (optional)
6. Emit `application_success` or `application_failed`

