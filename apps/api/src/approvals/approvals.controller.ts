import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApprovalsService } from "./approvals.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("approvals")
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.approvalsService.list(req.user.orgId, req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { jobId: string }, @Request() req: any) {
    return this.approvalsService.create(
      req.user.orgId,
      req.user.userId,
      body.jobId,
    );
  }

  @Post(":id/approve")
  async approve(@Param("id") id: string) {
    return this.approvalsService.approve(id);
  }

  @Post(":id/reject")
  async reject(@Param("id") id: string) {
    return this.approvalsService.reject(id);
  }
}
