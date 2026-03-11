import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";
import { ResumeParserService } from "./resume-parser.service";
import { SkillsModule } from "../skills/skills.module";

@Module({
  imports: [MulterModule.register({ dest: "uploads" }), SkillsModule],
  controllers: [ResumesController],
  providers: [ResumesService, ResumeParserService],
})
export class ResumesModule {}
