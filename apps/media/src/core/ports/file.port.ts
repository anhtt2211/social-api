import {
  DeepPartial,
  FindConditions,
  FindOneOptions,
  QueryRunner,
  SelectQueryBuilder,
} from "typeorm";

import { FileEntity } from "../entities";

export interface FilePort {
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<FileEntity>;

  findOne(
    id?: string | number,
    options?: FindOneOptions<FileEntity>
  ): Promise<FileEntity | undefined>;
  findOne(
    options?: FindOneOptions<FileEntity>
  ): Promise<FileEntity | undefined>;
  findOne(
    conditions?: FindConditions<FileEntity>,
    options?: FindOneOptions<FileEntity>
  ): Promise<FileEntity | undefined>;

  save(user: DeepPartial<FileEntity>): Promise<FileEntity>;
  save(users: DeepPartial<FileEntity>[]): Promise<FileEntity[]>;
}
