import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { USER_REPOSITORY, UserPort } from "@user/core";
import {
  ARTICLE_REPOSITORY,
  ArticlePort,
  COMMENT_REPOSITORY,
  CommentEntity,
  CommentPort,
  CommentRO,
} from "../../../core";
import { ArticleService } from "../../services";
import { CreateCommentCommand } from "../impl";

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentPort,

    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    slug,
    commentData,
  }: CreateCommentCommand): Promise<CommentRO> {
    try {
      let article = await this.articleRepository.findOne(
        { slug },
        { select: ["id"] }
      );
      const author = await this.userRepository.findOne(userId);

      if (!article) {
        throw new HttpException("Article not found!", HttpStatus.BAD_REQUEST);
      }

      const comment = new CommentEntity({
        ...commentData,
        author,
        article: {
          id: article.id,
        },
      });
      await this.commentRepository.save(comment);

      const commentRO = this.articleService.buildCommentRO(comment);
      return {
        comment: commentRO,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
