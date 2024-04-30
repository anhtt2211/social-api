import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { RedisService } from "@redis/redis.service";
import {
  ARTICLE_REPOSITORY,
  ArticleData,
  ArticleEntity,
  ArticlePort,
  DEFAULT_HOT_ARTICLE,
  HOT_ARTICLES_KEY,
} from "../../../core";
import { GetHotArticleQuery } from "../impl";
import { ArticleService } from "@article/application/services";
import { Inject } from "@nestjs/common";

@QueryHandler(GetHotArticleQuery)
export class GetHotArticleQueryHandler
  implements IQueryHandler<GetHotArticleQuery>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({}: GetHotArticleQuery): Promise<ArticleData[]> {
    let hotArticles: ArticleEntity[] = [];

    const hotArticlesCache = await this.redisCacheService.get(HOT_ARTICLES_KEY);
    hotArticles = JSON.parse(hotArticlesCache) as ArticleEntity[];

    if (!hotArticles) {
      hotArticles = await this.articleRepository
        .createQueryBuilder("article")
        .where("article.favoriteCount >= :count", {
          count: DEFAULT_HOT_ARTICLE,
        })
        .orderBy("article.favoriteCount", "DESC")
        .getMany();

      this.redisCacheService.set(HOT_ARTICLES_KEY, JSON.stringify(hotArticles));
    }

    const articles = hotArticles.map((article) =>
      this.articleService.buildArticleRO(article)
    );
    return articles;
  }
}
