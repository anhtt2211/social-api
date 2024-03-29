import { Get, Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { TagService } from "../application/tag.service";
import { TagRO } from "../core/interfaces/tag.interface";

@ApiBearerAuth()
@ApiTags("tags")
@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: "get all tag" })
  @Get()
  async findAll(): Promise<TagRO> {
    return await this.tagService.findAll();
  }
}
