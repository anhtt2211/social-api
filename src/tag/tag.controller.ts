import { Get, Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { TagService } from "./tag.service";
import { TagRO } from "./tag.interface";

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
