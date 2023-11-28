import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, Repository } from "typeorm";

import { READ_CONNECTION } from "@configs";
import { BlockEntity } from "@article/core/entities";
import { BlockReadPort } from "@article/core/ports";

@Injectable()
export class BlockReadRepository implements BlockReadPort {
  constructor(
    @InjectRepository(BlockEntity, READ_CONNECTION)
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
