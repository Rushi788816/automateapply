import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ConnectorsService } from "./connectors.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("connectors")
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.connectorsService.list(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async upsert(@Request() req: any, @Body() body: any) {
    return this.connectorsService.upsert(req.user.userId, body);
  }
}

