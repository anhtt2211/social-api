import { Get, Controller } from "@nestjs/common";

import { TagEntity } from "./tag.entity";
import { TagService } from "./tag.service";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
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
