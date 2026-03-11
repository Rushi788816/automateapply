import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";

@Injectable()
export class JobsService {
  async list(orgId: string) {
    const result = await query(
      "SELECT id, title, company, location, description, url, source_id FROM job_postings WHERE org_id = $1 ORDER BY created_at DESC",
      [orgId],
    );
    return result.rows;
  }

  async getById(orgId: string, id: string) {
    const result = await query(
      "SELECT id, title, company, location, description, url, source_id FROM job_postings WHERE id = $1 AND org_id = $2",
      [id, orgId],
    );
    return result.rows[0] ?? null;
  }

  async seedDemo(orgId: string) {
    const existing = await query(
      "SELECT id FROM job_postings WHERE org_id = $1 LIMIT 1",
      [orgId],
    );
    if (existing.rows.length > 0) {
      return { ok: true, skipped: true };
    }

    const demo = [
      {
        title: "Senior Frontend Engineer",
        company: "Argo Labs",
        location: "Remote - India",
        description: "React, Next.js, TypeScript, design systems, testing.",
        sourceId: "naukri",
      },
      {
        title: "Automation Platform Lead",
        company: "Orbit Automation",
        location: "Hybrid - Bengaluru",
        description: "Node.js, n8n, Playwright, AWS, Postgres.",
        sourceId: "linkedin",
      },
      {
        title: "Full Stack Engineer",
        company: "StackFlow",
        location: "Remote - India",
        description: "Node.js, React, PostgreSQL, AWS, APIs.",
        sourceId: "indeed",
      },
    ];

    for (const job of demo) {
      await query(
        "INSERT INTO job_postings (id, org_id, source_id, title, company, location, description, url, skills) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          createId(),
          orgId,
          job.sourceId,
          job.title,
          job.company,
          job.location,
          job.description,
          `https://example.com/jobs/${Math.random().toString(36).slice(2)}`,
          JSON.stringify(["react", "node.js", "aws"]),
        ],
      );
    }

    return { ok: true, seeded: demo.length };
  }

  async ingest(orgId: string, jobs: Array<any>) {
    for (const job of jobs) {
      await query(
        `INSERT INTO job_postings
          (id, org_id, source_id, external_id, title, company, location, description, url, skills)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          createId(),
          orgId,
          job.source ?? "unknown",
          job.external_id ?? null,
          job.title,
          job.company ?? null,
          job.location ?? null,
          job.description ?? null,
          job.job_url ?? job.url ?? null,
          JSON.stringify(job.skills ?? []),
        ],
      );
    }
    return { ok: true, count: jobs.length };
  }
}
