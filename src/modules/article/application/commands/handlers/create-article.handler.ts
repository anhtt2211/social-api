import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";

import { ARTICLE_RMQ_CLIENT } from "@configs";
import { ArticleService } from "../../services";
import { CreateArticleCommand } from "../impl";
import {
  ARTICLE_WRITE_REPOSITORY,
  ArticleEntity,
  ArticleRO,
  ArticleWritePort,
  IPayloadArticleCreated,
  MessageCmd,
} from "../../../core";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @Inject(ARTICLE_WRITE_REPOSITORY)
    private readonly articleRepository: ArticleWritePort,
    @Inject(ARTICLE_RMQ_CLIENT)
    private readonly articleRmqClient: ClientProxy,

    private readonly articleService: ArticleService
  ) {
    this.articleRmqClient.connect();
  }

  async execute({
    userId,
    articleData,
  }: CreateArticleCommand): Promise<ArticleRO> {
    try {
      const article = await this.articleRepository.save(
        new ArticleEntity({
          ...articleData,
          slug: this.articleService.slugify(articleData.title),
          author: {
            id: userId,
          },
        })
      );

      if (article) {
        this.articleRmqClient.emit<any, IPayloadArticleCreated>(
          { cmd: MessageCmd.ARTICLE_CREATED },
          { article }
        );
      }

      return {
        article: this.articleService.buildArticleRO(article),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
