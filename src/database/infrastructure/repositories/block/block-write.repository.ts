import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindConditions, Repository } from "typeorm";

import { WRITE_CONNECTION } from "../../../../configs";
import { BlockEntity } from "../../../../article/core/entities";
import { BlockWritePort } from "../../../../article/core/ports";

@Injectable()
export class BlockWriteRepository implements BlockWritePort {
  constructor(
    @InjectRepository(BlockEntity, WRITE_CONNECTION)
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
