import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagEntity } from "./tag.entity";
import { TagRO } from "./tag.interface";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async findAll(): Promise<TagRO> {
    const tagsEntity = await this.tagRepository.find({ select: ["tag"] });
    const tags = tagsEntity.map((item) => item.tag);

    return { tags };
  }
}
