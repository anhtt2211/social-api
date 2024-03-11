import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { RedisService } from "@redis/redis.service";
import { ArticleData, ArticleEntity, HOT_ARTICLES_KEY } from "../../../core";
import { GetHotArticleQuery } from "../impl";
import { ArticleService } from "@article/application/services";

@QueryHandler(GetHotArticleQuery)
export class GetHotArticleQueryHandler
  implements IQueryHandler<GetHotArticleQuery>
{
  constructor(
    private readonly articleService: ArticleService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({}: GetHotArticleQuery): Promise<ArticleData[]> {
    const hotArticlesCache = await this.redisCacheService.get(HOT_ARTICLES_KEY);
    const hotArticles = JSON.parse(hotArticlesCache) as ArticleEntity[];

    const articles = hotArticles.map((article) =>
      this.articleService.buildArticleRO(article)
    );
    return articles;
  }
}
