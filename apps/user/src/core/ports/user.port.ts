import {
    DeepPartial,
  FindConditions,
  FindOneOptions,
  QueryRunner,
  SelectQueryBuilder,
} from "typeorm";

import { UserEntity } from "../entities";

export interface UserPort {
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<UserEntity>;

  findOne(
    id?: string | number,
    options?: FindOneOptions<UserEntity>
  ): Promise<UserEntity | undefined>;
  findOne(
    options?: FindOneOptions<UserEntity>
  ): Promise<UserEntity | undefined>;
  findOne(
    conditions?: FindConditions<UserEntity>,
    options?: FindOneOptions<UserEntity>
  ): Promise<UserEntity | undefined>;

  save(user: DeepPartial<UserEntity>): Promise<UserEntity>;
  save(users: DeepPartial<UserEntity>[]): Promise<UserEntity[]>;
}

