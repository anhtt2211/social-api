import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { DeleteResult } from "typeorm";

import { ARTICLE_RMQ_CLIENT } from "../../../../configs";
import { MessageCmd } from "../../../core/enums";
import { IPayloadArticleDeleted } from "../../../core/interfaces";
import { ArticleWritePort, BlockWritePort } from "../../../core/ports";
import { CommentWritePort } from "../../../core/ports/comment.port";
import {
  ARTICLE_WRITE_REPOSITORY,
  BLOCK_WRITE_REPOSITORY,
  COMMENT_WRITE_REPOSITORY,
} from "../../../core/token";
import { DeleteArticleCommand } from "../impl";

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleCommandHandler
  implements ICommandHandler<DeleteArticleCommand>
{
  constructor(
    @Inject(ARTICLE_WRITE_REPOSITORY)
    private readonly articleRepository: ArticleWritePort,
    @Inject(BLOCK_WRITE_REPOSITORY)
    private readonly blockRepository: BlockWritePort,
    @Inject(COMMENT_WRITE_REPOSITORY)
    private readonly commentRepository: CommentWritePort,
    @Inject(ARTICLE_RMQ_CLIENT)
    private readonly articleRmqClient: ClientProxy
  ) {
    this.articleRmqClient.connect();
  }

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

      if (_deleted) {
        this.articleRmqClient.emit<any, IPayloadArticleDeleted>(
          { cmd: MessageCmd.ARTICLE_DELETED },
          { userId, slug }
        );
      }

      return _deleted;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
