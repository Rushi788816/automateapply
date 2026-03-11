import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";

@Injectable()
export class MatchesService {
  async recompute(orgId: string, userId: string) {
    const skillsResult = await query(
      `SELECT s.name
       FROM user_skills us
       JOIN skills s ON s.id = us.skill_id
       WHERE us.user_id = $1`,
      [userId],
    );
    const skills = skillsResult.rows.map((row) => row.name.toLowerCase());

    const profile = await query(
      "SELECT location FROM user_profiles WHERE user_id = $1",
      [userId],
    );
    const userLocation = (profile.rows[0]?.location ?? "").toLowerCase();

    const jobs = await query(
      "SELECT id, title, description, company, location, source_id FROM job_postings WHERE org_id = $1",
      [orgId],
    );

    await query("DELETE FROM job_matches WHERE org_id = $1 AND user_id = $2", [
      orgId,
      userId,
    ]);

    for (const job of jobs.rows) {
      const hay = `${job.title} ${job.description ?? ""}`.toLowerCase();
      const matched = skills.filter((skill) => hay.includes(skill));
      const skillMatch = skills.length === 0 ? 0 : matched.length / skills.length;
      const keywords = job.title
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      const keywordHits = keywords.filter((k) => hay.includes(k));
      const keywordMatch =
        keywords.length === 0 ? 0 : keywordHits.length / keywords.length;
      const locationMatch =
        userLocation && job.location
          ? job.location.toLowerCase().includes(userLocation)
            ? 1
            : 0
          : 0;
      const score =
        skillMatch * 0.6 + keywordMatch * 0.2 + locationMatch * 0.2;

      await query(
        "INSERT INTO job_matches (id, org_id, user_id, job_id, score, reasons) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          createId(),
          orgId,
          userId,
          job.id,
          Math.round(score * 100),
          JSON.stringify({
            matched_skills: matched,
            keyword_hits: keywordHits,
            location_match: locationMatch,
          }),
        ],
      );
    }

    return { ok: true, total: jobs.rows.length };
  }

  async list(orgId: string, userId: string) {
    const result = await query(
      `SELECT jm.id, jm.score, jm.reasons, jp.title, jp.company, jp.location, jp.source_id, jp.url, jp.description, jp.id as job_id
       FROM job_matches jm
       JOIN job_postings jp ON jp.id = jm.job_id
       WHERE jm.org_id = $1 AND jm.user_id = $2
       ORDER BY jm.score DESC`,
      [orgId, userId],
    );
    return result.rows;
  }
}
