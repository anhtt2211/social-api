import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { CreatedArticleEvent } from "../impl";

@EventsHandler(CreatedArticleEvent)
export class CreatedArticleEventHandler
  implements IEventHandler<CreatedArticleEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, ReadConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, ReadConnection)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async handle({ userId, article }: CreatedArticleEvent) {
    const _article = new ArticleEntity(article);

    await this.articleRepository.save(_article);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    author.articles.push(_article);

    await this.userRepository.save(author);
  }
}
