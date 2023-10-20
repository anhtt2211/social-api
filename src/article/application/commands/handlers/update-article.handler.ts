import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ARTICLE_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import { ArticleEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import { ArticleRO, IPayloadArticleUpdated } from "../../../core/interfaces";
import { ArticleService } from "../../services";
import { UpdateArticleCommand } from "../impl";

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleCommandHandler
  implements ICommandHandler<UpdateArticleCommand>
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
    slug,
    articleData,
  }: UpdateArticleCommand): Promise<ArticleRO> {
    try {
      let toUpdate = await this.articleRepository.findOne({ slug: slug });
      let updated = Object.assign(toUpdate, articleData);
      const article = await this.articleRepository.save(updated);

      if (article) {
        this.articleRmqClient.emit<any, IPayloadArticleUpdated>(
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
