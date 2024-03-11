import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MoreThanOrEqual } from "typeorm";

import {
  ARTICLE_REPOSITORY,
  ArticlePort,
  DEFAULT_HOT_ARTICLE,
  HOT_ARTICLES_KEY,
} from "@article/core";
import { RedisService } from "@redis/redis.service";

@Injectable()
export class ArticleJobsService {
  private readonly logger = new Logger(ArticleJobsService.name);

  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly redisCacheService: RedisService
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async indexingHotArticle() {
    const queryBuilder = this.articleRepository.createQueryBuilder("article");
    queryBuilder.where("article.favoriteCount >= :count", {
      count: DEFAULT_HOT_ARTICLE,
    });
    queryBuilder.orderBy("article.favoriteCount", "DESC");

    const hotArticles = await queryBuilder.getMany();

    this.redisCacheService.set(HOT_ARTICLES_KEY, JSON.stringify(hotArticles));
  }
}
