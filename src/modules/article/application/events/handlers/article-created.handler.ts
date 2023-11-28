import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { ArticleReadPort } from "../../../core/ports";
import { ARTICLE_READ_REPOSITORY } from "../../../core/token";
import { ArticleCreatedEvent } from "../impl";

@EventsHandler(ArticleCreatedEvent)
export class ArticleCreatedEventHandler
  implements IEventHandler<ArticleCreatedEvent>
{
  constructor(
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort
  ) {}
  async handle({ article }: ArticleCreatedEvent) {
    try {
      await this.articleRepository.save(article);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
