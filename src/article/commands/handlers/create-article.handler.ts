import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { ArticleEntity } from "../../article.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { CreateArticleCommand } from "../impl";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly articleService: ArticleService,
    private readonly publisher: PublisherService
  ) {}

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

      this.publisher.publish(QUEUE_NAME, {
        type: "article_created",
        payload: { article },
      });

      return {
        article: this.articleService.buildArticleRO(article),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
