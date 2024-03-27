import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

import { ArticleBlockOutboxEntity } from "@article/core/entities";
import { ArticleBlockOutboxPort } from "@article/core/ports";

@Injectable()
export class ArticleBlockOutboxRepository implements ArticleBlockOutboxPort {
  constructor(
    @InjectRepository(ArticleBlockOutboxEntity)
    private readonly articleRepository: Repository<ArticleBlockOutboxEntity>
  ) {}

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<ArticleBlockOutboxEntity> {
    return this.articleRepository.createQueryBuilder(alias, queryRunner);
  }

  async save(
    article: DeepPartial<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity>;
  async save(
    articles: DeepPartial<ArticleBlockOutboxEntity>[]
  ): Promise<ArticleBlockOutboxEntity[]>;
  async save(
    articleOrArticles:
      | DeepPartial<ArticleBlockOutboxEntity>
      | DeepPartial<ArticleBlockOutboxEntity>[]
  ): Promise<ArticleBlockOutboxEntity | ArticleBlockOutboxEntity[]> {
    return this.articleRepository.save(articleOrArticles as any);
  }

  async find(
    options?: FindManyOptions<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity[]>;
  async find(
    conditions?: FindConditions<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity[]>;
  async find(
    optionsOrConditions?:
      | FindManyOptions<ArticleBlockOutboxEntity>
      | FindConditions<ArticleBlockOutboxEntity>
  ): Promise<ArticleBlockOutboxEntity[]> {
    return this.articleRepository.find(optionsOrConditions as any);
  }
}
