import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ARTICLE_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import { UserEntity } from "../../../../user/core/entities";
import { ArticleEntity, CommentEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import { CommentRO, IPayloadCommentCreated } from "../../../core/interfaces";
import { ArticleService } from "../../services/article.service";
import { CreateCommentCommand } from "../impl";

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WRITE_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CommentEntity, WRITE_CONNECTION)
    private readonly commentRepository: Repository<CommentEntity>,
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
