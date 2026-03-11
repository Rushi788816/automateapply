import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";

@Injectable()
export class NotificationsService {
  async create(userId: string, type: string, message: string) {
    await query(
      "INSERT INTO notifications (id, user_id, type, message) VALUES ($1, $2, $3, $4)",
      [createId(), userId, type, message],
    );
  }

  async list(userId: string) {
    const result = await query(
      "SELECT id, type, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    return result.rows;
  }

  async markRead(userId: string, id: string) {
    await query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND id = $2",
      [userId, id],
    );
    return { ok: true };
  }
}

