import { Get, Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { TagService } from "./tag.service";
import { TagRO } from "./tag.interface";

@ApiBearerAuth()
@ApiTags("tags")
@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<TagRO> {
    return await this.tagService.findAll();
  }
}
