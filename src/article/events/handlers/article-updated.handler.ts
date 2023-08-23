import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { ArticleEntity } from "../../core/entities/article.entity";
import { ArticleUpdatedEvent } from "../impl";

@EventsHandler(ArticleUpdatedEvent)
export class ArticleUpdatedEventHandler
  implements IEventHandler<ArticleUpdatedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>
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