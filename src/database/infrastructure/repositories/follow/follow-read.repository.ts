import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from "typeorm";

import { READ_CONNECTION } from "../../../../configs";
import { FollowReadPort, FollowsEntity } from "../../../../profile/core";

@Injectable()
export class FollowReadRepository implements FollowReadPort {
  constructor(
    @InjectRepository(FollowsEntity, READ_CONNECTION)
    private readonly followRepository: Repository<FollowsEntity>
  ) {}
  async find(
    options?: FindManyOptions<FollowsEntity>
  ): Promise<FollowsEntity[]>;
  async find(
    conditions?: FindConditions<FollowsEntity>
  ): Promise<FollowsEntity[]>;
  async find(
    optionsOrConditions?:
      | FindManyOptions<FollowsEntity>
      | FindConditions<FollowsEntity>
  ): Promise<FollowsEntity[]> {
    return this.followRepository.find(optionsOrConditions as any);
  }

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
  async findOne(
    ...args:
      | [id?: string | number, options?: FindOneOptions<FollowsEntity>]
      | [options?: FindOneOptions<FollowsEntity>]
      | [
          conditions?: FindConditions<FollowsEntity>,
          options?: FindOneOptions<FollowsEntity>
        ]
  ): Promise<FollowsEntity | undefined> {
    return this.followRepository.findOne(...(args as any));
  }

  async save(Follow: FollowsEntity): Promise<FollowsEntity> {
    return this.followRepository.save(Follow);
  }

  async delete(
    criteria:
      | string
      | number
      | string[]
      | number[]
      | FindConditions<FollowsEntity>
  ): Promise<DeleteResult> {
    return this.followRepository.delete(criteria);
  }
}
