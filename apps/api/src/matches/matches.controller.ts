import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MatchesService } from "./matches.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("matches")
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.matchesService.list(req.user.orgId, req.user.userId);
  }

  @Post("recompute")
  @UseGuards(JwtAuthGuard)
  async recompute(@Body() _body: { orgId?: string; userId?: string }, @Request() req: any) {
    return this.matchesService.recompute(req.user.orgId, req.user.userId);
  }
}
