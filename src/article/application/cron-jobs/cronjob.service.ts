import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";

import { READ_CONNECTION } from "../../../configs";
import { ArticleEntity, MIN_FAVORITE_TREDNING_ARTICLE } from "../../core";
import { ArticleService } from "../services/article.service";
import { RedisService } from "../../../redis/redis.service";
import { ARTICLE_TREDNING_TTL } from "../../../redis/redis.constant";

@Injectable()
export class CronjobService {
  private readonly logger = new Logger(CronjobService.name);
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly articleService: ArticleService
  ) // private readonly redisCacheService: RedisService
  {}

  // Midnight every 14 days on a Sunday
  //   @Cron("0 0 0 */14 * 0")
  @Cron(CronExpression.EVERY_SECOND)
  async indexingArticleTrendingOfQuarter() {
    this.logger.verbose("Indexing article trending of quarter");

    const articles = await this.articleRepository.find({
      where: {
        favoriteCount: MoreThan(MIN_FAVORITE_TREDNING_ARTICLE),
        created: MoreThan(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)),
      },
    });

    const articlesRO = articles.map((article) =>
      this.articleService.buildArticleRO(article)
    );

    // await this.redisCacheService.set(
    //   "trending",
    //   articlesRO,
    //   ARTICLE_TREDNING_TTL
    // );
  }
}
