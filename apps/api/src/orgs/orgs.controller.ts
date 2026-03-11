import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { OrgsService } from "./orgs.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("orgs")
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.orgsService.list(req.user.orgId);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async get(@Param("id") id: string, @Request() req: any) {
    if (id !== req.user.orgId) {
      return null;
    }
    return this.orgsService.get(req.user.orgId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: { name: string }) {
    return this.orgsService.create(body.name);
  }
}
