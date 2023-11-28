import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { FOLLOW_READ_REPOSITORY, FollowReadPort } from "@profile/core";
import { USER_READ_REPOSITORY, UserReadPort } from "@user/core";
import { ArticleRO } from "../../../core/interfaces";
import { ArticleReadPort } from "../../../core/ports";
import { ARTICLE_READ_REPOSITORY } from "../../../core/token";
import { ArticleService } from "../../services";
import { FindOneArticleQuery } from "../impl";

@QueryHandler(FindOneArticleQuery)
export class FindOneArticleQueryHandler
  implements IQueryHandler<FindOneArticleQuery>
{
  constructor(
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort,
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort,
    @Inject(FOLLOW_READ_REPOSITORY)
    private readonly followsRepository: FollowReadPort,

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
