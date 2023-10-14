import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../../configs";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { ArticleCreatedEvent } from "../impl";

@EventsHandler(ArticleCreatedEvent)
export class ArticleCreatedEventHandler
  implements IEventHandler<ArticleCreatedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}
  async handle({ article }: ArticleCreatedEvent) {
    try {
      await this.articleRepository.save(article);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
