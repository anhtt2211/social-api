import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindOneOptions,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

import { READ_CONNECTION } from "@configs";
import { UserEntity, UserReadPort } from "@user/core";

@Injectable()
export class UserReadRepository implements UserReadPort {
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<UserEntity> {
    return this.userRepository.createQueryBuilder(alias, queryRunner);
  }

  async save(user: DeepPartial<UserEntity>): Promise<UserEntity>;
  async save(users: DeepPartial<UserEntity>[]): Promise<UserEntity[]>;
  async save(
    entityOrEntities: DeepPartial<UserEntity> | DeepPartial<UserEntity>[]
  ): Promise<UserEntity | UserEntity[]> {
    return this.userRepository.save(entityOrEntities as any);
  }

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
  async findOne(
    ...args:
      | [id?: string | number, options?: FindOneOptions<UserEntity>]
      | [options?: FindOneOptions<UserEntity>]
      | [
          conditions?: FindConditions<UserEntity>,
          options?: FindOneOptions<UserEntity>
        ]
  ): Promise<UserEntity | undefined> {
    return this.userRepository.findOne(...(args as any));
  }
}
