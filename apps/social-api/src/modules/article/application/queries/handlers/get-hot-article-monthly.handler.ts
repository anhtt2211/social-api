import { FORMAT_DATE } from "@configs";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import * as moment from "moment";

import { ArticleService } from "@article/application/services";
import { RedisService } from "@redis/redis.service";
import {
  ARTICLE_REPOSITORY,
  ArticleData,
  ArticleEntity,
  ArticlePort,
  DEFAULT_HOT_ARTICLE_MONTHLY,
  HOT_ARTICLES_MONTHLY_KEY,
} from "../../../core";
import { GetHotArticleMonthlyQuery } from "../impl";

@QueryHandler(GetHotArticleMonthlyQuery)
export class GetHotArticleMonthlyQueryHandler
  implements IQueryHandler<GetHotArticleMonthlyQuery>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({}: GetHotArticleMonthlyQuery): Promise<ArticleData[]> {
    let hotArticlesMonthly: ArticleEntity[] = [];

    const hotArticlesMonthlyCache = await this.redisCacheService.get(
      HOT_ARTICLES_MONTHLY_KEY
    );
    hotArticlesMonthly = JSON.parse(hotArticlesMonthlyCache) as ArticleEntity[];

    if (!hotArticlesMonthly) {
      const currentMonthStart = moment().startOf("month").format(FORMAT_DATE);
      const currentMonthEnd = moment().endOf("month").format(FORMAT_DATE);

      hotArticlesMonthly = await this.articleRepository
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
        JSON.stringify(hotArticlesMonthly)
      );
    }

    const articles = hotArticlesMonthly.map((article) =>
      this.articleService.buildArticleRO(article)
    );
    return articles;
  }
}
