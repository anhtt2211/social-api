import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { ArticleService } from "@article/application/services";
import { RedisService } from "@redis/redis.service";
import {
  ArticleData,
  ArticleEntity,
  HOT_ARTICLES_MONTHLY_KEY,
} from "../../../core";
import { GetHotArticleMonthlyQuery } from "../impl";

@QueryHandler(GetHotArticleMonthlyQuery)
export class GetHotArticleMonthlyQueryHandler
  implements IQueryHandler<GetHotArticleMonthlyQuery>
{
  constructor(
    private readonly articleService: ArticleService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({}: GetHotArticleMonthlyQuery): Promise<ArticleData[]> {
    const hotArticlesMonthlyCache = await this.redisCacheService.get(
      HOT_ARTICLES_MONTHLY_KEY
    );
    const hotArticlesMonthly = JSON.parse(
      hotArticlesMonthlyCache
    ) as ArticleEntity[];

    const articles = hotArticlesMonthly.map((article) =>
      this.articleService.buildArticleRO(article)
    );
    return articles;
  }
}
