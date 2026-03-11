import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";

@Injectable()
export class SettingsService {
  async get(userId: string) {
    const result = await query(
      "SELECT id, auto_apply_enabled, daily_limit, preferred_platforms FROM user_settings WHERE user_id = $1",
      [userId],
    );
    if (result.rows.length === 0) {
      const id = createId();
      await query(
        "INSERT INTO user_settings (id, user_id, auto_apply_enabled, daily_limit, preferred_platforms) VALUES ($1, $2, $3, $4, $5)",
        [id, userId, false, 10, JSON.stringify([])],
      );
      return {
        id,
        auto_apply_enabled: false,
        daily_limit: 10,
        preferred_platforms: [],
      };
    }
    return result.rows[0];
  }

  async update(
    userId: string,
    input: {
      auto_apply_enabled?: boolean;
      daily_limit?: number;
      preferred_platforms?: string[];
    },
  ) {
    const existing = await this.get(userId);
    const next = {
      auto_apply_enabled:
        input.auto_apply_enabled ?? existing.auto_apply_enabled,
      daily_limit: input.daily_limit ?? existing.daily_limit,
      preferred_platforms: input.preferred_platforms ?? existing.preferred_platforms,
    };
    await query(
      "UPDATE user_settings SET auto_apply_enabled = $1, daily_limit = $2, preferred_platforms = $3 WHERE user_id = $4",
      [
        next.auto_apply_enabled,
        next.daily_limit,
        JSON.stringify(next.preferred_platforms ?? []),
        userId,
      ],
    );
    return next;
  }
}

