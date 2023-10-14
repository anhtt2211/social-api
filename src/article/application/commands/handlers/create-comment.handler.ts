import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../configs";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { ARTICLE_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../../user/core/entities/user.entity";
import { ArticleEntity } from "../../../core/entities/article.entity";
import { CommentEntity } from "../../../core/entities/comment.entity";
import { MessageType } from "../../../core/enums/article.enum";
import { CommentRO } from "../../../core/interfaces/article.interface";
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

    private readonly articleService: ArticleService,
    private readonly publisher: PublisherService
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

      if (comment) {
        this.publisher.publish(ARTICLE_QUEUE, {
          type: MessageType.COMMENT_CREATED,
          payload: { comment },
        });
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
