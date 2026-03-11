import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { SkillsService } from "./skills.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("skills")
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return this.skillsService.list();
  }

  @Get("users/me")
  @UseGuards(JwtAuthGuard)
  async getMySkills(@Request() req: any) {
    return this.skillsService.getUserSkills(req.user.userId);
  }

  @Get("users/:id")
  @UseGuards(JwtAuthGuard)
  async getUserSkills(@Request() req: any) {
    return this.skillsService.getUserSkills(req.user.userId);
  }

  @Post("users/me")
  @UseGuards(JwtAuthGuard)
  async setMySkills(@Body() body: { skills: string[] }, @Request() req: any) {
    return this.skillsService.setUserSkills({
      orgId: req.user.orgId,
      userId: req.user.userId,
      skills: body.skills ?? [],
    });
  }

  @Post("users/:id")
  @UseGuards(JwtAuthGuard)
  async setUserSkills(@Body() body: { skills: string[] }, @Request() req: any) {
    return this.skillsService.setUserSkills({
      orgId: req.user.orgId,
      userId: req.user.userId,
      skills: body.skills ?? [],
    });
  }
}
