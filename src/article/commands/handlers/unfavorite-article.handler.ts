import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../config";
import { UserEntity } from "../../../user/core/entities/user.entity";
import { ArticleRO } from "../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { ArticleEntity } from "../../core/entities/article.entity";
import { UnFavoriteArticleCommand } from "../impl";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { MessageType } from "../../core/enums/article.enum";

@CommandHandler(UnFavoriteArticleCommand)
export class UnFavoriteArticleCommandHandler
  implements ICommandHandler<UnFavoriteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly articleService: ArticleService,
    private readonly publisher: PublisherService
  ) {}

  async execute({
    userId,
    slug,
  }: UnFavoriteArticleCommand): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["author"],
      }
    );
    const user = await this.userRepository.findOne(userId, {
      relations: ["favorites"],
    });

    const deleteIndex = user.favorites.findIndex(
      (_article) => _article.id === article.id
    );

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      const _user = await this.userRepository.save(user);
      article = await this.articleRepository.save(article);

      if (_user && article) {
        this.publisher.publish(QUEUE_NAME, {
          type: MessageType.ARTICLE_UNFAVORITED,
          payload: {
            user,
            article,
          },
        });
      }
    }

    return { article: this.articleService.buildArticleRO(article, user) };
  }
}
