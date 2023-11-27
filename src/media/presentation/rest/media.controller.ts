import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { User } from "../../../shared/middleware";
import { S3Service } from "../../application/services";
import { MediaOutput } from "../../core/interfaces";

@ApiBearerAuth()
@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({ summary: "Upload image to S3" })
  @ApiResponse({
    status: 201,
    description: "The image has been successfully uploaded.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseInterceptors(FileInterceptor("file"))
  @Post("/img/upload")
  async uploadS3(
    @User("id") userId: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<MediaOutput> {
    const uploadData = await this.s3Service.uploadFile(userId, file);

    return {
      media: {
        url: uploadData.Location,
      },
    };
  }
}
