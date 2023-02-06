import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { BlockEntity } from "../../core/entities/block.entity";
import { READ_CONNECTION } from "../../../config";
import { ArticleEntity } from "../../core/entities/article.entity";
import { ArticleDeletedEvent } from "../impl";

@EventsHandler(ArticleDeletedEvent)
export class ArticleDeletedEventHandler
  implements IEventHandler<ArticleDeletedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(BlockEntity, READ_CONNECTION)
    private readonly blockRepository: Repository<BlockEntity>
  ) {}
  async handle({ userId, slug }: ArticleDeletedEvent) {
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

      await this.articleRepository.delete({ slug: slug });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
