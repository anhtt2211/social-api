import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { USER_READ_REPOSITORY, UserReadPort } from "../../../../user/core";
import { ArticleReadPort } from "../../../core/ports";
import { ARTICLE_READ_REPOSITORY } from "../../../core/token";
import { ArticleFavoritedEvent } from "../impl";

@EventsHandler(ArticleFavoritedEvent)
export class ArticleFavoritedEventHandler
  implements IEventHandler<ArticleFavoritedEvent>
{
  constructor(
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort,
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort
  ) {}
  async handle({ user, article }: ArticleFavoritedEvent) {
    try {
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
