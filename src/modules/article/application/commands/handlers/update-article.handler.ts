import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ARTICLE_REPOSITORY, ArticlePort, ArticleRO } from "../../../core";
import { ArticleService } from "../../services";
import { UpdateArticleCommand } from "../impl";

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleCommandHandler
  implements ICommandHandler<UpdateArticleCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService
  ) {}

  async execute({
    slug,
    articleData,
  }: UpdateArticleCommand): Promise<ArticleRO> {
    try {
      let toUpdate = await this.articleRepository.findOne({ slug: slug });
      let updated = Object.assign(toUpdate, articleData);
      const article = await this.articleRepository.save(updated);

      // TODO: Publish an message to SQS
      // if (article) {
      //   this.articleRmqClient.emit<any, IPayloadArticleUpdated>(
      //     { cmd: MessageCmd.ARTICLE_CREATED },
      //     { article }
      //   );
      // }

      return {
        article: this.articleService.buildArticleRO(article),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
