import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ARTICLE_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { MessageCmd } from "../../../core/enums/article.enum";
import {
  ArticleRO,
  IPayloadArticleCreated,
} from "../../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { CreateArticleCommand } from "../impl";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
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
