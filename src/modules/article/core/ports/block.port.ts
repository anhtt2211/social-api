import { DeleteResult, FindConditions } from "typeorm";

import { BlockEntity } from "../entities";

export interface BlockPort {
  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindConditions<BlockEntity>
  ): Promise<DeleteResult>;
}
