import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import {
  ARTICLE_REPOSITORY,
  ArticlePort,
  ArticleRO,
  COMMENT_REPOSITORY,
  CommentPort,
} from "../../../core";
import { ArticleService } from "../../services";
import { DeleteCommentCommand } from "../impl";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentPort,

    private readonly articleService: ArticleService
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

      return { article: this.articleService.buildArticleRO(article) };
    } else {
      return { article: this.articleService.buildArticleRO(article) };
    }
  }
}
