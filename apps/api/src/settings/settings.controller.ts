import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Request() req: any) {
    return this.settingsService.get(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async update(@Body() body: any, @Request() req: any) {
    return this.settingsService.update(req.user.userId, body);
  }
}

