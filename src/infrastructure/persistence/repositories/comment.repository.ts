import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeleteResult,
  FindConditions,
  FindOneOptions,
  Repository,
} from "typeorm";

import { CommentEntity, CommentPort } from "@article/core";

@Injectable()
export class CommentRepository implements CommentPort {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

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
  async findOne(
    ...args:
      | [id?: string | number, options?: FindOneOptions<CommentEntity>]
      | [options?: FindOneOptions<CommentEntity>]
      | [
          conditions?: FindConditions<CommentEntity>,
          options?: FindOneOptions<CommentEntity>
        ]
  ): Promise<CommentEntity | undefined> {
    return this.commentRepository.findOne(...(args as any));
  }

  async save(comment: CommentEntity): Promise<CommentEntity> {
    return this.commentRepository.save(comment);
  }

  async delete(
    criteria:
      | string
      | number
      | string[]
      | number[]
      | FindConditions<CommentEntity>
  ): Promise<DeleteResult> {
    return this.commentRepository.delete(criteria);
  }
}
