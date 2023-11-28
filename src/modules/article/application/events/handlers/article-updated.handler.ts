import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { ArticleReadPort } from "../../../core/ports";
import { ARTICLE_READ_REPOSITORY } from "../../../core/token";
import { ArticleUpdatedEvent } from "../impl";

@EventsHandler(ArticleUpdatedEvent)
export class ArticleUpdatedEventHandler
  implements IEventHandler<ArticleUpdatedEvent>
{
  constructor(
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort
  ) {}
  async handle({ article }: ArticleUpdatedEvent) {
    try {
      let toUpdate = await this.articleRepository.findOne(
        {
          slug: article.slug,
        },
        {
          relations: ["blocks"],
        }
      );
      let updated = Object.assign(toUpdate, article);
      await this.articleRepository.save(updated);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
