import { Injectable } from "@nestjs/common";
import { query } from "../common/db";

@Injectable()
export class UsersService {
  async getMe(userId: string) {
    const result = await query(
      "SELECT id, email, org_id, created_at FROM users WHERE id = $1",
      [userId],
    );
    return result.rows[0] ?? null;
  }
}

