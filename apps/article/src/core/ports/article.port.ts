import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  SelectQueryBuilder,
} from "typeorm";

import { CreateArticleDto } from "../dto";
import { ArticleEntity } from "../entities";

export interface ArticlePort {
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<ArticleEntity>;

  find(options?: FindManyOptions<ArticleEntity>): Promise<ArticleEntity[]>;

  findOne(
    id?: string | number,
    options?: FindOneOptions<ArticleEntity>
  ): Promise<ArticleEntity | undefined>;
  findOne(
    options?: FindOneOptions<ArticleEntity>
  ): Promise<ArticleEntity | undefined>;
  findOne(
    conditions?: FindOneOptions<ArticleEntity>,
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
      | FindOneOptions<ArticleEntity>
  ): Promise<DeleteResult>;
}
