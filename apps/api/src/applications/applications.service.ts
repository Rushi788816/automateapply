import { Injectable } from "@nestjs/common";
import { query } from "../common/db";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ApplicationsService {
  constructor(private readonly notificationsService: NotificationsService) {}
  async list(orgId: string, userId: string) {
    const result = await query(
      `SELECT a.id, a.status, a.automation_status, a.source_id, a.screenshot_url, a.logs, jp.title, jp.company, jp.location
       FROM applications a
       JOIN job_postings jp ON jp.id = a.job_id
       WHERE a.org_id = $1 AND a.user_id = $2
       ORDER BY a.created_at DESC`,
      [orgId, userId],
    );
    return result.rows;
  }

  async updateStatus(id: string, input: any) {
    await query(
      "UPDATE applications SET status = $1, automation_status = $2, screenshot_url = $3, logs = $4 WHERE id = $5",
      [
        input.status ?? "queued",
        input.automation_status ?? input.status ?? "queued",
        input.screenshot_url ?? null,
        input.logs ? JSON.stringify(input.logs) : null,
        id,
      ],
    );
    const result = await query(
      "SELECT user_id FROM applications WHERE id = $1",
      [id],
    );
    const userId = result.rows[0]?.user_id;
    if (userId) {
      await this.notificationsService.create(
        userId,
        "application_status",
        `Application status updated: ${input.status ?? "queued"}`,
      );
    }
    return { ok: true };
  }
}
