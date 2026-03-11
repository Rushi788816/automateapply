import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";
import { encrypt } from "../common/crypto";

@Injectable()
export class ConnectorsService {
  async list(userId: string) {
    const result = await query(
      "SELECT id, platform, username, created_at FROM connectors WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );
    return result.rows;
  }

  async upsert(userId: string, input: { platform: string; username?: string; password?: string }) {
    const encrypted = input.password ? encrypt(input.password) : null;
    const existing = await query(
      "SELECT id FROM connectors WHERE user_id = $1 AND platform = $2",
      [userId, input.platform],
    );
    if (existing.rows.length === 0) {
      const id = createId();
      await query(
        "INSERT INTO connectors (id, user_id, platform, username, password_encrypted) VALUES ($1, $2, $3, $4, $5)",
        [id, userId, input.platform, input.username ?? null, encrypted],
      );
      return { id, platform: input.platform, username: input.username ?? null };
    }
    await query(
      "UPDATE connectors SET username = $1, password_encrypted = $2 WHERE user_id = $3 AND platform = $4",
      [input.username ?? null, encrypted, userId, input.platform],
    );
    return { id: existing.rows[0].id, platform: input.platform, username: input.username ?? null };
  }
}

