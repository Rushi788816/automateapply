import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";

type Skill = {
  id: string;
  name: string;
};

@Injectable()
export class SkillsService {
  async list(): Promise<Skill[]> {
    const result = await query("SELECT id, name FROM skills ORDER BY name");
    return result.rows.map((row) => ({ id: row.id, name: row.name }));
  }

  async setUserSkills(input: {
    orgId: string;
    userId: string;
    skills: string[];
  }) {
    const unique = [...new Set(input.skills.map((s) => s.trim()))].filter(
      (s) => s.length > 0,
    );

    for (const name of unique) {
      let skillId: string;
      const existing = await query("SELECT id FROM skills WHERE name = $1", [
        name,
      ]);
      if (existing.rows.length === 0) {
        skillId = createId();
        await query("INSERT INTO skills (id, name) VALUES ($1, $2)", [
          skillId,
          name,
        ]);
      } else {
        skillId = existing.rows[0].id;
      }

      await query(
        "INSERT INTO user_skills (id, org_id, user_id, skill_id, confidence) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (org_id, user_id, skill_id) DO UPDATE SET confidence = EXCLUDED.confidence",
        [createId(), input.orgId, input.userId, skillId, 0.8],
      );
    }

    return { ok: true, count: unique.length };
  }

  async getUserSkills(userId: string) {
    const result = await query(
      `SELECT s.name
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = $1
       ORDER BY s.name`,
      [userId],
    );
    return result.rows.map((row) => row.name);
  }
}

