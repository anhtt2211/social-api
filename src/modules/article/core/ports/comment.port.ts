import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindOneOptions,
} from "typeorm";

import { CommentEntity } from "../entities";

interface CommentPort {
  findOne(
    id?: string | number,
    options?: FindOneOptions<CommentEntity>
  ): Promise<CommentEntity | undefined>;
  findOne(
    options?: FindOneOptions<CommentEntity>
  ): Promise<CommentEntity | undefined>;
  findOne(
    conditions?: FindConditions<CommentEntity>,
    options?: FindOneOptions<CommentEntity>
  ): Promise<CommentEntity | undefined>;

  save(comment: DeepPartial<CommentEntity>): Promise<CommentEntity>;

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindConditions<CommentEntity>
  ): Promise<DeleteResult>;
}

export interface CommentReadPort extends CommentPort {}
export interface CommentWritePort extends CommentPort {}
