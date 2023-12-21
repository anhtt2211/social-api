import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, FindManyOptions, Repository } from "typeorm";

import { TagEntity, TagPort } from "@tag/core";

@Injectable()
export class TagRepository implements TagPort {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async find(options?: FindManyOptions<TagEntity>): Promise<TagEntity[]>;
  async find(conditions?: FindConditions<TagEntity>): Promise<TagEntity[]>;
  async find(
    optionsOrConditions?: FindManyOptions<TagEntity> | FindConditions<TagEntity>
  ): Promise<TagEntity[]> {
    return this.tagRepository.find(optionsOrConditions as any);
  }
}
