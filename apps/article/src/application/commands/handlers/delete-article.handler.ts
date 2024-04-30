import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteResult } from "typeorm";

import {
  ARTICLE_REPOSITORY,
  ArticlePort,
  BLOCK_REPOSITORY,
  BlockPort,
  COMMENT_REPOSITORY,
  CommentPort,
} from "../../../core";
import { DeleteArticleCommand } from "../impl";

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleCommandHandler
  implements ICommandHandler<DeleteArticleCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,
    @Inject(BLOCK_REPOSITORY)
    private readonly blockRepository: BlockPort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentPort
  ) {}

  async execute({ userId, slug }: DeleteArticleCommand): Promise<DeleteResult> {
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
          HttpStatus.BAD_REQUEST
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

      const _deleted = await this.articleRepository.delete({ slug: slug });

      // TODO: Publish an message to SQS
      // if (_deleted) {
      //   this.articleRmqClient.emit<any, IPayloadArticleDeleted>(
      //     { cmd: MessageCmd.ARTICLE_DELETED },
      //     { userId, slug }
      //   );
      // }

      return _deleted;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
