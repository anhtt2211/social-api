import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
// import { UserEntity } from "../../../user/user.entity";
import { UserWrite_DBEntity } from "../../../user/user.writedb.entity";
import { ArticleWrite_DBEntity } from "../../article.writedb.entity";
import { CommentRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { Comment } from "../../comment.entity";
import { CreateCommentCommand } from "../impl";

@CommandHandler(CreateCommentCommand)
export class CreateCommentCommandHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(ArticleWrite_DBEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleWrite_DBEntity>,
    @InjectRepository(UserWrite_DBEntity, WriteConnection)
    private readonly userRepository: Repository<UserWrite_DBEntity>,
    @InjectRepository(Comment, WriteConnection)
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
