import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { FOLLOW_REPOSITORY, FollowPort } from "@profile/core";
import { USER_REPOSITORY, UserPort } from "@user/core";
import { ARTICLE_REPOSITORY, ArticlePort, ArticlesRO } from "@article/core";
import { ArticleService } from "../../services";
import { FindFeedArticleQuery } from "../impl";

@QueryHandler(FindFeedArticleQuery)
export class FindFeedArticleQueryHandler
  implements IQueryHandler<FindFeedArticleQuery>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followsRepository: FollowPort,
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, query }: FindFeedArticleQuery): Promise<ArticlesRO> {
    const _follows = await this.followsRepository.find({ followerId: userId });

    const user = await this.userRepository.findOne(userId, {
      relations: ["favorites"],
    });

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = _follows.map((el) => el.followingId);

    const qb = this.articleRepository
      .createQueryBuilder("article")
      .where("article.authorId IN (:...ids)", { ids })
      .leftJoinAndSelect("article.author", "author");

    if ("search" in query) {
      qb.andWhere("document_with_weights @@ plainto_tsquery(:search)", {
        search: query.search,
      }).orderBy(
        "ts_rank(document_with_weights, plainto_tsquery(:query))",
        "DESC"
      );
    }

    qb.orderBy("article.created", "DESC");

    const articlesCount = await qb.getCount();

    if ("limit" in query) {
      qb.limit(query.limit);
    }

    if ("offset" in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    const articlesRO = articles?.map((article) =>
      this.articleService.buildArticleRO(article, user, !!_follows)
    );

    return { articles: articlesRO, articlesCount };
  }
}
