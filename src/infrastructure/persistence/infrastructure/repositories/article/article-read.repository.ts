// src/infrastructure/db/repositories/article.repository.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from "typeorm";

import { READ_CONNECTION } from "@configs";
import { CreateArticleDto } from "@article/core/dto";
import { ArticleEntity } from "@article/core/entities";
import { ArticleReadPort } from "@article/core/ports";

@Injectable()
export class ArticleReadRepository implements ArticleReadPort {
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}

  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner
  ): SelectQueryBuilder<ArticleEntity> {
    return this.articleRepository.createQueryBuilder(alias, queryRunner);
  }

  async save(article: DeepPartial<ArticleEntity>): Promise<ArticleEntity>;
  async save(articles: DeepPartial<ArticleEntity>[]): Promise<ArticleEntity[]>;
  async save(
    articleOrArticles: DeepPartial<ArticleEntity> | DeepPartial<ArticleEntity>[]
  ): Promise<ArticleEntity | ArticleEntity[]> {
    return this.articleRepository.save(articleOrArticles as any);
  }

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
  async findOne(
    ...args:
      | [id?: string | number, options?: FindOneOptions<ArticleEntity>]
      | [options?: FindOneOptions<ArticleEntity>]
      | [
          conditions?: FindConditions<ArticleEntity>,
          options?: FindOneOptions<ArticleEntity>
        ]
  ): Promise<ArticleEntity | undefined> {
    return this.articleRepository.findOne(...(args as any));
  }

  async find(
    options?: FindManyOptions<ArticleEntity>
  ): Promise<ArticleEntity[]>;
  async find(
    conditions?: FindConditions<ArticleEntity>
  ): Promise<ArticleEntity[]>;
  async find(
    optionsOrConditions?:
      | FindManyOptions<ArticleEntity>
      | FindConditions<ArticleEntity>
  ): Promise<ArticleEntity[]> {
    return this.articleRepository.find(optionsOrConditions as any);
  }

  async create(
    article: DeepPartial<ArticleEntity> | CreateArticleDto
  ): Promise<ArticleEntity> {
    return this.articleRepository.create(article);
  }

  async update(
    slug: string,
    article: DeepPartial<ArticleEntity> | CreateArticleDto
  ): Promise<ArticleEntity> {
    return this.articleRepository.save({ slug, ...article });
  }

  async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | FindConditions<ArticleEntity>
  ): Promise<DeleteResult> {
    return this.articleRepository.delete(criteria);
  }
}
