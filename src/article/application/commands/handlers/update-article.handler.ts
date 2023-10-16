import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../configs";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { ARTICLE_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { MessageType } from "../../../core/enums/article.enum";
import { ArticleRO } from "../../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { UpdateArticleCommand } from "../impl";

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleCommandHandler
  implements ICommandHandler<UpdateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly articleService: ArticleService,
    private readonly publisher: PublisherService
  ) {}

  async execute({
    slug,
    articleData,
  }: UpdateArticleCommand): Promise<ArticleRO> {
    try {
      let toUpdate = await this.articleRepository.findOne({ slug: slug });
      let updated = Object.assign(toUpdate, articleData);
      const article = await this.articleRepository.save(updated);

      if (article) {
        this.publisher.publish(ARTICLE_QUEUE, {
          type: MessageType.ARTICLE_UPDATED,
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