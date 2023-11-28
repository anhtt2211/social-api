import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { FOLLOW_READ_REPOSITORY, FollowReadPort } from "@profile/core";
import { USER_READ_REPOSITORY, UserReadPort } from "@user/core";
import { ArticlesRO } from "../../../core/interfaces";
import { ArticleReadPort } from "../../../core/ports";
import { ARTICLE_READ_REPOSITORY } from "../../../core/token";
import { ArticleService } from "../../services";
import { FindFeedArticleQuery } from "../impl";

@QueryHandler(FindFeedArticleQuery)
export class FindFeedArticleQueryHandler
  implements IQueryHandler<FindFeedArticleQuery>
{
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort,
    @Inject(FOLLOW_READ_REPOSITORY)
    private readonly followsRepository: FollowReadPort,
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort,

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
