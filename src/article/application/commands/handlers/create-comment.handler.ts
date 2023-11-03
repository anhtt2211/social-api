import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ARTICLE_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import { UserEntity } from "../../../../user/core/entities";
import { CommentEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import { CommentRO, IPayloadCommentCreated } from "../../../core/interfaces";
import { ArticleWritePort } from "../../../core/ports";
import { CommentWritePort } from "../../../core/ports/comment.port";
import {
  ARTICLE_WRITE_REPOSITORY,
  COMMENT_WRITE_REPOSITORY,
} from "../../../core/token";
import { ArticleService } from "../../services/article.service";
import { CreateCommentCommand } from "../impl";

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @Inject(ARTICLE_WRITE_REPOSITORY)
    private readonly articleRepository: ArticleWritePort,
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
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
    commentData,
  }: CreateCommentCommand): Promise<CommentRO> {
    try {
      // TODO: just select id
      let article = await this.articleRepository.findOne({
        slug,
      });
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

      if (comment) {
        this.articleRmqClient.emit<any, IPayloadCommentCreated>(
          { cmd: MessageCmd.COMMENT_CREATED },
          { comment }
        );
      }

      const commentRO = this.articleService.buildCommentRO(comment);
      return {
        comment: commentRO,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
