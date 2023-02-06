import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../config";
import { ArticleRO } from "../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { ArticleEntity } from "../../core/entities/article.entity";
import { CommentEntity } from "../../core/entities/comment.entity";
import { DeleteCommentCommand } from "../impl";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { MessageType } from "../../core/enums/article.enum";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity, WRITE_CONNECTION)
    private readonly commentRepository: Repository<CommentEntity>,

    private readonly articleService: ArticleService,
    private readonly publisher: PublisherService
  ) {}

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
      await this.commentRepository.delete(deleteComments[0].id);
      article = await this.articleRepository.save(article);

      this.publisher.publish(QUEUE_NAME, {
        type: MessageType.COMMENT_DELETED,
        payload: {
          comment: deleteComments[0],
        },
      });

      return { article: this.articleService.buildArticleRO(article) };
    } else {
      return { article: this.articleService.buildArticleRO(article) };
    }
  }
}
