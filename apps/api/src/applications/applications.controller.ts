import { Body, Controller, Get, Param, Patch, Request, UseGuards, Headers } from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.applicationsService.list(req.user.orgId, req.user.userId);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() body: any,
    @Headers("x-automation-key") key?: string,
  ) {
    const expected = process.env.AUTOMATION_API_KEY ?? "dev_key";
    if (key !== expected) {
      return { ok: false, error: "unauthorized" };
    }
    return this.applicationsService.updateStatus(id, body);
  }
}
