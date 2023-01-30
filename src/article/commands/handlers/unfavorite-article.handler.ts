import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { ArticleEntity } from "../../article.entity";
import { UnFavoriteArticleCommand } from "../impl";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { MessageType } from "../../article.enum";

@CommandHandler(UnFavoriteArticleCommand)
export class UnFavoriteArticleCommandHandler
  implements ICommandHandler<UnFavoriteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WriteConnection)
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

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    this.publisher.publish(QUEUE_NAME, {
      type: MessageType.ARTICLE_UNFAVORITED,
      payload: {
        user,
        article,
      },
    });

    return { article: this.articleService.buildArticleRO(article, user) };
  }
}
