import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import * as AWS from "aws-sdk";

import {
  ARTICLE_REPOSITORY,
  ArticleEntity,
  ArticlePort,
  ArticleRO,
} from "../../../core";
import { ArticleService } from "../../services";
import { CreateArticleCommand } from "../impl";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  private readonly sqs: AWS.SQS;
  private readonly awsRegion: string =
    process.env.AWS_REGION || "ap-southeast-1";
  private readonly queueUrl: string =
    process.env.AWS_SQS_QUEUE_URL || "ARTICLE_QUEUE_URL";

  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService
  ) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: this.awsRegion,
    });
    this.sqs = new AWS.SQS();
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
        const params: AWS.SQS.Types.SendMessageRequest = {
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify({ article }),
        };
        await this.sqs.sendMessage(params).promise();
      }

      return {
        article: this.articleService.buildArticleRO(article),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
