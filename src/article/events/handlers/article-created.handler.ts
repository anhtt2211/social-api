import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { ArticleEntity } from "../../article.entity";
import { ArticleCreatedEvent } from "../impl";

@EventsHandler(ArticleCreatedEvent)
export class ArticleCreatedEventHandler
  implements IEventHandler<ArticleCreatedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, ReadConnection)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}
  async handle({ article }: ArticleCreatedEvent) {
    await this.articleRepository.save(article);
  }
}
