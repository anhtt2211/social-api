import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, Repository } from "typeorm";

import { BlockEntity, BlockPort } from "@article/core";

@Injectable()
export class BlockRepository implements BlockPort {
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>
  ) {}

  async delete(
    criteria:
      | string
      | number
      | string[]
      | number[]
      | FindConditions<BlockEntity>
  ): Promise<DeleteResult> {
    return this.blockRepository.delete(criteria);
  }
}
