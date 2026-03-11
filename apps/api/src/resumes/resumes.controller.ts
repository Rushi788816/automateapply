import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResumesService } from "./resumes.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { orgId?: string; userId?: string },
    @Request() req: any,
  ) {
    if (!file) {
      return { error: "file_required" };
    }

    return await this.resumesService.create({
      orgId: req.user.orgId,
      userId: req.user.userId,
      fileName: file.originalname,
      filePath: file.path,
    });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async get(@Param("id") id: string) {
    return this.resumesService.get(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(@Request() req: any) {
    return this.resumesService.listByUser(req.user.orgId, req.user.userId);
  }
}
