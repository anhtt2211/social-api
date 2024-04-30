import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { USER_REPOSITORY, UserPort } from "@user/core";
import { ARTICLE_REPOSITORY, ArticlePort, ArticleRO } from "../../../core";
import { ArticleService } from "../../services";
import { FavoriteArticleCommand } from "../impl";

@CommandHandler(FavoriteArticleCommand)
export class FavoriteArticleCommandHandler
  implements ICommandHandler<FavoriteArticleCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,

    private readonly articleService: ArticleService
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

      return { article: this.articleService.buildArticleRO(article, user) };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
