import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";

import { ARTICLE_RMQ_CLIENT } from "@configs";
import { USER_WRITE_REPOSITORY, UserWritePort } from "@user/core";
import { MessageCmd } from "../../../core/enums";
import { ArticleRO, IPayloadArticleFavorited } from "../../../core/interfaces";
import { ArticleWritePort } from "../../../core/ports";
import { ARTICLE_WRITE_REPOSITORY } from "../../../core/token";
import { ArticleService } from "../../services";
import { UnFavoriteArticleCommand } from "../impl";

@CommandHandler(UnFavoriteArticleCommand)
export class UnFavoriteArticleCommandHandler
  implements ICommandHandler<UnFavoriteArticleCommand>
{
  constructor(
    @Inject(ARTICLE_WRITE_REPOSITORY)
    private readonly articleRepository: ArticleWritePort,
    @Inject(USER_WRITE_REPOSITORY)
    private readonly userRepository: UserWritePort,
    @Inject(ARTICLE_RMQ_CLIENT)
    private readonly articleRmqClient: ClientProxy,

    private readonly articleService: ArticleService
  ) {
    this.articleRmqClient.connect();
  }

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
        this.articleRmqClient.emit<any, IPayloadArticleFavorited>(
          { cmd: MessageCmd.ARTICLE_UNFAVORITED },
          { user, article }
        );
      }
    }

    return { article: this.articleService.buildArticleRO(article, user) };
  }
}
