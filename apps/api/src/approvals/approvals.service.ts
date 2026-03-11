import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ApprovalsService {
  constructor(private readonly notificationsService: NotificationsService) {}
  async list(orgId: string, userId: string) {
    const result = await query(
      `SELECT ai.id, ai.status, jp.title, jp.company, jp.location, jp.source_id, jp.id as job_id
       FROM application_intents ai
       JOIN job_postings jp ON jp.id = ai.job_id
       WHERE ai.org_id = $1 AND ai.user_id = $2
       ORDER BY ai.created_at DESC`,
      [orgId, userId],
    );
    return result.rows;
  }

  async create(orgId: string, userId: string, jobId: string) {
    const id = createId();
    await query(
      "INSERT INTO application_intents (id, org_id, user_id, job_id, status, automation_status) VALUES ($1, $2, $3, $4, $5, $6)",
      [id, orgId, userId, jobId, "pending", "pending"],
    );
    await this.notificationsService.create(
      userId,
      "approval_required",
      "A new job is waiting for your approval.",
    );
    return { id, status: "pending" };
  }

  async approve(intentId: string) {
    const intent = await query(
      "SELECT org_id, user_id, job_id FROM application_intents WHERE id = $1",
      [intentId],
    );
    if (intent.rows.length === 0) {
      return { ok: false, error: "not_found" };
    }
    const row = intent.rows[0];

    await query("UPDATE application_intents SET status = $1 WHERE id = $2", [
      "approved",
      intentId,
    ]);

    const job = await query(
      "SELECT source_id FROM job_postings WHERE id = $1",
      [row.job_id],
    );
    const sourceId = job.rows[0]?.source_id ?? "unknown";

    const applicationId = createId();
    await query(
      "INSERT INTO applications (id, org_id, user_id, job_id, source_id, status, automation_status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        applicationId,
        row.org_id,
        row.user_id,
        row.job_id,
        sourceId,
        "queued",
        "queued",
      ],
    );

    await query(
      "UPDATE application_intents SET automation_status = $1 WHERE id = $2",
      ["queued", intentId],
    );

    await this.notificationsService.create(
      row.user_id,
      "application_queued",
      "Your approved application has been queued for automation.",
    );

    const webhook = process.env.N8N_WEBHOOK_URL;
    if (webhook) {
      try {
        const jobDetails = await query(
          "SELECT url FROM job_postings WHERE id = $1",
          [row.job_id],
        );
        const resume = await query(
          "SELECT file_path FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
          [row.user_id],
        );
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            application_id: applicationId,
            user_id: row.user_id,
            job_id: row.job_id,
            job_url: jobDetails.rows[0]?.url ?? null,
            resume_path: resume.rows[0]?.file_path ?? null,
          }),
        });
      } catch {
        // ignore webhook errors
      }
    }

    return { ok: true };
  }

  async reject(intentId: string) {
    await query("UPDATE application_intents SET status = $1 WHERE id = $2", [
      "rejected",
      intentId,
    ]);
    await this.notificationsService.create(
      (await query(
        "SELECT user_id FROM application_intents WHERE id = $1",
        [intentId],
      )).rows[0]?.user_id ?? "",
      "application_skipped",
      "An application was skipped.",
    );
    return { ok: true };
  }
}
