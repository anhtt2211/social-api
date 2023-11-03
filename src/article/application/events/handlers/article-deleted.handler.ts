import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import {
  ArticleReadPort,
  BlockReadPort,
  CommentReadPort,
} from "../../../core/ports";
import {
  ARTICLE_READ_REPOSITORY,
  BLOCK_READ_REPOSITORY,
  COMMENT_READ_REPOSITORY,
} from "../../../core/token";
import { ArticleDeletedEvent } from "../impl";

@EventsHandler(ArticleDeletedEvent)
export class ArticleDeletedEventHandler
  implements IEventHandler<ArticleDeletedEvent>
{
  constructor(
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort,
    @Inject(BLOCK_READ_REPOSITORY)
    private readonly blockRepository: BlockReadPort,
    @Inject(COMMENT_READ_REPOSITORY)
    private readonly commentRepository: CommentReadPort
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
