import { DeleteResult, FindConditions } from "typeorm";

import { BlockEntity } from "../entities";

interface BlockPort {
  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindConditions<BlockEntity>
  ): Promise<DeleteResult>;
}

export interface BlockReadPort extends BlockPort {}
export interface BlockWritePort extends BlockPort {}
