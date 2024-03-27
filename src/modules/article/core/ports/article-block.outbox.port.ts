import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  QueryRunner,
  SelectQueryBuilder,
} from "typeorm";

import { ArticleBlockOutboxEntity } from "../entities";

export interface ArticleBlockOutboxPort {
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<ArticleBlockOutboxEntity>;

  find(
    options?: FindManyOptions<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity[]>;
  find(
    conditions?: FindConditions<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity[]>;

  save(
    article: DeepPartial<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity>;
  save(
    articles: DeepPartial<ArticleBlockOutboxEntity>[]
  ): Promise<ArticleBlockOutboxEntity[]>;
}
