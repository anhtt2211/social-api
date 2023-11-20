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
import { DropboxService } from "../services/dropbox.service";
import { MediaOutput } from "../core/media.interface";

@ApiBearerAuth()
@ApiTags("media")
@Controller("media")
export class MediaController {
  constructor(private readonly dropboxService: DropboxService) {}

  @ApiOperation({ summary: "Upload image" })
  @ApiResponse({
    status: 201,
    description: "The image has been successfully uploaded.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @UseInterceptors(FileInterceptor("file"))
  @Post("/img/upload")
  async create(
    @UploadedFile() file: Express.Multer.File
  ): Promise<MediaOutput> {
    return await this.dropboxService.uploadFile(file);
  }
}
