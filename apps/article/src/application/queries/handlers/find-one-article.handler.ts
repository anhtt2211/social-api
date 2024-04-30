import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { FOLLOW_REPOSITORY, FollowPort } from "@profile/core";
import { USER_REPOSITORY, UserPort } from "@user/core";
import { ARTICLE_REPOSITORY, ArticlePort, ArticleRO } from "../../../core";
import { ArticleService } from "../../services";
import { FindOneArticleQuery } from "../impl";

@QueryHandler(FindOneArticleQuery)
export class FindOneArticleQueryHandler
  implements IQueryHandler<FindOneArticleQuery>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followsRepository: FollowPort,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, slug }: FindOneArticleQuery): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["blocks", "author"],
      }
    );

    if (!article) {
      throw new HttpException("Article not found", HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ["favorites"] }
    );

    const follows = await this.followsRepository.findOne({
      followerId: userId,
      followingId: article.author.id,
    });

    const articleData = this.articleService.buildArticleRO(
      article,
      user,
      !!follows
    );
    return { article: articleData };
  }
}
