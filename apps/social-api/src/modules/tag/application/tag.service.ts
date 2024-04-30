import { Inject, Injectable } from "@nestjs/common";
import { TAG_REPOSITORY } from "@tag/core";
import { Repository } from "typeorm";

import { TagEntity } from "../core/entities/tag.entity";
import { TagRO } from "../core/interfaces/tag.interface";

@Injectable()
export class TagService {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async findAll(): Promise<TagRO> {
    const tagsEntity = await this.tagRepository.find({ select: ["tag"] });
    const tags = tagsEntity.map((item) => item.tag);

    return { tags };
  }
}
