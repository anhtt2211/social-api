import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../../config";
import { UserEntity } from "../../../../user/core/entities/user.entity";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { ArticleUnFavoritedEvent } from "../impl";

@EventsHandler(ArticleUnFavoritedEvent)
export class ArticleUnFavoritedEventHandler
  implements IEventHandler<ArticleUnFavoritedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async handle({ user, article }: ArticleUnFavoritedEvent) {
    try {
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
