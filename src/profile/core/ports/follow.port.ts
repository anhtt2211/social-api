import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
} from "typeorm";

import { FollowsEntity } from "../entities";

interface FollowPort {
  find(options?: FindManyOptions<FollowsEntity>): Promise<FollowsEntity[]>;
  find(conditions?: FindConditions<FollowsEntity>): Promise<FollowsEntity[]>;

  findOne(
    id?: string | number,
    options?: FindOneOptions<FollowsEntity>
  ): Promise<FollowsEntity | undefined>;
  findOne(
    options?: FindOneOptions<FollowsEntity>
  ): Promise<FollowsEntity | undefined>;
  findOne(
    conditions?: FindConditions<FollowsEntity>,
    options?: FindOneOptions<FollowsEntity>
  ): Promise<FollowsEntity | undefined>;

  save(Follows: DeepPartial<FollowsEntity>): Promise<FollowsEntity>;

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindConditions<FollowsEntity>
  ): Promise<DeleteResult>;
}

export interface FollowReadPort extends FollowPort {}
export interface FollowWritePort extends FollowPort {}
