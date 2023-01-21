import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { CommentRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { Comment } from "../../comment.entity";
import { CreateCommentCommand } from "../impl";

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    slug,
    commentData,
  }: CreateCommentCommand): Promise<CommentRO> {
    let article = await this.articleRepository.findOne({ slug });
    const author = await this.userRepository.findOne(userId);

    const comment = new Comment();
    comment.body = commentData.body;
    comment.author = author;
    await this.commentRepository.save(comment);

    article.comments.push(comment);
    await this.articleRepository.save(article);

    const commentRO = this.articleService.buildCommentRO(comment);
    return {
      comment: commentRO,
    };
  }
}
