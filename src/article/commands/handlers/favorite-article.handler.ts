import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { ArticleEntity } from "../../article.entity";
import { FavoriteArticleCommand } from "../impl";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { MessageType } from "../../article.enum";
import { HttpException, HttpStatus } from "@nestjs/common";

@CommandHandler(FavoriteArticleCommand)
export class FavoriteArticleCommandHandler
  implements ICommandHandler<FavoriteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,

    private readonly articleService: ArticleService,
    private readonly publisher: PublisherService
  ) {}

  async execute({ userId, slug }: FavoriteArticleCommand): Promise<ArticleRO> {
    try {
      let article = await this.articleRepository.findOne(
        { slug },
        {
          relations: ["author"],
        }
      );
      const user = await this.userRepository.findOne(userId, {
        relations: ["favorites"],
      });

      if (!article) {
        throw new HttpException("Article not found", HttpStatus.BAD_REQUEST);
      }

      const isNewFavorite =
        user.favorites.findIndex((_article) => _article.id === article.id) < 0;
      if (isNewFavorite) {
        user.favorites.push(article);
        article.favoriteCount++;

        await this.userRepository.save(user);
        article = await this.articleRepository.save(article);
      }

      this.publisher.publish(QUEUE_NAME, {
        type: MessageType.ARTICLE_FAVORITED,
        payload: {
          user,
          article,
        },
      });

      return { article: this.articleService.buildArticleRO(article, user) };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
