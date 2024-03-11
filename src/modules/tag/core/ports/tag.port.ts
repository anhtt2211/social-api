import { FindConditions, FindManyOptions } from "typeorm";

import { TagEntity } from "../entities";

export interface TagPort {
  find(options?: FindManyOptions<TagEntity>): Promise<TagEntity[]>;
  find(conditions?: FindConditions<TagEntity>): Promise<TagEntity[]>;
}
