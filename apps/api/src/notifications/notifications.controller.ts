import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.notificationsService.list(req.user.userId);
  }

  @Post(":id/read")
  @UseGuards(JwtAuthGuard)
  async read(@Param("id") id: string, @Request() req: any) {
    return this.notificationsService.markRead(req.user.userId, id);
  }
}

