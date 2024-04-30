import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { USER_REPOSITORY, UserPort } from "@user/core";
import { ARTICLE_REPOSITORY, ArticlePort, ArticleRO } from "../../../core";
import { ArticleService } from "../../services";
import { UnFavoriteArticleCommand } from "../impl";

@CommandHandler(UnFavoriteArticleCommand)
export class UnFavoriteArticleCommandHandler
  implements ICommandHandler<UnFavoriteArticleCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,

    private readonly articleService: ArticleService
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

    return { article: this.articleService.buildArticleRO(article, user) };
  }
}
