import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../configs";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { ARTICLE_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../../user/core/entities/user.entity";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { MessageType } from "../../../core/enums/article.enum";
import { ArticleRO } from "../../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { FavoriteArticleCommand } from "../impl";

@CommandHandler(FavoriteArticleCommand)
export class FavoriteArticleCommandHandler
  implements ICommandHandler<FavoriteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WRITE_CONNECTION)
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

        const _user = await this.userRepository.save(user);
        article = await this.articleRepository.save(article);

        if (_user && article) {
          this.publisher.publish(ARTICLE_QUEUE, {
            type: MessageType.ARTICLE_FAVORITED,
            payload: {
              user,
              article,
            },
          });
        }
      }

      return { article: this.articleService.buildArticleRO(article, user) };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}