import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticleFavoritedEvent } from "../impl";

@EventsHandler(ArticleFavoritedEvent)
export class ArticleFavoritedEventHandler
  implements IEventHandler<ArticleFavoritedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, ReadConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, ReadConnection)
    private readonly userRepository: Repository<UserEntity>
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
