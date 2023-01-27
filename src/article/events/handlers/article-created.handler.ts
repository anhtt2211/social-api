import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticleCreatedEvent } from "../impl";

@EventsHandler(ArticleCreatedEvent)
export class ArticleCreatedEventHandler
  implements IEventHandler<ArticleCreatedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, ReadConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, ReadConnection)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async handle({ userId, article }: ArticleCreatedEvent) {
    await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    author.articles.push(article);

    await this.userRepository.save(author);
  }
}
