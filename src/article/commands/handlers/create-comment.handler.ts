import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../config";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { MessageType } from "../../article.enum";
import { CommentRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { Comment } from "../../comment.entity";
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
    @InjectRepository(Comment, WRITE_CONNECTION)
    private readonly commentRepository: Repository<Comment>,

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

      const comment = new Comment({
        ...commentData,
        author,
        article: {
          id: article.id,
        },
      });
      await this.commentRepository.save(comment);

      this.publisher.publish(QUEUE_NAME, {
        type: MessageType.COMMENT_CREATED,
        payload: { comment },
      });

      const commentRO = this.articleService.buildCommentRO(comment);
      return {
        comment: commentRO,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
