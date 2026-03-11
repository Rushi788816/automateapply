import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.jobsService.list(req.user.orgId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async get(@Param("id") id: string, @Request() req: any) {
    return this.jobsService.getById(req.user.orgId, id);
  }

  @Post("seed")
  @UseGuards(JwtAuthGuard)
  async seed(@Request() req: any) {
    return this.jobsService.seedDemo(req.user.orgId);
  }

  @Post("ingest")
  @UseGuards(JwtAuthGuard)
  async ingest(@Request() req: any, @Body() body: { jobs: any[] }) {
    return this.jobsService.ingest(req.user.orgId, body.jobs ?? []);
  }
}
