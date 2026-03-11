import { Injectable } from "@nestjs/common";
import { createId } from "../common/memory";
import { query } from "../common/db";
import { ResumeParserService } from "./resume-parser.service";
import { SkillsService } from "../skills/skills.service";

type Resume = {
  id: string;
  orgId: string;
  userId: string;
  fileName: string;
  filePath: string;
  createdAt: string;
};

@Injectable()
export class ResumesService {
  constructor(
    private readonly resumeParser: ResumeParserService,
    private readonly skillsService: SkillsService,
  ) {}

  create(input: {
    orgId: string;
    userId: string;
    fileName: string;
    filePath: string;
  }): Promise<Resume> {
    const resume: Resume = {
      id: createId(),
      orgId: input.orgId,
      userId: input.userId,
      fileName: input.fileName,
      filePath: input.filePath,
      createdAt: new Date().toISOString(),
    };
    return query(
      "INSERT INTO resumes (id, org_id, user_id, file_name, file_path, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        resume.id,
        resume.orgId,
        resume.userId,
        resume.fileName,
        resume.filePath,
        resume.createdAt,
      ],
    ).then(async () => {
      try {
        const parsed = await this.resumeParser.parse(resume.filePath);
        await query(
          "UPDATE resumes SET parsed_text = $1, skills_extracted = $2 WHERE id = $3",
          [parsed.text, JSON.stringify(parsed.skills), resume.id],
        );
        if (parsed.skills.length > 0) {
          await this.skillsService.setUserSkills({
            orgId: resume.orgId,
            userId: resume.userId,
            skills: parsed.skills,
          });
        }
      } catch {
        // ignore parsing failures
      }
      return resume;
    });
  }

  async get(id: string): Promise<Resume | null> {
    const result = await query(
      "SELECT id, org_id, user_id, file_name, file_path, created_at FROM resumes WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      orgId: row.org_id,
      userId: row.user_id,
      fileName: row.file_name,
      filePath: row.file_path,
      createdAt: row.created_at,
    };
  }

  async listByUser(orgId: string, userId: string) {
    const result = await query(
      "SELECT id, file_name, file_path, created_at, skills_extracted FROM resumes WHERE org_id = $1 AND user_id = $2 ORDER BY created_at DESC",
      [orgId, userId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      fileName: row.file_name,
      filePath: row.file_path,
      createdAt: row.created_at,
      skillsExtracted: row.skills_extracted ?? [],
    }));
  }
}
