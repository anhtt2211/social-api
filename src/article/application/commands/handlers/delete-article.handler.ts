import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

import { ARTICLE_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import {
  ArticleEntity,
  BlockEntity,
  CommentEntity,
  IPayloadArticleDeleted,
  MessageCmd,
} from "../../../core";
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
    @InjectRepository(CommentEntity, WRITE_CONNECTION)
    private readonly commentRepository: Repository<CommentEntity>,
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
