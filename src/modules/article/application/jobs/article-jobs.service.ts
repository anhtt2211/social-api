import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as moment from "moment";

import {
  ARTICLE_REPOSITORY,
  ArticlePort,
  DEFAULT_HOT_ARTICLE,
  DEFAULT_HOT_ARTICLE_MONTHLY,
  HOT_ARTICLES_KEY,
  HOT_ARTICLES_MONTHLY_KEY,
} from "@article/core";
import { FORMAT_DATE } from "@configs";
import { RedisService } from "@redis/redis.service";

@Injectable()
export class ArticleJobsService {
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly redisCacheService: RedisService
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async indexingHotArticle() {
    const hotArticles = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.favoriteCount >= :count", {
        count: DEFAULT_HOT_ARTICLE,
      })
      .orderBy("article.favoriteCount", "DESC")
      .getMany();

    this.redisCacheService.set(HOT_ARTICLES_KEY, JSON.stringify(hotArticles));
  }

  @Cron(CronExpression.EVERY_WEEK)
  async indexingHotArticleWeekly() {
    const currentMonthStart = moment().startOf("month").format(FORMAT_DATE);
    const currentMonthEnd = moment().endOf("month").format(FORMAT_DATE);

    const hotArticles = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.favoriteCount >= :favoriteCount", {
        favoriteCount: DEFAULT_HOT_ARTICLE_MONTHLY,
      })
      .andWhere("article.created BETWEEN :startDate AND :endDate", {
        startDate: currentMonthStart,
        endDate: currentMonthEnd,
      })
      .orderBy("article.created", "DESC")
      .getMany();

    this.redisCacheService.set(
      HOT_ARTICLES_MONTHLY_KEY,
      JSON.stringify(hotArticles)
    );
  }
}
