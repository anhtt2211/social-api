import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../config";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { ARTICLE_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { MessageType } from "../../../core/enums/article.enum";
import { ArticleRO } from "../../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { CreateArticleCommand } from "../impl";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
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

      if (article) {
        this.publisher.publish(ARTICLE_QUEUE, {
          type: MessageType.ARTICLE_CREATED,
          payload: { article },
        });
      }

      return {
        article: this.articleService.buildArticleRO(article),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
