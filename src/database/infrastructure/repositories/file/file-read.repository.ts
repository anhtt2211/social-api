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

import { READ_CONNECTION } from "../../../../configs";
import { FileEntity, FileReadPort } from "../../../../media/core";

@Injectable()
export class FileReadRepository implements FileReadPort {
  constructor(
    @InjectRepository(FileEntity, READ_CONNECTION)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<FileEntity> {
    return this.fileRepository.createQueryBuilder(alias, queryRunner);
  }

  async save(File: DeepPartial<FileEntity>): Promise<FileEntity>;
  async save(Files: DeepPartial<FileEntity>[]): Promise<FileEntity[]>;
  async save(
    entityOrEntities: DeepPartial<FileEntity> | DeepPartial<FileEntity>[]
  ): Promise<FileEntity | FileEntity[]> {
    return this.fileRepository.save(entityOrEntities as any);
  }

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
  async findOne(
    ...args:
      | [id?: string | number, options?: FindOneOptions<FileEntity>]
      | [options?: FindOneOptions<FileEntity>]
      | [
          conditions?: FindConditions<FileEntity>,
          options?: FindOneOptions<FileEntity>
        ]
  ): Promise<FileEntity | undefined> {
    return this.fileRepository.findOne(...(args as any));
  }
}
