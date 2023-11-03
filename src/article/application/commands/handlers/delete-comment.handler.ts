import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { Repository } from "typeorm";
import { ARTICLE_RMQ_CLIENT } from "../../../../configs";
import { ArticleEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import { ArticleRO, IPayloadCommentDeleted } from "../../../core/interfaces";
import { CommentWritePort } from "../../../core/ports/comment.port";
import {
  ARTICLE_WRITE_REPOSITORY,
  COMMENT_WRITE_REPOSITORY,
} from "../../../core/token";
import { ArticleService } from "../../services";
import { DeleteCommentCommand } from "../impl";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @Inject(ARTICLE_WRITE_REPOSITORY)
    private readonly articleRepository: Repository<ArticleEntity>,
    @Inject(COMMENT_WRITE_REPOSITORY)
    private readonly commentRepository: CommentWritePort,
    @Inject(ARTICLE_RMQ_CLIENT)
    private readonly articleRmqClient: ClientProxy,

    private readonly articleService: ArticleService
  ) {
    this.articleRmqClient.connect();
  }

  async execute({
    userId,
    slug,
    commentId,
  }: DeleteCommentCommand): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });
    if (!article) {
      throw new HttpException("Article not found", HttpStatus.BAD_REQUEST);
    }

    const comment = await this.commentRepository.findOne(commentId, {
      relations: ["author"],
    });

    if (comment.author.id !== userId) {
      throw new HttpException({ message: "You is not author of comment" }, 400);
    }

    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      const _deleted = await this.commentRepository.delete(
        deleteComments[0].id
      );
      article = await this.articleRepository.save(article);

      if (_deleted && article) {
        this.articleRmqClient.emit<any, IPayloadCommentDeleted>(
          { cmd: MessageCmd.COMMENT_DELETED },
          { comment: deleteComments[0] }
        );
      }

      return { article: this.articleService.buildArticleRO(article) };
    } else {
      return { article: this.articleService.buildArticleRO(article) };
    }
  }
}
