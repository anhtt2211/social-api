import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { User } from "@shared/middleware";
import { S3Service } from "../../application/services";

@ApiBearerAuth()
@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({ summary: "Generate presigned Url" })
  @ApiResponse({
    status: 201,
    description: "",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseInterceptors(FileInterceptor("file"))
  @Get("/img/presigned-url")
  async presignedUrl(@User("id") userId: number): Promise<any> {
    const uploadData = await this.s3Service.generatePresignedUrl(userId);

    return {
      data: uploadData,
    };
  }
}
