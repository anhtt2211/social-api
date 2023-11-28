import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "@configs";
import { TagEntity } from "../core/entities/tag.entity";
import { TagRO } from "../core/interfaces/tag.interface";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity, READ_CONNECTION)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async findAll(): Promise<TagRO> {
    const tagsEntity = await this.tagRepository.find({ select: ["tag"] });
    const tags = tagsEntity.map((item) => item.tag);

    return { tags };
  }
}
