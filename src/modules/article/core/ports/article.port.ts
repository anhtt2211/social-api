// src/application/port/article.port.ts
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  SelectQueryBuilder,
} from "typeorm";

import { CreateArticleDto } from "../dto";
import { ArticleEntity } from "../entities";

interface ArticlePort {
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<ArticleEntity>;

  find(options?: FindManyOptions<ArticleEntity>): Promise<ArticleEntity[]>;
  find(conditions?: FindConditions<ArticleEntity>): Promise<ArticleEntity[]>;

  findOne(
    id?: string | number,
    options?: FindOneOptions<ArticleEntity>
  ): Promise<ArticleEntity | undefined>;
  findOne(
    options?: FindOneOptions<ArticleEntity>
  ): Promise<ArticleEntity | undefined>;
  findOne(
    conditions?: FindConditions<ArticleEntity>,
    options?: FindOneOptions<ArticleEntity>
  ): Promise<ArticleEntity | undefined>;

  save(article: DeepPartial<ArticleEntity>): Promise<ArticleEntity>;
  save(articles: DeepPartial<ArticleEntity>[]): Promise<ArticleEntity[]>;

  create(
    article: DeepPartial<ArticleEntity> | CreateArticleDto
  ): Promise<ArticleEntity>;
  update(
    slug: string,
    article: DeepPartial<ArticleEntity> | CreateArticleDto
  ): Promise<ArticleEntity>;
  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindConditions<ArticleEntity>
  ): Promise<DeleteResult>;
}

export interface ArticleReadPort extends ArticlePort {}
export interface ArticleWritePort extends ArticlePort {}
