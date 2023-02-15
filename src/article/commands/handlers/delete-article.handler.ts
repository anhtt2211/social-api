import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../config";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { ARTICLE_QUEUE } from "../../../rabbitmq/rabbitmq.constants";
import { ArticleEntity } from "../../core/entities/article.entity";
import { BlockEntity } from "../../core/entities/block.entity";
import { MessageType } from "../../core/enums/article.enum";
import { DeleteArticleCommand } from "../impl";

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleCommandHandler
  implements ICommandHandler<DeleteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(BlockEntity, WRITE_CONNECTION)
    private readonly blockRepository: Repository<BlockEntity>,

    private readonly publisher: PublisherService
  ) {}

  async execute({ userId, slug }: DeleteArticleCommand): Promise<DeleteResult> {
    try {
      const article = await this.articleRepository.findOne(
        { slug },
        {
          relations: ["author", "blocks"],
        }
      );

      if (article.author.id !== userId) {
        throw new HttpException(
          { message: "Cannot delete this article because you is not author" },
          400
        );
      }

      const blockIds = article.blocks.map((block) => block.id);
      await this.blockRepository.delete({
        id: In(blockIds),
      });

      const _deleted = await this.articleRepository.delete({ slug: slug });

      if (_deleted) {
        this.publisher.publish(ARTICLE_QUEUE, {
          type: MessageType.ARTICLE_DELETED,
          payload: { userId, slug },
        });
      }

      return _deleted;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
