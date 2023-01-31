import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Repository } from "typeorm";
import { BlockEntity } from "../../../block/block.entity";
import { WRITE_CONNECTION } from "../../../config";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { ArticleEntity } from "../../article.entity";
import { MessageType } from "../../article.enum";
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

      this.publisher.publish(QUEUE_NAME, {
        type: MessageType.ARTICLE_DELETED,
        payload: { userId, slug },
      });

      return _deleted;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
