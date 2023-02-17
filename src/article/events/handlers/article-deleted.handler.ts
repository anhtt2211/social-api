import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { ArticleDeletedEvent } from "../impl";
import { CommentEntity, ArticleEntity, BlockEntity } from "../../core";

@EventsHandler(ArticleDeletedEvent)
export class ArticleDeletedEventHandler
  implements IEventHandler<ArticleDeletedEvent>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(BlockEntity, READ_CONNECTION)
    private readonly blockRepository: Repository<BlockEntity>,
    @InjectRepository(CommentEntity, READ_CONNECTION)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}
  async handle({ userId, slug }: ArticleDeletedEvent) {
    try {
      const article = await this.articleRepository.findOne(
        { slug },
        {
          relations: ["author"],
        }
      );

      if (article.author.id !== userId) {
        throw new HttpException(
          { message: "Cannot delete this article because you is not author" },
          400
        );
      }

      await this.blockRepository.delete({
        article: {
          id: article.id,
        },
      });
      await this.commentRepository.delete({
        article: {
          id: article.id,
        },
      });

      await this.articleRepository.delete({ slug: slug });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
